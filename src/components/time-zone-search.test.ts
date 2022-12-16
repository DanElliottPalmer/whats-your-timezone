import { html, fixture, expect } from "@open-wc/testing";

import "./time-zone-search";
import { isSearchEvent } from "./time-zone-search";
import type { TimeZoneSearch } from "./time-zone-search";

describe("TimeZoneSearch", () => {
  it("will render a list of time zones", async () => {
    const el: TimeZoneSearch = await fixture(html`
      <time-zone-search></time-zone-search>
    `);

    expect(
      el.shadowRoot?.querySelectorAll("#time-zones option")?.length
    ).to.be.at.least(1);
  });

  it("will dispatch a search event", async () => {
    let timeZone: string | undefined = undefined;
    const el: TimeZoneSearch = await fixture(html`
      <time-zone-search></time-zone-search>
    `);

    el.addEventListener("search", (e) => {
      if (isSearchEvent(e)) timeZone = e.detail.timeZone;
    });

    (
      el.shadowRoot?.querySelector('input[type="submit"]') as HTMLInputElement
    ).click();
    expect(timeZone).not.to.be.empty;
  });

  it("passes the a11y audit", async () => {
    const el: TimeZoneSearch = await fixture(html`
      <time-zone-search></time-zone-search>
    `);

    await expect(el).shadowDom.to.be.accessible();
  });
});

describe("isSearchEvent", () => {
  it("will return true", () => {
    const event = new CustomEvent("search", { detail: { timeZone: "UTC" } });
    expect(isSearchEvent(event)).to.equal(true);
  });

  it("will return false", () => {
    expect(isSearchEvent(new CustomEvent("search"))).to.equal(false);
    expect(
      isSearchEvent(new CustomEvent("change", { detail: { timeZone: 1 } }))
    ).to.equal(false);
    expect(isSearchEvent(new Event("change"))).to.equal(false);
  });
});
