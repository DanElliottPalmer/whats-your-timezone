import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

import { getAllTimeZones } from "../utils.js";
import { buttonStyles } from "../styles.js";

export interface SearchEventDetail {
  timeZone: string;
}
export type SearchEvent = CustomEvent<SearchEventDetail>;

@customElement("time-zone-search")
export class TimeZoneSearch extends LitElement {
  static styles = [
    buttonStyles,
    css`
      :host {
        display: block;
      }

      select {
        box-shadow: 0 0 0 1px var(--color-secondary);
        min-height: var(--spacing-xlarge);
        transition: box-shadow 0.1s ease-in-out;
      }

      select:hover,
      select:focus {
        box-shadow: 0 0 0 3px var(--color-secondary);
      }

      .button {
        margin-inline: var(--spacing-base) 0;
        min-height: var(--spacing-xlarge);
      }
    `,
  ];

  protected onTimeZoneFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!e.target) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const newTimeZone = formData.get("time-zones") as string;
    const event: SearchEvent = new CustomEvent("search", {
      detail: { timeZone: newTimeZone },
    });
    this.dispatchEvent(event);
  }

  render() {
    const allTimeZones = getAllTimeZones();

    return html`
      <form @submit=${this.onTimeZoneFormSubmit}>
        <p><label for="time-zones">Search time zones: </label></p>
        <select id="time-zones" name="time-zones">
          ${map(
            allTimeZones,
            (timeZone) => html`<option value=${timeZone}>${timeZone}</option>`
          )}
        </select>
        <input class="button" type="submit" value="Add" />
      </form>
    `;
  }
}

export function isSearchEvent(event: Event): event is SearchEvent {
  return (
    event instanceof CustomEvent &&
    event.type === "search" &&
    event.detail !== null &&
    "timeZone" in event.detail
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "time-zone-search": TimeZoneSearch;
  }
}
