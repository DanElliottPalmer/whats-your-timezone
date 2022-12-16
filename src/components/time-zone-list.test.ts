import { html, fixture, expect } from "@open-wc/testing";

import "./time-zone-list";
import { isDeleteEvent } from "./time-zone-list";
import type { TimeZoneList, TimeZoneListItem } from "./time-zone-list";

describe("TimeZoneList", () => {
  it("will render children", async () => {
    const el: TimeZoneList = await fixture(html`
      <time-zone-list>
        <time-zone-list-item>Item</time-zone-list-item>
      </time-zone-list>
    `);

    expect(el.querySelectorAll("time-zone-list-item")).not.to.be.equal(null);
  });
});

describe("TimeZoneListItem", () => {
  it("will render children", async () => {
    const el: TimeZoneListItem = await fixture(html`
      <ul>
        <time-zone-list-item>
          <p class="child">Child</p>
        </time-zone-list-item>
      </ul>
    `);

    expect(el.querySelectorAll("p")).not.to.be.equal(null);
  });

  it("will dispatch a delete event", async () => {
    let hasFired: boolean = false;
    const el: TimeZoneListItem = await fixture(html`
      <time-zone-list-item>
        <p class="child">Child</p>
      </time-zone-list-item>
    `);

    el.addEventListener("delete", (e) => {
      if (isDeleteEvent(e)) hasFired = true;
    });
    (el.shadowRoot?.querySelector("button") as HTMLButtonElement).click();
    expect(hasFired).to.be.equal(true);
  });

  it("passes the a11y audit", async () => {
    const el: TimeZoneListItem = await fixture(html`
      <ul>
        <time-zone-list-item>
          <p class="child">Child</p>
        </time-zone-list-item>
      </ul>
    `);

    expect(el).shadowDom.to.be.accessible();
  });
});

describe("isDeleteEvent", () => {
  it("will return true", () => {
    const event = new CustomEvent("delete");
    expect(isDeleteEvent(event)).to.equal(true);
  });

  it("will return false", () => {
    expect(isDeleteEvent(new CustomEvent("delete", { detail: {} }))).to.equal(
      false
    );
    expect(isDeleteEvent(new Event("change"))).to.equal(false);
  });
});
