export const CUSTOMIZE_SETTINGS_MESSAGE = "cws-customize-settings";
export const CUSTOMIZE_READY_MESSAGE = "cws-customize-ready";

export type CustomizeSettingsMessage = {
  type: typeof CUSTOMIZE_SETTINGS_MESSAGE;
  settings: Record<string, string>;
};

export type CustomizeReadyMessage = {
  type: typeof CUSTOMIZE_READY_MESSAGE;
};
