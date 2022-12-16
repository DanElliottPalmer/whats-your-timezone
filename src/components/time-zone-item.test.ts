import { html, fixture, expect } from "@open-wc/testing";

import "./time-zone-item";
import type { TimeZoneItem } from "./time-zone-item";

describe("TimeZoneItem", () => {
  it("will render contents in editable label", async () => {
    const el: TimeZoneItem = await fixture(html`
      <time-zone-item
        label="Example"
        time-zone="Europe/London"
      ></time-zone-item>
    `);

    expect(
      (el.shadowRoot?.querySelector(".timezone-item__label") as HTMLDivElement)
        ?.innerText
    ).to.be.equal("Example");
  });

  it("will default the label to UTC", async () => {
    const el: TimeZoneItem = await fixture(html`
      <time-zone-item time-zone="Europe/London"></time-zone-item>
    `);

    expect(
      (el.shadowRoot?.querySelector(".timezone-item__label") as HTMLDivElement)
        ?.innerText
    ).to.be.equal("UTC");
  });

  //   it("will dispatch a search event", async () => {
  //     let timeZone: string | undefined = undefined;
  //     const el: TimeZoneSearch = await fixture(html`
  //       <time-zone-search></time-zone-search>
  //     `);

  //     el.addEventListener("search", (e) => {
  //       if (isSearchEvent(e)) timeZone = e.detail.timeZone;
  //     });

  //     (
  //       el.shadowRoot?.querySelector('input[type="submit"]') as HTMLInputElement
  //     ).click();
  //     expect(timeZone).not.to.be.empty;
  //   });

  //   it("passes the a11y audit", async () => {
  //     const el: TimeZoneSearch = await fixture(html`
  //       <time-zone-search></time-zone-search>
  //     `);

  //     await expect(el).shadowDom.to.be.accessible();
  //   });
});
