import { LitElement, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import "./app-section.js";
import "./time-zone-search.js";
import "./time-zone-list.js";
import "./time-zone-item.js";
import "./message-format.js";
import "./message-renderer.js";
import "./custom-datetime-settings.js";

import {
  getUsersLocale,
  getUsersTimeZone,
  hasOwnProp,
  isRecordLike,
} from "../utils";
import { DEFAULT_MESSAGE_FORMAT, MessageFormat } from "./message-format";
import { TimeZoneItem } from "./time-zone-item";
import { globalClock, isTickEvent } from "../clock";
import type { ApplicationData, ApplicationDataTimeZone } from "../types";
import type { CustomDatetimeSettings } from "./custom-datetime-settings.js";
import type { MessageRendererData } from "./message-renderer";
import type { SearchEvent } from "./time-zone-search";

const LOCAL_STORAGE_KEY = "timezone-data";

@customElement("time-zone-application")
export class TimeZoneApplication extends LitElement {
  static styles = css`
    main {
      margin: 0 auto;
      max-width: 600px;
      padding-inline: var(--spacing-xsmall);
    }

    time-zone-search {
      border-bottom: 2px dashed;
      margin-block: 0 var(--spacing-medium);
      padding-block: 0 var(--spacing-medium);
    }

    time-zone-list-item + time-zone-list-item {
      border-top: 2px solid var(--color-secondary);
      padding-block: var(--spacing-medium) 0;
    }
  `;

  @state() protected _customDatetime: string | typeof nothing = nothing;
  @state() protected _messageFormat: string = DEFAULT_MESSAGE_FORMAT;
  @state() protected _timeZones: Array<ApplicationDataTimeZone> = [];
  @state() protected _userLabel: string = "";

  connectedCallback() {
    super.connectedCallback();
    globalClock.addEventListener("tick", this.onClockTick.bind(this));
  }

  constructor() {
    super();
    this.load();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    globalClock.removeEventListener("tick", this.onClockTick.bind(this));
  }

  protected formatMessageRendererData(): MessageRendererData {
    const locale = getUsersLocale();
    const now =
      this._customDatetime !== nothing
        ? new Date(this._customDatetime)
        : new Date();

    const shortTimeFormatter = new Intl.DateTimeFormat(locale, {
      timeStyle: "short",
    });

    return {
      local: {
        label: this._userLabel,
        shortTime: shortTimeFormatter.format(now),
      },
      timeZones: this._timeZones.map((timeZone, index, arr) => {
        const aaaa = new Intl.DateTimeFormat(locale, {
          timeStyle: "short",
          timeZone: timeZone.timeZone,
        });
        return {
          first: index === 0,
          label: timeZone.label,
          last: index === arr.length - 1,
          shortTime: aaaa.format(now),
        };
      }),
    };
  }

  protected load() {
    const saveDataString = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saveDataString) return;

    let saveData;
    try {
      saveData = JSON.parse(saveDataString);
    } catch (err) {
      return;
    }

    if (!this.validateSaveData(saveData)) return;

    this._userLabel = saveData.user.label;
    this._timeZones = saveData.timeZones.slice(0);
    this._messageFormat = saveData.message.format;
  }

  protected onClockTick(event: Event) {
    if (isTickEvent(event)) this.requestUpdate();
  }

  protected onCustomTimeChange(event: Event) {
    if (!event.target) return;
    const target = event.target as CustomDatetimeSettings;
    if (!target.checked || !target.datetime) {
      this._customDatetime = nothing;
      return;
    }
    this._customDatetime = target.datetime;
    this.requestUpdate();
  }

  protected onMessageFormatChange(e: Event) {
    if (!e.currentTarget) return;
    this._messageFormat = (e.currentTarget as MessageFormat).format;
    this.save();
  }

  protected onTimeZoneFormSearch(e: SearchEvent) {
    const { timeZone } = e.detail;
    this._timeZones.push({ label: getTimeZoneLabel(timeZone), timeZone });
    this.save();
    this.requestUpdate();
  }

  protected onTimeZoneUserLabelChange(label: string) {
    this._userLabel = label;
    this.save();
    this.requestUpdate();
  }

  protected onTimeZoneListItemLabelChange(index: number, label: string) {
    this._timeZones[index].label = label;
    this.save();
    this.requestUpdate();
  }

  protected onTimeZoneListItemDelete(index: number) {
    this._timeZones.splice(index, 1);
    this.save();
    this.requestUpdate();
  }

  render() {
    const userTimeZone = getUsersTimeZone();
    const hasTimeZones = this._timeZones.length > 0;
    const userLabel = getTimeZoneLabel(userTimeZone);
    if (!this._userLabel) this._userLabel = userLabel;

    const onUserLabelChange = (e: Event) => {
      if (!(e.currentTarget instanceof TimeZoneItem)) return;
      this.onTimeZoneUserLabelChange(e.currentTarget.label);
    };

    return html`
      <main>
        <app-section label="Your Time">
          <time-zone-item
            @change=${onUserLabelChange}
            datetime=${this._customDatetime}
            label=${this._userLabel}
            time-zone=${userTimeZone}
          ></time-zone-item>
          <custom-datetime-settings
            @change=${this.onCustomTimeChange}
          ></custom-datetime-settings>
        </app-section>
        <app-section label="Time Zones">
          <time-zone-search
            @search=${this.onTimeZoneFormSearch}
          ></time-zone-search>
          ${hasTimeZones
            ? html`
                <time-zone-list>
                  ${repeat(
                    this._timeZones,
                    (timeZone, index) => `${index}-${timeZone.timeZone}`,
                    (timeZone, index) => {
                      const onDelete = () =>
                        this.onTimeZoneListItemDelete(index);
                      const onChange = (e: Event) => {
                        if (!(e.currentTarget instanceof TimeZoneItem)) return;
                        this.onTimeZoneListItemLabelChange(
                          index,
                          e.currentTarget.label
                        );
                      };
                      return html`
                        <time-zone-list-item @delete=${onDelete}>
                          <time-zone-item
                            @change=${onChange}
                            datetime=${this._customDatetime}
                            label=${timeZone.label}
                            time-zone=${timeZone.timeZone}
                          ></time-zone-item>
                        </time-zone-list-item>
                      `;
                    }
                  )}
                </time-zone-list>
              `
            : html`<p>Add time zones and they will be displayed here.</p>`}
        </app-section>
        <app-section label="Message">
          <message-format
            @change=${this.onMessageFormatChange}
            format=${this._messageFormat}
          ></message-format>
          <message-renderer
            data=${JSON.stringify(this.formatMessageRendererData())}
            template=${this._messageFormat}
          ></message-renderer>
        </app-section>
      </main>
    `;
  }

  protected save() {
    const saveData: ApplicationData = {
      message: {
        format: this._messageFormat,
      },
      timeZones: this._timeZones.slice(0),
      user: { label: this._userLabel },
    };

    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData));
  }

  protected validateSaveData(data: unknown): data is ApplicationData {
    // TODO: check message format
    if (!isRecordLike<ApplicationData>(data)) return false;
    const hasUserLabel =
      hasOwnProp(data, "user") &&
      hasOwnProp(data.user, "label") &&
      typeof data.user?.label === "string";
    if (!hasUserLabel) return false;
    const hasTimeZones =
      hasOwnProp(data, "timeZones") && Array.isArray(data.timeZones);
    if (!hasTimeZones) return false;
    return (data.timeZones as Array<unknown>).every((timeZone) => {
      return (
        isRecordLike<ApplicationDataTimeZone>(timeZone) &&
        hasOwnProp(timeZone, "label") &&
        typeof timeZone.label === "string" &&
        hasOwnProp(timeZone, "timeZone") &&
        typeof timeZone.timeZone === "string"
      );
    });
  }
}

function getTimeZoneLabel(timeZone: string): string {
  return timeZone.replace(/_/g, " ");
}

declare global {
  interface HTMLElementTagNameMap {
    "time-zone-application": TimeZoneApplication;
  }
}
