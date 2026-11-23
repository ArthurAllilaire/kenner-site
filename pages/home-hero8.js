/* home-hero8.js: the home hero (index.html, section .h8). Loaded with defer. Styles: pages/home-hero8.css.
   1. every chip runs from its start (data-x, a share of the width; data-y, px from the stage's top) into the nearer end of the ask
      box, shrinking and fading; data-p is where it stands in the loop at the start, and in the still picture;
   2. the plug line counts the systems as their first record arrives;
   3. example questions are typed into the ask box, one after the other.
   Motion is transform and opacity only, and rests while the hero is off screen. With reduced motion nothing runs. */
(function(){
  'use strict';
  var root = document.querySelector('[data-h8]');
  if (!root || getComputedStyle(root).display === 'none') return;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var st = root.querySelector('.h8-stage'), ask = root.querySelector('.h8-ask'), tx = root.querySelector('.h8-ask-tx'), count = root.querySelector('[data-h8-count]');
  var recs = [].slice.call(root.querySelectorAll('.h8-rec')), systems = root.querySelectorAll('.h8-rec[data-sys]').length;
  var PH = tx.getAttribute('data-ph'), DUR = 13000, anims = [], timers = [], lastW = 0, geo = [], held = null, resting = false;
  /* each question names another kind of equipment (2026-11-20): this is where the industries show, in place of the old hero's rotating word */
  var QS = ['Which chiller jobs have no invoice', 'What fixed the door fault on elevator 3 last time', 'Which forklift contracts are up for renewal this quarter', 'Draft a quote for the heat pump’s worn expansion vessel', 'Which fire panels are due for inspection next month', 'Which vans carry a compressor for the rooftop unit'];
  function later(fn, ms){ timers.push(setTimeout(fn, ms)); }
  function stop(){
    anims.forEach(function(a){ try { a.cancel(); } catch (e) {} }); anims = []; timers.forEach(clearTimeout); timers = [];
    geo.forEach(function(g){ if (!g) return; clearTimeout(g.wait); if (g.back) { g.back.onfinish = null; g.back.cancel(); } }); geo = [];
    if (held) { held.el.classList.remove('h8-held'); root.classList.remove('h8-dragging'); held = null; }
  }
  function n1(x){ return x.toFixed(1); }
  /* how long the round has been running: the clock of any chip that is in it */
  function elapsed(){ for (var k = 0; k < geo.length; k++) if (geo[k] && geo[k].anim) return geo[k].anim.currentTime || 0; return 0; }
  function say(k){ count.textContent = 'Service work orders' + (k > 0 ? ' and ' + k + ' more' : ''); }
  function typeLoop(){
    var i = 0;
    if (still) { tx.textContent = QS[0]; tx.classList.add('h8-typed'); return; }
    tx.textContent = PH; tx.classList.remove('h8-typed');
    (function next(){
      var Q = QS[i % QS.length], t = 1100; i++;
      Q.split('').forEach(function(_, k){ later(function(){ tx.textContent = Q.slice(0, k + 1); tx.classList.add('h8-typed'); }, t + k * 42); });
      t += Q.length * 42 + 2000;
      later(function(){ tx.textContent = PH; tx.classList.remove('h8-typed'); }, t);
      later(next, t + 500);
    })();
  }
  function run(){
    stop();
    var s = st.getBoundingClientRect(), b = ask.getBoundingClientRect(), W = st.clientWidth, seen = 0;
    var box = {l: b.left - s.left, r: b.right - s.left, cy: b.top - s.top + b.height / 2}, inset = Math.min(86, b.width * .2);
    lastW = W;
    recs.forEach(function(el, i){
      var hx = parseFloat(el.getAttribute('data-x')) * W, hy = parseFloat(el.getAttribute('data-y')), left = hx < W / 2, p0 = parseFloat(el.getAttribute('data-p'));
      var tX = left ? box.l + inset : box.r - inset, tY = box.cy, w = el.offsetWidth, h = el.offsetHeight;
      /* a phone (the stylesheet's 760px): the chips start in two lanes under the ask box and rise into it from below, behind it.
         Nothing crosses the headline, the buttons or "How can I help?"; the stylesheet hides the other three lanes there.
         Each starts whole inside the screen, 12px from its edge: at its own share of the width it stood half outside
         and could not be read */
      if (W <= 760) { hy = b.bottom - s.top + (hy > 200 ? 96 : 42); hx = left ? Math.max(hx, w / 2 + 12) : Math.min(hx, W - w / 2 - 12); }
      function T(p){ return 'translate(' + n1(hx + (tX - hx) * p - w / 2) + 'px,' + n1(hy + (tY - hy) * p - h / 2) + 'px) scale(' + (1 - .5 * p).toFixed(3) + ')'; }
      function O(p){ return p < .07 ? p / .07 : p < .56 ? 1 : Math.max(0, (1 - p) / .44); }
      if (still || !el.animate) { el.style.transform = T(p0); el.style.opacity = O(p0); return; }
      el.style.transform = ''; el.style.opacity = '';
      /* join(): the chip takes its place in the round. Every loop runs on the same clock (elapsed()), so a chip that was away
         comes back into its own slot and keeps its distance to the others in its lane */
      var g = geo[i] = {tX: tX, tY: tY, p0: p0, home: Math.sqrt(Math.pow(tX - hx, 2) + Math.pow(tY - hy, 2)), anim: null, back: null, wait: 0, join: function(){
        var a = el.animate([0, .07, .3, .56, .78, 1].map(function(p){ return {offset: p, transform: T(p), opacity: O(p)}; }), {duration: DUR, delay: -p0 * DUR, iterations: Infinity});
        a.currentTime = elapsed(); if (resting) a.pause();
        anims.push(a); return a;
      }};
      g.anim = g.join();
      if (el.hasAttribute('data-sys')) later(function(){ seen++; say(Math.min(seen, systems) - 1); }, (1 - p0) * DUR);
    });
    say(still ? systems - 1 : 0);
    typeLoop();
  }
  /* ---- 4. a chip can be picked up with the mouse and carried anywhere; where it is let go, it flows into the ask box from there,
     then takes up its round again. Not on touch (a chip must not catch a scroll), and not without motion ---- */
  function place(el, x, y){ el.style.transform = 'translate(' + n1(x - el.offsetWidth / 2) + 'px,' + n1(y - el.offsetHeight / 2) + 'px)'; }
  function grab(e){
    if (still || held || e.pointerType === 'touch' || e.button) return;
    var el = e.currentTarget, g = geo[recs.indexOf(el)]; if (!g) return;
    var s = st.getBoundingClientRect(), r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (g.anim) { var k = anims.indexOf(g.anim); if (k > -1) anims.splice(k, 1); g.anim.cancel(); g.anim = null; }
    if (g.back) { g.back.onfinish = null; g.back.cancel(); g.back = null; }
    clearTimeout(g.wait);
    held = {el: el, g: g, dx: e.clientX - cx, dy: e.clientY - cy, x: cx - s.left, y: cy - s.top};
    place(el, held.x, held.y); el.style.opacity = 1;
    el.classList.add('h8-held'); root.classList.add('h8-dragging');
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  }
  function carry(e){
    if (!held || held.el !== e.currentTarget) return;
    var s = st.getBoundingClientRect();
    held.x = e.clientX - held.dx - s.left; held.y = e.clientY - held.dy - s.top;
    place(held.el, held.x, held.y);
  }
  function letGo(e){
    if (!held || held.el !== e.currentTarget) return;
    var H = held, el = H.el, g = H.g, w = el.offsetWidth, h = el.offsetHeight; held = null;
    el.classList.remove('h8-held'); root.classList.remove('h8-dragging');
    function P(t){ return 'translate(' + n1(H.x + (g.tX - H.x) * t - w / 2) + 'px,' + n1(H.y + (g.tY - H.y) * t - h / 2) + 'px) scale(' + (1 - .5 * t).toFixed(3) + ')'; }
    /* it flows in at the others' pace (the time they take for the same distance), fades over the same last stretch as they do, and
       then stays away until its own slot in the round starts again: no early return, no crowding of its lane */
    var dist = Math.sqrt(Math.pow(g.tX - H.x, 2) + Math.pow(g.tY - H.y, 2)), dur = Math.max(1500, Math.min(DUR, DUR * dist / g.home));
    var fade = Math.max(0, Math.min(.9, 1 - .44 * g.home / Math.max(dist, 1)));
    el.style.transform = P(1); el.style.opacity = 0;
    g.back = el.animate([{offset: 0, transform: P(0), opacity: 1}, {offset: fade, transform: P(fade), opacity: 1}, {offset: 1, transform: P(1), opacity: 0}], {duration: dur});
    g.back.onfinish = function(){
      g.back = null;
      var phase = (g.p0 + elapsed() / DUR) % 1;
      g.wait = setTimeout(function(){ el.style.transform = ''; el.style.opacity = ''; g.anim = g.join(); }, (1 - phase) * DUR);
    };
  }
  if (!still) {
    root.classList.add('h8-live');
    recs.forEach(function(el){
      el.addEventListener('pointerdown', grab);
      el.addEventListener('pointermove', carry);
      el.addEventListener('pointerup', letGo);
      el.addEventListener('pointercancel', letGo);
    });
  }

  run();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  window.addEventListener('load', run);
  var rz; window.addEventListener('resize', function(){ if (st.clientWidth === lastW) return; clearTimeout(rz); rz = setTimeout(run, 150); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function(es){
    var on = es[es.length - 1].isIntersecting; resting = !on;
    anims.forEach(function(a){ try { on ? a.play() : a.pause(); } catch (e) {} });
  }).observe(root);
})();
