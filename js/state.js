/* State global, helper DOM, dan penyimpanan localStorage */
const $ = id => document.getElementById(id);
const KEY = "taskly:v1";

let state = { text: "", summary: "", deadline: "", tasks: [], steps: [], done: [] };

const store = {
  get() { try { return JSON.parse(localStorage.getItem(KEY) || "null") } catch (e) { return null } },
  set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch (e) {} }
};

/* Tampilkan pesan status di bawah form */
function say(t, bad) {
  $("msg").textContent = t;
  $("msg").className = "msg" + (bad ? " err" : "");
}
