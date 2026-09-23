import site from "../data/site-data.json";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const profile = site.profile;

export const targets = {
  maintain: profile.maintain_kcal,
  lose05: profile.lose_0_5_kg_wk_kcal,
  lose1: profile.lose_1_kg_wk_kcal,
  sheet: profile.sheet_daily_target_kcal,
};

export const days = [...site.days].sort((a, b) => (a.date < b.date ? 1 : -1));
export const daysAsc = [...days].reverse();

export function sydneyDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatDay(iso, withYear = false) {
  const [, month, day] = iso.split("-").map(Number);
  const label = `${day} ${MONTHS[month - 1]}`;
  return withYear ? `${label} ${iso.slice(0, 4)}` : label;
}

export function weekday(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
}

export function formatRange(start, end) {
  if (start.slice(0, 7) === end.slice(0, 7)) {
    return `${Number(start.slice(8))}–${formatDay(end)}`;
  }
  return `${formatDay(start)}–${formatDay(end)}`;
}

/** Days that have a logged intake. Weigh-in-only zeros and untotaled days stay out of averages. */
export function foodKcal(day) {
  if (typeof day.kcal !== "number") return null;
  if (day.kcal === 0 && (!day.items || day.items.length === 0)) return null;
  return day.kcal;
}

export function weekStart(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekdayIndex = date.getUTCDay();
  const mondayOffset = weekdayIndex === 0 ? -6 : 1 - weekdayIndex;
  date.setUTCDate(date.getUTCDate() + mondayOffset);
  return date.toISOString().slice(0, 10);
}

export function weeklyAverages(list = daysAsc) {
  const groups = new Map();
  for (const day of list) {
    const start = weekStart(day.date);
    if (!groups.has(start)) groups.set(start, []);
    groups.get(start).push(day);
  }
  return [...groups.entries()].map(([start, group]) => {
    const logged = group.filter((day) => foodKcal(day) != null);
    const sum = logged.reduce((total, day) => total + foodKcal(day), 0);
    const avg = logged.length ? sum / logged.length : null;
    const end = group[group.length - 1].date;
    return { start, end, label: formatRange(group[0].date, end), days: group, logged, sum, avg, count: logged.length };
  });
}

export function weighIns(list = daysAsc) {
  return list
    .filter((day) => typeof day.weight_kg === "number")
    .map((day) => ({ date: day.date, kg: day.weight_kg }));
}

export function latestWeighIn() {
  const points = weighIns();
  return points[points.length - 1] ?? null;
}

export function kgToGoal(weightKg = profile.current_weight_kg) {
  return Math.round((weightKg - profile.goal_weight_kg) * 100) / 100;
}

export function weightNote() {
  const points = weighIns();
  const latest = points[points.length - 1];
  const previous = points[points.length - 2];
  if (!latest) return profile.latest_weigh_in;
  if (previous && latest.kg === previous.kg) {
    return `${latest.date} · flat vs ${formatDay(previous.date)}`;
  }
  if (previous) {
    const diff = Math.round((latest.kg - previous.kg) * 100) / 100;
    const signed = diff > 0 ? `+${diff}` : `${diff}`;
    return `${latest.date} · ${signed} kg vs ${formatDay(previous.date)}`;
  }
  return latest.date;
}

export function formatKcal(value) {
  if (value == null || Number.isNaN(value)) return "—";
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function versus(kcal, target) {
  const delta = target - kcal;
  if (delta === 0) return "on target";
  if (delta > 0) return `${formatKcal(delta)} left`;
  return `${formatKcal(Math.abs(delta))} over`;
}

export function summaryDay(now = new Date()) {
  const today = sydneyDate(now);
  const todayEntry = days.find((day) => day.date === today);
  if (todayEntry && foodKcal(todayEntry) != null) {
    return { day: todayEntry, isToday: true };
  }
  const latest = days.find((day) => day.date <= today && foodKcal(day) != null);
  return { day: latest ?? null, isToday: false };
}
