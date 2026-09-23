"use client";

import { useEffect, useState } from "react";
import { days, formatKcal, profile, sydneyDate, targets, versus } from "../../lib/log";

function ketoLabel(keto) {
  return keto || "—";
}

export default function FoodClient() {
  const [today, setToday] = useState("");

  useEffect(() => {
    const tick = () => setToday(sydneyDate());
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  const todayEntry = today ? days.find((day) => day.date === today) : null;
  const todayKcal = todayEntry && typeof todayEntry.kcal === "number" ? todayEntry.kcal : null;
  const showToday = Boolean(today);

  return (
    <>
      <h1>Calories + food</h1>
      <p className="muted">Sydney today: {today || "…"} · day total rolls over at midnight</p>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Targets</h2>
        <p>
          Maintain {targets.maintain} · −0.5 kg/wk {targets.lose05} · −1 kg/wk {targets.lose1} · sheet ~{targets.sheet}
        </p>
        <p className="muted">
          Light TDEE @ {profile.height_cm} cm / {profile.current_weight_kg} kg. Sydney day. Totals come from the food log. Blank days stay empty.
        </p>
      </div>
      {showToday ? (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Today · {today}</h2>
          {todayKcal == null ? (
            <p className="muted">{todayEntry ? "No calorie total for today." : "No entries yet."}</p>
          ) : (
            <>
              <p className="num">
                {formatKcal(todayKcal)} <span className="muted" style={{ fontSize: "1rem" }}>kcal</span>
              </p>
              <p className="muted">
                {todayEntry?.weight_kg != null ? `${todayEntry.weight_kg} kg · ` : ""}
                So far · day still open
              </p>
              <p className="muted">Maintain: {versus(todayKcal, targets.maintain)}</p>
              <p className="muted">−0.5 kg/wk: {versus(todayKcal, targets.lose05)}</p>
              <p className="muted">−1 kg/wk: {versus(todayKcal, targets.lose1)}</p>
              <p className="muted">Sheet ~{targets.sheet}: {versus(todayKcal, targets.sheet)}</p>
            </>
          )}
        </div>
      ) : null}
      {days.map((day) => {
        const isToday = day.date === today;
        return (
          <div key={day.date} className="card" style={isToday ? { outline: "1px solid var(--accent)" } : undefined}>
            <p className="muted">
              {day.date}
              {isToday ? " · today" : ""}
            </p>
            <h2 style={{ margin: "4px 0" }}>{day.weight_kg != null ? `${day.weight_kg} kg` : "—"}</h2>
            {typeof day.kcal === "number" ? <span className="pill">{formatKcal(day.kcal)} kcal</span> : <span className="pill">kcal not totaled</span>}
            <span className="pill">Keto: {ketoLabel(day.keto)}</span>
            {day.notes ? <p className="muted">{day.notes}</p> : null}
            {day.items?.length ? (
              <ul className="food">
                {day.items.map((item, index) => (
                  <li key={`${day.date}-${index}`}>
                    {item.item}
                    {typeof item.kcal === "number" ? ` · ${item.kcal} kcal` : ""}
                    {item.notes ? <span className="muted"> · {item.notes}</span> : null}
                  </li>
                ))}
              </ul>
            ) : typeof day.kcal !== "number" ? (
              <p className="muted">No food logged</p>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
