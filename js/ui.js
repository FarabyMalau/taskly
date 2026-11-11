/* Render hasil, progres, tombol, dan muat data tersimpan */
$("go").onclick = () => {
  const t = $("txt").value.trim();
  if (t.length < 30) { say("Instruksi terlalu pendek. Unggah file atau tempel teks tugas yang lengkap.", 1); return }
  const r = analyze(t);
  state = { text: t, ...r, done: r.steps.map(() => false) };
  store.set(state);
  render();
  say("");
  $("result").scrollIntoView({ behavior: "smooth" });
};

$("sample").onclick = () => {
  $("txt").value = "Buatlah sebuah makalah tentang dampak media sosial terhadap prestasi belajar mahasiswa. Makalah minimal 8 halaman dengan format APA. Jelaskan minimal tiga faktor yang memengaruhi dampak tersebut dan sertakan data pendukung dari jurnal. Susun kesimpulan dan saran di bagian akhir. Presentasikan hasilnya secara singkat di kelas. Tugas dikumpulkan paling lambat hari Jumat pukul 23.59 melalui LMS.";
  say("Contoh dimuat. Klik Analisis tugas.");
};

function render() {
  $("result").style.display = "block";
  $("sum").textContent = state.summary;
  $("dl").textContent = state.deadline ? "Tenggat terdeteksi: " + state.deadline : "";

  $("tasks").innerHTML = "";
  state.tasks.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    $("tasks").appendChild(li);
  });

  $("steps").innerHTML = "";
  state.steps.forEach((s, i) => {
    const li = document.createElement("li"),
          cb = document.createElement("input"),
          lb = document.createElement("label");
    cb.type = "checkbox";
    cb.id = "s" + i;
    cb.checked = !!state.done[i];
    lb.htmlFor = cb.id;
    lb.textContent = s;
    li.className = cb.checked ? "done" : "";
    cb.onchange = () => {
      state.done[i] = cb.checked;
      li.className = cb.checked ? "done" : "";
      store.set(state);
      prog();
    };
    li.append(cb, lb);
    $("steps").appendChild(li);
  });
  prog();
}

function prog() {
  const n = state.done.filter(Boolean).length,
        t = state.done.length,
        p = t ? Math.round(n / t * 100) : 0;
  $("fill").style.width = p + "%";
  $("pct").textContent = n + " dari " + t + " langkah selesai (" + p + "%)" + (p === 100 ? " – semua selesai!" : "");
}

$("reset").onclick = () => {
  state.done = state.steps.map(() => false);
  store.set(state);
  render();
};

/* Muat progres tersimpan */
const saved = store.get();
if (saved && saved.steps && saved.steps.length) {
  state = saved;
  $("txt").value = state.text || "";
  render();
  say("Progres terakhirmu dimuat dari browser ini.");
}
