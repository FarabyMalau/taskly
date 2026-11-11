/* Ganti tema terang/gelap */
$("theme").onclick = () => {
  const r = document.documentElement,
        d = matchMedia("(prefers-color-scheme:dark)").matches;
  const cur = r.dataset.theme || (d ? "dark" : "light");
  r.dataset.theme = cur === "dark" ? "light" : "dark";
};
