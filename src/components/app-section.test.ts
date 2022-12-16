import { html, fixture, expect } from "@open-wc/testing";

import "./app-section";
import type { AppSection } from "./app-section";

describe("AppSection", () => {
  it("will render a label if provided", async () => {
    const el: AppSection = await fixture(html`
      <app-section label="Example section label"></app-section>
    `);

    expect(el.label).to.equal("Example section label");
    expect(el.shadowRoot?.querySelector("h2")?.innerText).to.equal(
      "Example section label"
    );
  });

  it("will not render a label if not provided", async () => {
    const el: AppSection = await fixture(html` <app-section></app-section> `);

    expect(el.label).to.equal("");
    expect(el.shadowRoot?.querySelector("h2")).to.equal(null);
  });

  it("will render children in the slot", async () => {
    const el: AppSection = await fixture(
      html` <app-section><p class="child">Children</p></app-section> `
    );

    expect(el.querySelector(".child")).not.to.equal(null);
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html` <app-section></app-section>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
