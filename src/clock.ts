export interface ClockOptions {
  // Interval in milliseconds
  interval?: number;
}

export interface EventTickDetail {
  timestamp: number;
}

export type TickEvent = CustomEvent<EventTickDetail>;

const DEFAULT_INTERVAL = 1000;

export class Clock extends EventTarget {
  protected interval: number = DEFAULT_INTERVAL;
  protected timer: ReturnType<typeof setInterval> | undefined;

  constructor(options: ClockOptions = {}) {
    super();
    this.interval = options.interval ?? DEFAULT_INTERVAL;
    this.start();
  }

  clear() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  start() {
    if (this.timer !== undefined) return;
    this.timer = setInterval(this.tick.bind(this), this.interval);
  }

  protected tick() {
    const event: TickEvent = new CustomEvent("tick", {
      detail: {
        timestamp: Date.now(),
      },
    });
    this.dispatchEvent(event);
  }
}

export const globalClock = new Clock({ interval: 1000 });

export function isTickEvent(event: Event): event is TickEvent {
  return (
    event instanceof CustomEvent &&
    event.type === "tick" &&
    event.detail !== null &&
    "timestamp" in event.detail
  );
}
