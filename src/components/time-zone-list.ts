import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { buttonStyles } from "../styles.js";

export interface DeleteEventDetail {}
export type DeleteEvent = CustomEvent<DeleteEventDetail>;

@customElement("time-zone-list")
export class TimeZoneList extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    ::slotted(time-zone-list-item) {
      margin-block: var(--spacing-medium) 0;
    }
  `;

  render() {
    return html`
      <ul>
        <slot></slot>
      </ul>
    `;
  }
}

@customElement("time-zone-list-item")
export class TimeZoneListItem extends LitElement {
  static styles = [
    buttonStyles,
    css`
      :host {
        display: block;
      }
      footer {
        margin-block: var(--spacing-small) 0;
      }
    `,
  ];

  protected onDeleteClick() {
    const deleteEvent: DeleteEvent = new CustomEvent("delete");
    this.dispatchEvent(deleteEvent);
  }

  render() {
    return html`
      <li>
        <slot></slot>
        <footer>
          <button @click=${this.onDeleteClick}>Delete</button>
        </footer>
      </li>
    `;
  }
}

export function isDeleteEvent(event: Event): event is DeleteEvent {
  return (
    event instanceof CustomEvent &&
    event.type === "delete" &&
    event.detail === null
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "time-zone-list": TimeZoneList;
    "time-zone-list-item": TimeZoneListItem;
  }
}
