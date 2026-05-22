"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

export type AlertOptions = {
  title?: string;
  message: string;
  okLabel?: string;
};

type AdminDialogContextValue = {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
  alert: (options: AlertOptions | string) => Promise<void>;
};

const AdminDialogContext = createContext<AdminDialogContextValue | null>(null);

type DialogState =
  | {
      kind: "confirm";
      title: string;
      message: string;
      confirmLabel: string;
      cancelLabel: string;
      danger: boolean;
      resolve: (value: boolean) => void;
    }
  | {
      kind: "alert";
      title: string;
      message: string;
      okLabel: string;
      resolve: () => void;
    };

function normalizeConfirm(options: ConfirmOptions | string): ConfirmOptions {
  return typeof options === "string" ? { message: options } : options;
}

function normalizeAlert(options: AlertOptions | string): AlertOptions {
  return typeof options === "string" ? { message: options } : options;
}

export function AdminDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const confirm = useCallback((options: ConfirmOptions | string) => {
    const opts = normalizeConfirm(options);
    return new Promise<boolean>((resolve) => {
      setDialog({
        kind: "confirm",
        title: opts.title ?? "Confirm",
        message: opts.message,
        confirmLabel: opts.confirmLabel ?? "Confirm",
        cancelLabel: opts.cancelLabel ?? "Cancel",
        danger: opts.danger ?? false,
        resolve,
      });
    });
  }, []);

  const alert = useCallback((options: AlertOptions | string) => {
    const opts = normalizeAlert(options);
    return new Promise<void>((resolve) => {
      setDialog({
        kind: "alert",
        title: opts.title ?? "Notice",
        message: opts.message,
        okLabel: opts.okLabel ?? "OK",
        resolve,
      });
    });
  }, []);

  const value = useMemo(() => ({ confirm, alert }), [confirm, alert]);

  function closeConfirm(result: boolean) {
    if (dialog?.kind === "confirm") {
      dialog.resolve(result);
      setDialog(null);
    }
  }

  function closeAlert() {
    if (dialog?.kind === "alert") {
      dialog.resolve();
      setDialog(null);
    }
  }

  return (
    <AdminDialogContext.Provider value={value}>
      {children}
      {dialog ? (
        <div
          className="admin-dialog-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (dialog.kind === "confirm") closeConfirm(false);
              else closeAlert();
            }
          }}
        >
          <div
            className="admin-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-dialog-title"
            aria-describedby="admin-dialog-desc"
          >
            <h2 id="admin-dialog-title" className="admin-dialog-title">
              {dialog.title}
            </h2>
            <p id="admin-dialog-desc" className="admin-dialog-message">
              {dialog.message}
            </p>
            <div className="admin-dialog-actions">
              {dialog.kind === "confirm" ? (
                <>
                  <button
                    type="button"
                    className="cms-btn cms-btn-ghost"
                    onClick={() => closeConfirm(false)}
                  >
                    {dialog.cancelLabel}
                  </button>
                  <button
                    type="button"
                    className={`cms-btn ${dialog.danger ? "cms-btn-danger" : ""}`}
                    onClick={() => closeConfirm(true)}
                    autoFocus
                  >
                    {dialog.confirmLabel}
                  </button>
                </>
              ) : (
                <button type="button" className="cms-btn" onClick={closeAlert} autoFocus>
                  {dialog.okLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </AdminDialogContext.Provider>
  );
}

export function useAdminDialog(): AdminDialogContextValue {
  const ctx = useContext(AdminDialogContext);
  if (!ctx) {
    throw new Error("useAdminDialog must be used within AdminDialogProvider");
  }
  return ctx;
}
