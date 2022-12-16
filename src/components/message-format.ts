import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import { textInputStyles } from "../styles";

export const DEFAULT_MESSAGE_FORMAT = `{{ &local.label }} {{ local.shortTime }}, {{# timeZones }}{{ &label }} {{ shortTime }}{{^ last }}, {{/ last }}{{/ timeZones }}`;

@customElement("message-format")
export class MessageFormat extends LitElement {
  static styles = [
    textInputStyles,
    css`
      .input-text {
        box-sizing: border-box;
        font-size: var(--font-size-sm);
        width: 100%;
      }
    `,
  ];

  textAreaRef: Ref<HTMLTextAreaElement> = createRef();

  @property({ attribute: "format", reflect: true, type: String })
  format: string = DEFAULT_MESSAGE_FORMAT;

  protected onFormChange() {
    if (!this.textAreaRef.value) return;

    this.format = this.textAreaRef.value.value;
    const event = new Event("change");
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <form @change=${this.onFormChange}>
        <p><label for="message-format">Message format: </label></p>
        <textarea
          ${ref(this.textAreaRef)}
          id="message-format"
          class="input-text"
          rows="5"
          .value=${this.format}
        ></textarea>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "message-format": MessageFormat;
  }
}
