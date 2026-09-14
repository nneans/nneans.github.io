import { timeTravelEntries } from "../apps/timeTravel/entries";

interface DateParts {
  year: number;
  month: number;
  day: number;
}

interface MemoryMark extends DateParts {
  key: string;
  dateLabel: string;
  title: string;
  location: string;
}

const weekdayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const todayFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

function dateKey({ year, month, day }: DateParts): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseDate(value: string): DateParts | undefined {
  const match = /^(\d{4})\.(\d{2})\.(\d{2})$/.exec(value);
  if (!match) return undefined;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const parsed = new Date(year, month, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month || parsed.getDate() !== day) return undefined;
  return { year, month, day };
}

function memoryMarks(): MemoryMark[] {
  const marks = new Map<string, MemoryMark>();
  timeTravelEntries.forEach((entry) => {
    entry.photos.forEach((photo) => {
      const parts = parseDate(photo.date);
      if (!parts) return;
      const key = dateKey(parts);
      const existing = marks.get(key);
      if (existing) return;
      marks.set(key, {
        ...parts,
        key,
        dateLabel: photo.date,
        title: photo.title,
        location: entry.location,
      });
    });
  });
  return [...marks.values()].sort((a, b) => b.key.localeCompare(a.key));
}

function openTimeTravel(): void {
  document.dispatchEvent(new CustomEvent("os:open-app", { detail: "timeTravel" }));
}

function createDayCell(
  date: Date,
  currentYear: number,
  currentMonth: number,
  todayKey: string,
  marks: Map<string, MemoryMark>,
): HTMLElement {
  const parts = { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
  const key = dateKey(parts);
  const mark = marks.get(key);
  const isCurrentMonth = parts.year === currentYear && parts.month === currentMonth;
  const cell = mark && isCurrentMonth ? document.createElement("button") : document.createElement("span");
  cell.className = "desktop-calendar__day";
  cell.textContent = String(parts.day);

  if (!isCurrentMonth) cell.classList.add("is-outside");
  if (date.getDay() === 0) cell.classList.add("is-sunday");
  if (date.getDay() === 6) cell.classList.add("is-saturday");
  if (key === todayKey) cell.classList.add("is-today");
  if (mark && isCurrentMonth) {
    cell.classList.add("is-memory");
    cell.setAttribute("aria-label", `${mark.dateLabel}: ${mark.title}. Open Time Travel.`);
    cell.title = `${mark.title} · ${mark.location}`;
    (cell as HTMLButtonElement).type = "button";
    cell.addEventListener("click", openTimeTravel);
  }
  return cell;
}

export function createDesktopCalendar(now = new Date()): HTMLElement {
  const todayKey = dateKey({ year: now.getFullYear(), month: now.getMonth(), day: now.getDate() });
  const marks = new Map(memoryMarks().map((mark) => [mark.key, mark]));
  const cursor = new Date(now.getFullYear(), now.getMonth(), 1);
  const calendar = document.createElement("aside");
  calendar.className = "desktop-calendar";
  calendar.setAttribute("aria-label", "Current month calendar");

  const header = document.createElement("header");
  header.className = "desktop-calendar__header";
  const previous = document.createElement("button");
  previous.className = "desktop-calendar__month-button";
  previous.type = "button";
  previous.textContent = "◀";
  previous.setAttribute("aria-label", "Previous month");
  const title = document.createElement("strong");
  title.className = "desktop-calendar__title";
  const next = document.createElement("button");
  next.className = "desktop-calendar__month-button";
  next.type = "button";
  next.textContent = "▶";
  next.setAttribute("aria-label", "Next month");
  header.append(previous, title, next);

  const weekRow = document.createElement("div");
  weekRow.className = "desktop-calendar__weekdays";
  weekRow.setAttribute("aria-hidden", "true");
  weekdayLabels.forEach((label) => {
    const weekday = document.createElement("span");
    weekday.textContent = label;
    weekRow.append(weekday);
  });

  const grid = document.createElement("div");
  grid.className = "desktop-calendar__grid";
  grid.setAttribute("role", "grid");

  const footer = document.createElement("footer");
  footer.className = "desktop-calendar__footer";
  footer.textContent = `Today: ${todayFormatter.format(now)}`;

  const renderMonth = (): void => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    title.textContent = monthFormatter.format(cursor).toUpperCase();
    grid.replaceChildren();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    for (let index = 0; index < cellCount; index += 1) {
      const dayOffset = index - firstDay + 1;
      grid.append(createDayCell(new Date(year, month, dayOffset), year, month, todayKey, marks));
    }
  };

  previous.addEventListener("click", () => {
    cursor.setMonth(cursor.getMonth() - 1);
    renderMonth();
  });
  next.addEventListener("click", () => {
    cursor.setMonth(cursor.getMonth() + 1);
    renderMonth();
  });

  calendar.append(header, weekRow, grid, footer);
  renderMonth();
  return calendar;
}
