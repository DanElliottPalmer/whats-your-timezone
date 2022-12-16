import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("custom-datetime-settings")
export class CustomDatetimeSettings extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-block: var(--spacing-small);
    }
  `;

  @property({ attribute: "checked", reflect: true, type: Boolean })
  checked: boolean = false;

  @property({ attribute: "datetime", reflect: true, type: String })
  datetime: string = "";

  protected emitChangeEvent() {
    const event = new Event("change");
    this.dispatchEvent(event);
  }

  protected onDatetimeChange(e: Event) {
    if (!e.target) return;
    this.datetime = (e.target as HTMLInputElement).value;
    this.emitChangeEvent();
  }

  protected onEnableChange(e: Event) {
    if (!e.target) return;
    this.checked = (e.target as HTMLInputElement).checked;
    this.emitChangeEvent();
  }

  render() {
    return html`
      <details>
        <summary>Set custom datetime</summary>
        <div>
          <p>
            <label
              >Enable:
              <input
                type="checkbox"
                @change=${this.onEnableChange}
                .checked=${this.checked}
            /></label>
          </p>
          <p>
            <label
              >Custom datetime:
              <input
                type="datetime-local"
                @change=${this.onDatetimeChange}
                value=${this.datetime}
            /></label>
          </p>
        </div>
      </details>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "custom-datetime-settings": CustomDatetimeSettings;
  }
}
