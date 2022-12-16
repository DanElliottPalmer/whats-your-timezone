const DEFAULT_LOCALE = "en";
const DEFAULT_TIMEZONE = "UTC";

export function getAllTimeZones(): Array<string> {
  return Intl.supportedValuesOf("timeZone").sort((a, b) => {
    return a.localeCompare(b);
  });
}

export function getUsersLocale(): string {
  return navigator.language ?? DEFAULT_LOCALE;
}

export function getUsersTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone ?? DEFAULT_TIMEZONE;
}

export function hasOwnProp(obj: unknown, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function isRecordLike<T>(data: unknown): data is Partial<T> {
  return data !== null && typeof data === "object" && !Array.isArray(data);
}
