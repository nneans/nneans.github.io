// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { createDesktopCalendar } from "./desktopCalendar";

describe("desktop calendar", () => {
  it("renders the current month and highlights today", () => {
    const calendar = createDesktopCalendar(new Date(2026, 8, 14));

    expect(calendar.querySelector(".desktop-calendar__title")?.textContent).toBe("SEPTEMBER 2026");
    expect(calendar.querySelectorAll(".desktop-calendar__day")).toHaveLength(35);
    expect(calendar.querySelectorAll(".desktop-calendar__day.is-today")).toHaveLength(1);
    expect(calendar.querySelector(".desktop-calendar__day.is-today")?.textContent).toBe("14");
    calendar.querySelector<HTMLButtonElement>("[aria-label='Previous month']")?.click();
    expect(calendar.querySelector(".desktop-calendar__title")?.textContent).toBe("AUGUST 2026");
  });

  it("marks saved memory dates and opens Time Travel from a marked day", () => {
    const calendar = createDesktopCalendar(new Date(2026, 7, 1));
    const memoryDay = calendar.querySelector<HTMLButtonElement>(".desktop-calendar__day.is-memory");
    const openTimeTravel = vi.fn();
    document.addEventListener("os:open-time-travel", openTimeTravel);

    expect(calendar.querySelectorAll(".desktop-calendar__day.is-memory").length).toBeGreaterThan(0);
    expect(calendar.querySelector(".desktop-calendar__recent")).toBeNull();
    expect(calendar.querySelector(".desktop-calendar__footer")?.textContent).toBe("Today: Aug 1, 2026");
    memoryDay?.click();

    expect(openTimeTravel).toHaveBeenCalledOnce();
    expect(openTimeTravel.mock.calls[0][0]).toMatchObject({ detail: { date: expect.stringMatching(/^2026\.08\./) } });
    document.removeEventListener("os:open-time-travel", openTimeTravel);
  });
});
