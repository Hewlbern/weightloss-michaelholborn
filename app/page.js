import Link from "next/link";
import { formatDay, formatKcal, kgToGoal, latestWeighIn, profile, summaryDay, targets, versus, weeklyAverages, weightNote } from "../lib/log";

export const metadata = {
  title: { absolute: "Mike Holborn · Weight Tracker" },
};

export const dynamic = "force-dynamic";

export default function Page() {
  const latest = latestWeighIn();
  const weight = latest?.kg ?? profile.current_weight_kg;
  const remaining = kgToGoal(weight);
  const { day, isToday } = summaryDay();
  const kcal = day ? day.kcal : null;
  const week = weeklyAverages().at(-1);

  return (
    <>
      <p className="muted">Public weight tracker</p>
      <h1>Mike Holborn</h1>
      <div className="card">
        <p className="muted">Current weight</p>
        <p className="num">
          {weight} <span className="muted" style={{ fontSize: "1rem" }}>kg</span>
        </p>
        <p className="muted">{weightNote()}</p>
      </div>
      <div className="card">
        <p className="muted">Goal ~{profile.goal_weight_kg} kg · {remaining} kg to go</p>
        {day && typeof kcal === "number" ? (
          <>
            <p className="num" style={{ marginBottom: 4 }}>
              {formatKcal(kcal)} <span className="muted" style={{ fontSize: "1rem" }}>kcal</span>
            </p>
            <p className="muted">
              {isToday ? `${formatDay(day.date)} so far` : `Latest log · ${formatDay(day.date, true)}`}
              {isToday ? " · day still open" : ""}
            </p>
            <p>Maintain {targets.maintain} · {versus(kcal, targets.maintain)}</p>
            <p>−0.5 kg/wk {targets.lose05} · {versus(kcal, targets.lose05)}</p>
            <p>−1 kg/wk {targets.lose1} · {versus(kcal, targets.lose1)}</p>
            <p>Sheet daily ~{targets.sheet} · {versus(kcal, targets.sheet)}</p>
          </>
        ) : (
          <p className="muted">No calorie total logged for today yet.</p>
        )}
        {week?.avg != null ? (
          <p className="muted">
            This week ({week.label}) average {formatKcal(week.avg)} kcal across {week.count} logged day{week.count === 1 ? "" : "s"}.
          </p>
        ) : null}
        <p className="links">
          <Link className="textlink" href="/food">Food log</Link>
          <Link className="textlink" href="/charts">Weekly chart</Link>
          <Link className="textlink" href="/photos">Photos</Link>
        </p>
      </div>
    </>
  );
}
