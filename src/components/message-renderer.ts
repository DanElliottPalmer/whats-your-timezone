import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, ref, Ref } from "lit/directives/ref.js";
import mustache from "mustache";
import { buttonStyles } from "../styles";

interface MessageRendererDataDateTime {
  label: string;
  shortTime: string;
}

interface MessageRendererDataTimeZone extends MessageRendererDataDateTime {
  first: boolean;
  last: boolean;
}

export interface MessageRendererData {
  local: MessageRendererDataDateTime;
  timeZones: Array<MessageRendererDataTimeZone>;
}

@customElement("message-renderer")
export class MessageRenderer extends LitElement {
  static styles = [
    buttonStyles,
    css`
      @keyframes fade {
        0% {
          opacity: 0;
        }
        5% {
          opacity: 1;
        }
        95% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }

      .rendered-text {
        border: 1px dashed var(--color-secondary);
        padding-block: var(--spacing-small);
        padding-inline: var(--spacing-small);
      }

      .success-copied {
        opacity: 0;
        padding-inline: 1em;
      }
    `,
  ];

  protected refCopyElement: Ref<HTMLSpanElement> = createRef();

  @state() protected _renderedValue: string = "";

  @property({ attribute: "data", type: Object })
  data?: MessageRendererData;

  @property({ attribute: "template", type: String })
  template: string = "";

  protected onClipboardClick() {
    navigator.clipboard.writeText(this._renderedValue);

    const copyElement = this.refCopyElement.value;
    if (copyElement) {
      copyElement.style.animation = "";
      requestAnimationFrame(() => {
        if (copyElement) copyElement.style.animation = "fade 3s linear";
      });
    }
  }

  render() {
    this._renderedValue = "";
    if (this.data) {
      this._renderedValue = mustache.render(this.template, this.data);
    }

    return html`
      <div>
        <p>Rendered Message:</p>
        <p class="rendered-text">${this._renderedValue}</p>
        <button @click=${this.onClipboardClick}>Copy to clipboard</button>
        <span ${ref(this.refCopyElement)} class="success-copied">Copied!</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "message-renderer": MessageRenderer;
  }
}
