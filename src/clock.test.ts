import { expect } from "@open-wc/testing";

import { Clock, globalClock, isTickEvent } from "./clock";
import type { TickEvent } from "./clock";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Clock", () => {
  it("will dispatch tick events", async () => {
    let hasBeenCalled: boolean = false;

    const onTick = () => {
      hasBeenCalled = true;
    };

    const clock = new Clock({ interval: 100 });
    clock.addEventListener("tick", onTick);
    await delay(100);

    expect(hasBeenCalled).to.equal(true);
    clock.removeEventListener("tick", onTick);
  });

  it("will contain a timestamp in the tick event", async () => {
    let tickEvent: TickEvent | undefined = undefined;

    const onTick = (e: Event) => {
      if (isTickEvent(e)) tickEvent = e;
    };

    const clock = new Clock({ interval: 100 });
    clock.addEventListener("tick", onTick);
    await delay(100);

    expect(tickEvent).not.to.be.undefined;
    expect(tickEvent)
      .to.have.nested.property("detail.timestamp")
      .that.is.a("number");
    clock.removeEventListener("tick", onTick);
  });

  it("will stop firing tick events when clear is called", async () => {
    let hasBeenCalled: boolean = false;

    const onTick = () => {
      hasBeenCalled = true;
    };

    const clock = new Clock({ interval: 100 });
    clock.addEventListener("tick", onTick);
    clock.clear();
    await delay(100);

    expect(hasBeenCalled).to.equal(false);
    clock.removeEventListener("tick", onTick);
  });

  it("will firing tick events when start is called", async () => {
    let hasBeenCalled: boolean = false;

    const onTick = () => {
      hasBeenCalled = true;
    };

    const clock = new Clock({ interval: 100 });
    clock.addEventListener("tick", onTick);
    clock.clear();
    await delay(100);
    clock.start();
    await delay(100);

    expect(hasBeenCalled).to.equal(true);
    clock.removeEventListener("tick", onTick);
  });
});

describe("globalClock", () => {
  it("will exist", () => {
    expect(globalClock).to.be.instanceof(Clock);
  });
});

describe("isTickEvent", () => {
  it("will return true", () => {
    const event = new CustomEvent("tick", { detail: { timestamp: 1 } });
    expect(isTickEvent(event)).to.equal(true);
  });

  it("will return false", () => {
    expect(isTickEvent(new CustomEvent("tick"))).to.equal(false);
    expect(
      isTickEvent(new CustomEvent("change", { detail: { timestamp: 1 } }))
    ).to.equal(false);
    expect(isTickEvent(new Event("change"))).to.equal(false);
  });
});
