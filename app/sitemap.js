export default function sitemap() {
  const base = "https://weightloss.michaelholborn.com";
  return ["", "/food", "/charts", "/photos", "/research"].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
  }));
}
