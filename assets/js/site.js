/* Baked By The Lake Bread Co. — concept demo
   ONE swappable business constant: edit SITE and every page updates.
   All menu / bake-day / hours data below is SAMPLE (illustrative). */
"use strict";

const SITE = {
  name: "Baked By The Lake Bread Co.",
  town: "Wolfeboro, New Hampshire",
  facebook: "https://www.facebook.com/profile.php?id=61586833705696",
  since: "January 2026",
  proof: "https://bluedhaka.com"
};

/* ---- sample data: illustrative only, labeled SAMPLE everywhere it renders ---- */
const BREADS = [
  { id:"country",   name:"Country Sourdough",        cat:"sourdough", catLabel:"Sourdoughs",     price:9,  days:"Wed · Fri", desc:"The everyday loaf — open crumb, crackling crust, gentle tang." },
  { id:"seeded",    name:"Seeded Sourdough",         cat:"sourdough", catLabel:"Sourdoughs",     price:10, days:"Wed",       desc:"Rolled in sunflower, pumpkin, and flax. Toasts like a dream." },
  { id:"rye",       name:"Dark Rye",                 cat:"sourdough", catLabel:"Sourdoughs",     price:9,  days:"Fri",       desc:"Caraway-kissed, molasses-deep. Built for sharp cheese." },
  { id:"baguette",  name:"Rustic Baguette",          cat:"everyday",  catLabel:"Everyday Loaves",price:5,  days:"Wed",       desc:"Thin-crisped, chewy-centered. Gone by dinner, usually." },
  { id:"honey-oat", name:"Honey Oat Sandwich Loaf",  cat:"everyday",  catLabel:"Everyday Loaves",price:8,  days:"Fri",       desc:"Soft-crumbed and lightly sweet — the school-lunch hero." },
  { id:"focaccia",  name:"Rosemary Focaccia",        cat:"everyday",  catLabel:"Everyday Loaves",price:9,  days:"Wed",       desc:"Olive-oil crisp, sea salt, garden rosemary. Half-sheet." },
  { id:"cinnamon",  name:"Cinnamon Morning Buns",    cat:"morning",   catLabel:"Morning Bakes",  price:12, days:"Fri",       desc:"Brioche swirls, brown-butter glaze. Four to a box." },
  { id:"knots",     name:"Morning Knot Rolls",       cat:"morning",   catLabel:"Morning Bakes",  price:8,  days:"Wed",       desc:"Soft, pull-apart, lightly salted. Four to a bag." }
];

const BAKES = [
  { day:3, name:"Wednesday Bake", pickup:"4:00–6:00 PM", loaves:["country","seeded","baguette","focaccia","knots"] },
  { day:5, name:"Friday Bake",    pickup:"4:00–6:00 PM", loaves:["country","rye","honey-oat","cinnamon"] }
];
const CUTOFF_HOUR = 12; /* sample: orders close noon the day before a bake */

