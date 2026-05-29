export type AdminRole = "admin" | "user";

export type AdminSessionUser = {
  userId: number;
  username: string;
  displayName: string;
  role: AdminRole;
};
