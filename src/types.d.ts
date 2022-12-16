export interface ApplicationDataTimeZone {
  label: string;
  timeZone: string;
}

export interface ApplicationDataMessage {
  format: string;
}

export interface ApplicationData {
  message: ApplicationDataMessage;
  timeZones: Array<ApplicationDataTimeZone>;
  user: Pick<ApplicationDataTimeZone, "label">;
}