const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* next cutoff Date for a bake (day-of-week d, cutoff = day before at CUTOFF_HOUR) */
function nextCutoff(bake, from){
  const d = new Date(from);
  const cutoffDay = (bake.day + 6) % 7;
  let delta = (cutoffDay - d.getDay() + 7) % 7;
  const c = new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta, CUTOFF_HOUR, 0, 0);
  if (c <= d) c.setDate(c.getDate() + 7);
  return c;
}
function nextBake(){
  const now = new Date();
  let best = null;
  for (const b of BAKES){
    const c = nextCutoff(b, now);
    if (!best || c < best.cutoff) best = { bake:b, cutoff:c };
  }
  return best;
}
function fmtCutoff(d){
  return DAY_NAMES[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate() + " at " +
    ((d.getHours()+11)%12+1) + ":00 " + (d.getHours() < 12 ? "AM" : "PM");
}
function fmtCountdown(ms){
  if (ms < 0) ms = 0;
  const h = Math.floor(ms/36e5), m = Math.floor(ms%36e5/6e4), s = Math.floor(ms%6e4/1e3);
  return h + "h " + String(m).padStart(2,"0") + "m " + String(s).padStart(2,"0") + "s";
}

/* ---- bake-week board renderer (signature) ---- */
function renderBoard(root){
  const now = new Date();
  const { bake, cutoff } = nextBake();
  const loafName = id => (BREADS.find(b => b.id === id) || {}).name || id;

  const cd = document.createElement("div");
  cd.className = "countdown";
  cd.innerHTML =
    '<p class="cd-label">Next order cutoff — ' + bake.name + '</p>' +
    '<p class="cd-time" data-cd>—</p>' +
    '<p class="cd-note">Orders close ' + fmtCutoff(cutoff) + ' · pickup ' + bake.pickup + ' <span class="sample-tag">sample</span></p>';
  root.appendChild(cd);

  const ul = document.createElement("ul");
  ul.className = "bake-days";
  for (const b of BAKES){
    const c = nextCutoff(b, now);
    const li = document.createElement("li");
    li.className = "bake-day";
    li.innerHTML =
      '<span class="day-name">' + b.name + '</span>' +
      '<span class="day-meta">Order by ' + DAY_NAMES[c.getDay()] + ' ' +
        ((c.getHours()+11)%12+1) + ':00 ' + (c.getHours() < 12 ? "AM" : "PM") +
        ' · pickup ' + b.pickup + '</span>' +
      '<span class="day-loaves">' + b.loaves.map(id =>
        '<span class="loaf-chip">' + loafName(id) + '</span>').join("") + '</span>';
    ul.appendChild(li);
  }
  root.appendChild(ul);

  const note = document.createElement("p");
  note.className = "board-note";
  note.innerHTML = 'Sample bake rhythm — the real schedule comes from the baker. <a href="order.html">How ordering works</a>';
  root.appendChild(note);

  const tick = () => {
    const el = root.querySelector("[data-cd]");
    if (el) el.textContent = fmtCountdown(cutoff - new Date());
  };
  tick();
  setInterval(tick, 1000);
}

/* ---- shared chrome: brand injection, nav, reveal, year ---- */
document.documentElement.classList.add("js");

document.querySelectorAll("[data-site='name']").forEach(el => { el.textContent = SITE.name; });
document.querySelectorAll("[data-site='year']").forEach(el => { el.textContent = new Date().getFullYear(); });
document.querySelectorAll("[data-site='facebook']").forEach(el => {
  if (el.tagName === "A") el.href = SITE.facebook;
});

/* active nav */
(function(){
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach(a => {
    if (a.getAttribute("href") === here) a.setAttribute("aria-current","page");
  });
})();

/* mobile nav state machine */
(function(){
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  const close = () => {
    nav.classList.remove("open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded","false");
  };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (open) { const first = nav.querySelector("a"); if (first) first.focus(); }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  nav.addEventListener("click", e => { if (e.target.closest("a")) close(); });
})();

/* reveal-on-scroll (visible by default without JS) */
(function(){
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold:.12 });
  els.forEach(e => io.observe(e));
})();

/* bake boards on any page */
document.querySelectorAll("[data-bake-board]").forEach(renderBoard);

/* breads page: category segments */
(function(){
  const segs = document.querySelectorAll("[data-seg]");
  const items = document.querySelectorAll("[data-cat]");
  if (!segs.length) return;
  segs.forEach(btn => btn.addEventListener("click", () => {
    segs.forEach(b => b.setAttribute("aria-pressed","false"));
    btn.setAttribute("aria-pressed","true");
    const cat = btn.getAttribute("data-seg");
    items.forEach(it => { it.hidden = !(cat === "all" || it.getAttribute("data-cat") === cat); });
  }));
})();

/* sample order-form link → honest placeholder notice */
(function(){
  const btn = document.getElementById("order-form-sample");
  const note = document.getElementById("order-form-note");
  if (!btn || !note) return;
  btn.addEventListener("click", () => {
    note.classList.add("show");
    note.querySelector("h3").focus();
  });
})();

/* demo question form: validate, then show simulated notice (never pretends to send) */
(function(){
  const form = document.getElementById("ask-form");
  if (!form) return;
  const setErr = (id, msg) => {
    const f = document.getElementById("field-" + id);
    const input = document.getElementById("ask-" + id);
    const em = f.querySelector(".error-msg");
    const bad = !input.value.trim() || (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
    f.classList.toggle("invalid", bad);
    input.setAttribute("aria-invalid", String(bad));
    if (em && msg) em.textContent = msg;
    return !bad;
  };
  form.addEventListener("submit", e => {
    e.preventDefault();
    const okName = setErr("name","Please tell us your name.");
    const okEmail = setErr("email","That email doesn't look complete — mind checking it?");
    const okMsg = setErr("message","A line or two helps the baker answer well.");
    const consent = document.getElementById("ask-consent");
    if (!(okName && okEmail && okMsg)) {
      const firstBad = form.querySelector(".field.invalid input, .field.invalid textarea");
      if (firstBad) firstBad.focus();
      return;
    }
    if (!consent.checked){
      consent.focus();
      return;
    }
    document.getElementById("ask-success").classList.add("show");
    form.reset();
  });
  ["name","email","message"].forEach(id => {
    const input = document.getElementById("ask-" + id);
    if (input) input.addEventListener("input", () => {
      document.getElementById("field-" + id).classList.remove("invalid");
      input.removeAttribute("aria-invalid");
    });
  });
})();
