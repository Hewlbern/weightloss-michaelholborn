import fs from "node:fs";
import path from "node:path";
import { formatDay, weekday } from "../../lib/log";

export const metadata = { title: "Photos" };

const CAPTIONS = {
  "starting-gut-front.jpg": "Baseline · front",
  "starting-gut-side.jpg": "Baseline · side",
  "front.jpg": "Baseline · front (smaller copy)",
  "side.jpg": "Baseline · side (smaller copy)",
  "breakfast-1.jpg": "Breakfast",
  "breakfast-2.jpg": "Breakfast",
  "monster-zeroish.jpg": "Monster",
  "musashi-or-label.jpg": "Bar label",
  "raspberry-bullets-label.jpg": "Raspberry bullets label",
  "chicken-chips.jpg": "Chicken and chips",
  "coke-zero.jpg": "Coke Zero",
  "mayo-nigiri.jpg": "Mayo nigiri",
  "monster-peachy.jpg": "Monster Ultra Peachy",
  "raspberry-bullet.jpg": "Raspberry bullet",
  "sashimi-tray.jpg": "Sashimi tray",
  "sushi-pack.jpg": "Sushi pack",
  "tuna-gunkan.jpg": "Tuna gunkan",
  "salmon-sashimi.jpg": "Salmon sashimi",
  "tamago-mentai.jpg": "Tamago mentai",
};

function listPhotos() {
  const root = path.join(process.cwd(), "public", "photos");
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root)
    .filter((name) => /^\d{4}-\d{2}-\d{2}$/.test(name))
    .sort()
    .reverse()
    .map((date) => {
      const files = fs
        .readdirSync(path.join(root, date))
        .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
        .sort();
      return {
        date,
        photos: files.map((file) => ({
          file,
          src: `/photos/${date}/${file}`,
          caption: CAPTIONS[file] || file.replace(/\.[^.]+$/, "").replace(/-/g, " "),
          baseline: file.startsWith("starting-gut"),
        })),
      };
    });
}

export default function PhotosPage() {
  const groups = listPhotos();
  const baseline = groups.flatMap((group) => group.photos.filter((photo) => photo.baseline).map((photo) => ({ ...photo, date: group.date })));

  return (
    <>
      <h1>Progress photos</h1>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Baseline · 10 Sep 2026</h2>
        <p className="muted">Starting point. Goal is about 78 kg from 101.5 kg that morning.</p>
        <div className="baseline">
          {baseline.map((photo) => (
            <figure key={photo.src}>
              <a href={photo.src}>
                <img src={photo.src} alt={`${photo.caption}, ${photo.date}`} />
              </a>
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      {groups.map((group) => {
        const photos = group.photos.filter((photo) => !photo.baseline && photo.file !== "front.jpg" && photo.file !== "side.jpg");
        if (!photos.length) return null;
        return (
          <div className="card" key={group.date}>
            <h2 style={{ marginTop: 0 }}>
              {weekday(group.date)} {formatDay(group.date, true)}
            </h2>
            <div className="shots">
              {photos.map((photo) => (
                <figure key={photo.src}>
                  <a href={photo.src}>
                    <img src={photo.src} alt={`${photo.caption}, ${group.date}`} />
                  </a>
                  <figcaption>{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
