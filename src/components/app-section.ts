import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("app-section")
export class AppSection extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-block: var(--spacing-xxlarge);
    }

    h2 {
      background-image: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 8px,
        currentcolor 8px,
        currentcolor 10px
      );
      margin-block: 0 var(--spacing-medium);
    }

    span {
      background-color: var(--color-primary);
      padding-inline: 0 var(--spacing-medium);
    }
  `;

  @property({ attribute: "label", type: String })
  label: string = "";

  render() {
    return html`
      <section>
        ${this.label ? html`<h2><span>${this.label}</span></h2>` : nothing}
        <slot></slot>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-section": AppSection;
  }
}
