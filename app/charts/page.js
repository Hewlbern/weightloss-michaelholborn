import ChartsClient from "./ChartsClient";

export const metadata = { title: "Charts" };

export default function ChartsPage() {
  return (
    <>
      <h1>Charts</h1>
      <div className="card">
        <p className="muted">Weight path: pre-hospital 78 → 98 (13 Aug) → 100.05 (12 & 20 Sep). Goal ~78 kg.</p>
      </div>
      <ChartsClient />
    </>
  );
}
