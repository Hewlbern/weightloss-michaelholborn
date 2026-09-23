import Nav from "../components/Nav";

export const metadata = {
  title: {
    default: "Mike Holborn · Weight Tracker",
    template: "%s · Weight Tracker",
  },
  description: "Public weight, food, and photo log for Mike Holborn.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <head>
        <style>{`
          :root{--bg:#0b0f14;--card:#161d27;--border:#243041;--text:#e8eef6;--muted:#9aa8ba;--accent:#5b9fd4;--ok:#5dbe8a}
          *{box-sizing:border-box}
          body{margin:0;font-family:system-ui,sans-serif;background:var(--bg);color:var(--text)}
          a{color:inherit;text-decoration:none}
          a.textlink{color:var(--accent)}
          :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
          header{position:sticky;top:0;background:#0b0f14d9;border-bottom:1px solid var(--border);z-index:2}
          .wrap{max-width:920px;margin:0 auto;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
          nav{display:flex;flex-wrap:wrap;gap:4px}
          nav a{padding:6px 12px;border-radius:999px;color:var(--muted);font-size:14px}
          nav a[aria-current="page"]{color:var(--text);background:#ffffff14}
          main{max-width:920px;margin:0 auto;padding:28px 16px 48px}
          .card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;margin:0 0 16px}
          h1{font-size:2rem;margin:4px 0 20px}
          h2{font-size:1.15rem}
          .num{font-size:2rem;font-weight:600}
          .muted{color:var(--muted);font-size:14px}
          .pill{display:inline-block;border-radius:999px;padding:4px 12px;font-size:13px;background:#ffffff0d;border:1px solid var(--border);margin:4px 4px 0 0}
          ul.food{list-style:none;padding:0;margin:0}
          ul.food li{border:1px solid var(--border);background:#121821b3;border-radius:12px;padding:12px 16px;margin:8px 0}
          footer{text-align:center;color:var(--muted);font-size:12px;padding:8px 16px 32px}
          .tabs{display:flex;gap:8px;margin:0 0 16px;flex-wrap:wrap}
          .tabs button{background:transparent;color:var(--muted);border:1px solid var(--border);border-radius:999px;padding:6px 14px;font:inherit;cursor:pointer}
          .tabs button[aria-selected="true"]{color:var(--text);background:#ffffff14}
          .chart{width:100%;height:auto;display:block}
          .legend{display:flex;flex-wrap:wrap;gap:8px 16px;margin:10px 0 0}
          .swatch{display:inline-block;width:18px;height:3px;margin-right:6px;vertical-align:middle;border-radius:99px}
          table.data{width:100%;border-collapse:collapse;font-size:14px}
          table.data th,table.data td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--border);vertical-align:top}
          table.data th{color:var(--muted);font-weight:500}
          .baseline{display:grid;grid-template-columns:1fr 1fr;gap:12px}
          .shots{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
          figure{margin:0}
          figure img{width:100%;display:block;border-radius:12px;background:#0b0f14}
          .baseline img{max-height:460px;object-fit:cover;object-position:center top}
          .shots img{height:190px;object-fit:cover}
          figcaption{color:var(--muted);font-size:13px;margin-top:6px}
          .links{display:flex;flex-wrap:wrap;gap:12px 16px}
          @media(max-width:640px){.baseline{grid-template-columns:1fr}}
        `}</style>
      </head>
      <body>
        <header>
          <div className="wrap">
            <strong>Mike · Weight</strong>
            <Nav />
          </div>
        </header>
        <main>{children}</main>
        <footer>Personal tracker · not medical advice · Australia/Sydney</footer>
      </body>
    </html>
  );
}
