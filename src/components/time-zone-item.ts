import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import { textInputStyles } from "../styles";
import { getAllTimeZones, getUsersLocale } from "../utils";
import { globalClock, isTickEvent } from "../clock";

type TimeOfDayEmoji = "☀️" | "🌑";

const TIMEZONE_UTC = "UTC";
const ALLOWED_TIMEZONES = getAllTimeZones();

@customElement("time-zone-item")
export class TimeZoneItem extends LitElement {
  // YYYY-MM-DDTHH:mm:ss.sssZ
  @property({ type: String })
  datetime?: string;

  @property({ attribute: "label", reflect: true, type: String })
  label: string = TIMEZONE_UTC;

  @property({ attribute: "time-zone", type: String })
  timeZone: string = TIMEZONE_UTC;

  static styles = [
    textInputStyles,
    css`
      .timezone-item {
        display: grid;
        gap: var(--spacing-small);
        grid-template-columns: repeat(12, 1fr);
        width: 100%;
      }

      .timezone-item__left-col {
        display: grid;
        gap: var(--spacing-xsmall);
        grid-column: span 8;
        text-align: left;
      }

      .timezone-item__right-col {
        display: grid;
        grid-column: span 4;
        gap: var(--spacing-xsmall);
        text-align: center;
      }

      .timezone-item__label {
        font-weight: bold;
      }

      .timezone-item__fulldate {
        font-size: var(--font-size-sm);
      }

      .timezone-item__time {
        font-size: var(--font-size-lg);
        font-weight: bold;
      }

      .timezone-item__timezone-meta {
        font-size: var(--font-size-sm);
        font-weight: bold;
        margin: 0;
      }
    `,
  ];

  @state()
  protected _currentTime: number = Date.now();

  protected labelRef: Ref<HTMLDivElement> = createRef();

  connectedCallback() {
    super.connectedCallback();
    globalClock.addEventListener("tick", this.tick.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    globalClock.removeEventListener("tick", this.tick.bind(this));
  }

  protected onLabelBlur() {
    if (!this.labelRef.value) return;
    const labelInnerText = this.labelRef.value.innerText;
    if (this.label !== labelInnerText) {
      this.label = labelInnerText;
      const changeEvent = new Event("change");
      this.dispatchEvent(changeEvent);
    }
  }

  render() {
    if (
      TIMEZONE_UTC !== this.timeZone &&
      !ALLOWED_TIMEZONES.includes(this.timeZone)
    ) {
      throw new TypeError(`Unknown timezone: ${this.timeZone}`);
    }

    // Check datetime (if set), is a valid ISO string
    if (this.datetime && isNaN(Date.parse(this.datetime))) {
      throw new TypeError(
        `Unknown datetime: ${this.datetime}. Please ensure the value is written in the format of YYYY-MM-DDTHH:mm:ss.sssZ.`
      );
    }

    const userLocale = getUsersLocale();
    const currentTime = this.datetime ?? this._currentTime;

    const timezoneOffset = getTimezoneOffset({
      locale: userLocale,
      timeZone: this.timeZone,
    });
    const timeZoneName = getTimeZoneName({
      locale: userLocale,
      timeZone: this.timeZone,
    });

    const currentDateTime = new Date(currentTime);
    const fullDate = currentDateTime.toLocaleString(userLocale, {
      timeZone: this.timeZone,
      timeZoneName: "longOffset",
    });
    const timeOfDayEmoji = getTimeOfDayEmoji(currentDateTime, {
      locale: userLocale,
      timeZone: this.timeZone,
    });
    const time = getTime(currentDateTime, {
      locale: userLocale,
      timeZone: this.timeZone,
    });

    return html`
      <div class="timezone-item">
        <div class="timezone-item__left-col">
          <div
            ${ref(this.labelRef)}
            class="timezone-item__label input-text"
            contenteditable
            @blur=${this.onLabelBlur}
          >
            ${this.label}
          </div>
          <time class="timezone-item__fulldate" datetime=${fullDate}>
            <span aria-hidden>${timeOfDayEmoji}</span> ${fullDate}
          </time>
        </div>
        <div class="timezone-item__right-col">
          <time class="timezone-item__time" datetime=${fullDate}>${time}</time>
          <p class="timezone-item__timezone-meta">${timezoneOffset}</p>
          <p class="timezone-item__timezone-meta">${timeZoneName}</p>
        </div>
      </div>
    `;
  }

  protected tick(event: Event) {
    if (isTickEvent(event)) {
      this._currentTime = event.detail.timestamp;
      this.requestUpdate();
    }
  }
}

export function getTime(
  date: Date,
  settings: { timeZone: string; locale: string }
): string {
  const formatter = new Intl.DateTimeFormat(settings.locale, {
    timeStyle: "medium",
    timeZone: settings.timeZone,
  });
  return formatter.format(date);
}

export function getTimeOfDayEmoji(
  date: Date,
  settings: { timeZone: string; locale: string }
): TimeOfDayEmoji {
  const formatter = new Intl.DateTimeFormat(settings.locale, {
    hourCycle: "h23",
    timeStyle: "full",
    timeZone: settings.timeZone,
  });
  const hourPart = formatter
    .formatToParts(date)
    .find((part) => part.type === "hour");
  const hour = parseInt(hourPart?.value ?? "0", 10);
  return hour >= 6 && hour < 18 ? "☀️" : "🌑";
}

export function getTimezoneOffset(settings: {
  timeZone: string;
  locale: string;
}): string {
  const formatter = Intl.DateTimeFormat(settings.locale, {
    timeZone: settings.timeZone,
    timeZoneName: "longOffset",
  });
  const timeZonePart = formatter
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName");
  return timeZonePart?.value ?? "UTC";
}

export function getTimeZoneName(settings: {
  timeZone: string;
  locale: string;
}) {
  const formatter = Intl.DateTimeFormat(settings.locale, {
    timeZone: settings.timeZone,
    timeZoneName: "long",
  });
  const timeZonePart = formatter
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName");
  return timeZonePart?.value ?? "UTC";
}

declare global {
  interface HTMLElementTagNameMap {
    "time-zone-item": TimeZoneItem;
  }
}
