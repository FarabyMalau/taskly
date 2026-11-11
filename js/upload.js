/* Upload file: klik, drag & drop, baca PDF / txt */
const drop = $("drop"), file = $("file");

drop.onclick = () => file.click();
drop.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); file.click() } };
["dragover", "dragenter"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("on") }));
["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("on") }));
drop.addEventListener("drop", e => { if (e.dataTransfer.files[0]) handle(e.dataTransfer.files[0]) });
file.onchange = () => file.files[0] && handle(file.files[0]);

async function handle(f) {
  $("dname").textContent = f.name;
  if (f.size > 10 * 1024 * 1024) { say("File lebih dari 10 MB. Pilih file yang lebih kecil.", 1); return }
  if (f.type.startsWith("image/")) { say("Gambar belum bisa dibaca otomatis. Tempel teks instruksinya di kolom di bawah, lalu klik Analisis tugas.", 1); return }
  try {
    say("Membaca file…");
    if (f.name.toLowerCase().endsWith(".pdf")) {
      const pdf = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
      let out = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const c = await (await pdf.getPage(i)).getTextContent();
        out += c.items.map(x => x.str).join(" ") + "\n";
      }
      if (out.trim().length < 20) throw new Error("empty");
      $("txt").value = out.trim();
    } else {
      $("txt").value = await f.text();
    }
    say("File terbaca. Klik Analisis tugas untuk melanjutkan.");
  } catch (e) {
    say("File tidak terbaca (mungkin PDF hasil scan). Coba file lain atau tempel teksnya di kolom di bawah.", 1);
  }
}
