"use client";

import { useState } from "react";
import { WeeklyPanel } from "../../components/ProgressCharts";
import { formatDay, weighIns } from "../../lib/log";

const TABS = [
  { id: "weekly", label: "Weekly" },
  { id: "path", label: "Path" },
];

export default function ChartsClient() {
  const [tab, setTab] = useState("weekly");
  const points = weighIns();

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Chart views">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab === "weekly" ? (
        <div role="tabpanel" id="panel-weekly" aria-labelledby="tab-weekly">
          <WeeklyPanel />
        </div>
      ) : (
        <div role="tabpanel" id="panel-path" aria-labelledby="tab-path">
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Weigh-ins in this log</h2>
            <table className="data">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>kg</th>
                </tr>
              </thead>
              <tbody>
                {points.map((point) => (
                  <tr key={point.date}>
                    <td>{formatDay(point.date, true)}</td>
                    <td>{point.kg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="muted">10 Sep 101.5 → 11 Sep 100.5 → 12 Sep 100.05, flat again on 20 Sep.</p>
          </div>
        </div>
      )}
    </>
  );
}
