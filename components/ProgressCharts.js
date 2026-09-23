import { daysAsc, foodKcal, formatDay, formatKcal, targets, weeklyAverages, weighIns } from "../lib/log";

const LINES = [
  { key: "maintain", label: "Maintain", kcal: targets.maintain, color: "#5b9fd4" },
  { key: "lose05", label: "−0.5 kg/wk", kcal: targets.lose05, color: "#5dbe8a" },
  { key: "lose1", label: "−1 kg/wk", kcal: targets.lose1, color: "#e0a35a" },
  { key: "sheet", label: "Sheet daily", kcal: targets.sheet, color: "#d2c097", dash: "5 4" },
];

function barColor(kcal) {
  if (kcal > targets.maintain) return "#d46b6b";
  if (kcal > targets.lose05) return "#5b9fd4";
  if (kcal > targets.lose1) return "#7dcea0";
  return "#3d8f68";
}

function KcalBars({ points, max, label }) {
  const width = 720;
  const height = 280;
  const pad = { l: 48, r: 12, t: 16, b: 36 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const y = (value) => pad.t + innerH - (value / max) * innerH;
  const slot = innerW / Math.max(points.length, 1);
  const barW = Math.min(42, slot * 0.62);
  const grid = [0, 1000, 2000, 3000].filter((value) => value <= max);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img" aria-label={label}>
      {grid.map((value) => (
        <g key={value}>
          <line x1={pad.l} x2={width - pad.r} y1={y(value)} y2={y(value)} stroke="#243041" />
          <text x={pad.l - 8} y={y(value) + 4} textAnchor="end" fill="#9aa8ba" fontSize="11">
            {value === 0 ? "0" : value}
          </text>
        </g>
      ))}
      {LINES.map((line) => (
        <line
          key={line.key}
          x1={pad.l}
          x2={width - pad.r}
          y1={y(line.kcal)}
          y2={y(line.kcal)}
          stroke={line.color}
          strokeWidth="1.5"
          strokeDasharray={line.dash}
        />
      ))}
      {points.map((point, index) => {
        const cx = pad.l + slot * index + slot / 2;
        const value = point.value;
        const barH = value == null ? 0 : (value / max) * innerH;
        return (
          <g key={point.key}>
            {value != null && value > 0 ? (
              <rect x={cx - barW / 2} y={y(value)} width={barW} height={Math.max(barH, 2)} rx="3" fill={barColor(value)}>
                <title>{point.title}</title>
              </rect>
            ) : null}
            <text x={cx} y={height - 12} textAnchor="middle" fill="#9aa8ba" fontSize="11">
              {point.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function WeightTrend() {
  const points = weighIns();
  const width = 720;
  const height = 220;
  const pad = { l: 52, r: 16, t: 22, b: 32 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const min = 99.7;
  const max = 101.9;
  const y = (kg) => pad.t + ((max - kg) / (max - min)) * innerH;
  const t0 = Date.parse(`${points[0].date}T00:00:00Z`);
  const t1 = Date.parse(`${points[points.length - 1].date}T00:00:00Z`);
  const x = (iso) => {
    if (t1 === t0) return pad.l + innerW / 2;
    return pad.l + ((Date.parse(`${iso}T00:00:00Z`) - t0) / (t1 - t0)) * innerW;
  };
  const coords = points.map((point) => ({ ...point, x: x(point.date), y: y(point.kg) }));
  coords.forEach((point, index) => {
    const previous = coords[index - 1];
    point.labelLift = previous && point.x - previous.x < 78 ? 24 : 12;
  });
  const path = coords.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const ticks = [101.5, 100.5, 100];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img" aria-label="Weight from 10 Sep to 20 Sep">
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={pad.l} x2={width - pad.r} y1={y(tick)} y2={y(tick)} stroke="#243041" />
          <text x={pad.l - 8} y={y(tick) + 4} textAnchor="end" fill="#9aa8ba" fontSize="11">
            {tick}
          </text>
        </g>
      ))}
      <path d={path} fill="none" stroke="#5b9fd4" strokeWidth="2" />
      {coords.map((point) => (
        <g key={point.date}>
          <circle cx={point.x} cy={point.y} r="4.5" fill="#e8eef6" />
          <text x={point.x} y={point.y - point.labelLift} textAnchor="middle" fill="#e8eef6" fontSize="11">
            {point.kg}
          </text>
          <text x={point.x} y={height - 10} textAnchor="middle" fill="#9aa8ba" fontSize="11">
            {Number(point.date.slice(8))}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function TargetLegend() {
  return (
    <div className="legend">
      {LINES.map((line) => (
        <span key={line.key}>
          <i className="swatch" style={{ background: line.color }} />
          {line.label} {line.key === "sheet" ? `~${line.kcal}` : line.kcal}
        </span>
      ))}
    </div>
  );
}

export function WeeklyPanel() {
  const weeks = weeklyAverages();
  const daily = daysAsc.map((day) => ({
    key: day.date,
    label: String(Number(day.date.slice(8))),
    value: foodKcal(day),
    title: foodKcal(day) == null ? `${formatDay(day.date)} · no intake total` : `${formatDay(day.date)} · ${foodKcal(day)} kcal`,
  }));
  const weekPoints = weeks.map((week) => ({
    key: week.start,
    label: week.label.replace(" Sep", ""),
    value: week.avg,
    title: week.avg == null ? `${week.label} · no logged days` : `${week.label} · avg ${formatKcal(week.avg)} kcal`,
  }));

  return (
    <>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Weekly average calories</h2>
        <p className="muted">Monday–Sunday weeks covering 10–23 Sep. Partial weeks use only the days in the log.</p>
        <KcalBars points={weekPoints} max={3200} label="Weekly average calories with maintain and cut lines" />
        <TargetLegend />
        <table className="data">
          <thead>
            <tr>
              <th>Week</th>
              <th>Days logged</th>
              <th>Avg kcal</th>
              <th>vs 1740</th>
              <th>vs 2240</th>
              <th>vs 2740</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week.start}>
                <td>{week.label}</td>
                <td>{week.count}</td>
                <td>{formatKcal(week.avg)}</td>
                <td>{week.avg == null ? "—" : delta(week.avg, targets.lose1)}</td>
                <td>{week.avg == null ? "—" : delta(week.avg, targets.lose05)}</td>
                <td>{week.avg == null ? "—" : delta(week.avg, targets.maintain)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted">
          Averages skip blank days, the 10 Sep baseline (items logged, kcal not totaled), and the 20 Sep weigh-in-only row.
          23 Sep is 800 kcal so far, so the 21–23 Sep average is still open.
        </p>
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Daily calories</h2>
        <p className="muted">Same reference lines. Days without an intake total are gaps, not zeros.</p>
        <KcalBars points={daily} max={3800} label="Daily calories from 10 Sep to 23 Sep" />
        <TargetLegend />
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Weight</h2>
        <p className="muted">Weigh-ins only. The axis is zoomed to 99.7–101.9 kg so 101.5 → 100.05 stays readable.</p>
        <WeightTrend />
        <p className="muted">Goal ~78 kg sits about 22 kg below this scale.</p>
      </div>
    </>
  );
}

function delta(avg, target) {
  const diff = Math.round(avg - target);
  if (diff === 0) return "on it";
  return diff > 0 ? `${diff} over` : `${Math.abs(diff)} under`;
}
