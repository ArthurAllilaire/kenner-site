/* Intelligence page: its own script. Loaded by intelligence.html with defer, after site.js (the nav). */

/* Hero: four machines, one at a time, each with its own file in the window. The markup is the first machine's finished picture,
   so it stands without this script. A row opens in place (pressing it again closes it).
   A switch (a name pressed, "Next machine", the arrow in the ask box, or by itself every 7 s until the first touch):
     0     the machine leaves (200ms: fades, sinks 10px, .97, a little blur); the window's words fade (160ms, opacity only)
     120   the next machine arrives (480ms, the site's strong ease-out, from the place it would leave to)
     190   the window's words are swapped while unseen; the question types (2 letters per 20ms)
     520   the answer comes up          610, 670, 720   the three rows          1050  done
   The window's frame, the row of names and the text beside never move. Every step is a class on an element with a transition,
   and every timer belongs to one run: a press mid-way cancels the timers and everything turns from where it is.
   With reduced motion: the machines crossfade in 150ms (the stylesheet), the words change at once, no auto-advance. */
(function(){
  var vis = document.querySelector('.intel-vis'); if (!vis) return;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches, live = function(){ return true; };
  var st = vis.querySelector('.intel-m'), hero = vis.closest('.p-hero'), inner = hero.querySelector('.p-hero-in'), copy = hero.querySelector('.p-hero-copy');
  var figs = [].slice.call(st.querySelectorAll('.intel-m-fig')), col = st.querySelector('.intel-m-col'), win = st.querySelector('.intel-m-win'), chips = [].slice.call(st.querySelectorAll('[data-go]'));
  var K = function(k){ return st.querySelector('[data-k="' + k + '"]'); }, rows = K('rows'), qe = K('q'), ans = win.querySelector('.intel-m-a');
  /* every word is made-up example data, to be checked by a technician. Per machine: the question, the answer, how often it held;
     the job (number, date, notes, the unit); the call (length, three lines: time, who, what was said, 1 on the cited one);
     the manual (page, section, the cited sentence, the one after it) */
  var M = [
    {q: 'Why does the condensate switch trip?', a: 'Clear the drain line first.', n: [6, 8],
      job: ['WO-2038', '2 Sep', 'Switch tripped twice in August. Trap blocked with algae, float switch working. Line cleared and flushed, trap refitted. No trip in 30 days.', 'Rooftop unit, 15 ton · SN 4T7-20931 · Mission St'],
      call: ['0:48', [['0:27', 'Dana', 'Float switch is fine, it is doing its job.', 0], ['0:31', 'Dana', 'The trap was packed solid, that is what kept tripping it.', 1], ['0:38', 'Kenner', 'Noted. Drain line and trap go on the seasonal list.', 0]]],
      doc: ['p. 12', '5.3 Condensate drain', 'Clean the condensate trap at every seasonal service.', 'A blocked trap raises the water in the pan until the float switch opens and stops the unit.']},
    {q: 'What fixes a defrost that ends early?', a: 'Check the termination sensor first.', n: [7, 9],
      job: ['WO-2051', '12 Oct', 'Defrost ended after 6 minutes, coil still iced. Sensor read 20 °F high against a probe. Replaced, defrost ran the full 22 minutes. No callback in 30 days.', 'Display case, 3 door · SN B8-114702 · Mission St'],
      call: ['0:42', [['0:14', 'Marcus', 'Fans and heater are fine.', 0], ['0:18', 'Marcus', 'Sensor was reading 20 high. Swapped it, defrost runs full now.', 1], ['0:25', 'Kenner', 'Got it. That is the seventh job where the sensor fixed this fault.', 0]]],
      doc: ['p. 34', '7.2 Defrost termination', 'Defrost ends when the termination sensor reads 50 °F, or after 30 minutes.', 'A sensor that reads high ends defrost early and leaves ice on the coil.']},
    {q: 'Why does it stop mid-harvest?', a: 'Descale the thickness probe first.', n: [5, 6],
      job: ['WO-2054', '14 Oct', 'Harvest stopped halfway, half sheets left on the plate. Thickness probe coated in scale and reading early. Probe descaled and gapped, three full harvests watched. No stop in 30 days.', 'Modular ice machine, 500 lb · SN IM-33871 · Mission St'],
      call: ['0:55', [['0:22', 'Luis', 'Water curtain and pump are fine.', 0], ['0:27', 'Luis', 'Probe was crusted with scale, so it called harvest too early.', 1], ['0:35', 'Kenner', 'Noted. Descaling the probe goes on the quarterly clean.', 0]]],
      doc: ['p. 18', '6.4 Harvest cycle', 'Clean the ice thickness probe at every descale.', 'A scaled probe senses water too early and starts harvest before the sheet is full.']},
    {q: 'Why does it short-cycle?', a: 'Clean the strainer first.', n: [4, 5],
      job: ['WO-2047', '7 Oct', 'Unit started and stopped every few minutes on a flow fault. Strainer half blocked with sludge. Strainer cleaned, flow back to normal, ran 2 hours without a stop. No short cycle in 30 days.', 'Air source heat pump, 5 ton · SN HP-50264 · Mission St'],
      call: ['0:39', [['0:12', 'Priya', 'Charge and fan are fine.', 0], ['0:16', 'Priya', 'Strainer was half blocked, so it kept tripping on low flow.', 1], ['0:24', 'Kenner', 'Noted. That is the fourth job where the strainer fixed it.', 0]]],
      doc: ['p. 27', '9.1 Water circuit', 'Clean the strainer after commissioning and at every service.', 'Low flow opens the flow switch, and the unit restarts when it resets.']}
  ];
  var at = 0, goal = 0, gen = 0, timers = [], busy = false, touched = false, auto = 0, over = false, seen = true;
  /* all four pictures are decoded before a switch needs them */
  var ready = figs.map(function(f){ var im = f.querySelector('img'); return (im.decode ? im.decode() : Promise.resolve()).catch(function(){}); });
  function later(ms, fn){ var g = gen; timers.push(setTimeout(function(){ if (g === gen) fn(); }, ms)); }
  function stop(){ gen++; timers.forEach(clearTimeout); timers = []; }

  /* ---- sizes ---- */
  function release(){ hero.style.minHeight = ''; hero.style.justifyContent = ''; inner.style.marginTop = ''; }
  /* an open row that would pass the hero's foot (wide screens: the window hangs in the stage, which keeps its height): the hero
     gets the missing height at its foot and what is above stays where it is (the hero centres its content, so that place is
     written down before the hero grows) */
  function fit(){
    release();
    var box = rows.querySelector('.intel-m-r.open .intel-m-bx');
    if (!box || window.innerWidth <= 860) return;
    var hr = hero.getBoundingClientRect(), d = box.closest('.intel-m-d').getBoundingClientRect(), more = col.getBoundingClientRect().bottom - d.height + box.getBoundingClientRect().height + 40 - hr.bottom;
    if (more > 0) { var top = inner.getBoundingClientRect().top - hr.top; hero.style.justifyContent = 'flex-start'; inner.style.marginTop = top + 'px'; hero.style.minHeight = (hr.height + more) + 'px'; }
  }
  /* the window keeps one height for all four machines: the question and the answer get the room of the longest (in lines) */
  function rooms(){
    [[qe, 'q', 1.3], [K('a'), 'a', 1.12]].forEach(function(x){
      var el = x[0], keep = el.textContent, max = 1, r = document.createRange();
      el.style.minHeight = '';
      M.forEach(function(m){ el.textContent = m[x[1]]; r.selectNodeContents(el); var tops = {}; [].forEach.call(r.getClientRects(), function(c){ tops[Math.round(c.top)] = 1; }); max = Math.max(max, Object.keys(tops).length); });
      el.textContent = keep; el.style.minHeight = (max * x[2]).toFixed(2) + 'em';
    });
  }
  /* a tall machine stays clear of what is above the stage: the menu bar, or in one column the text */
  function cap(){
    var s = st.getBoundingClientRect(), box = st.querySelector('.intel-m-box').getBoundingClientRect(), top = window.innerWidth <= 860 ? copy.getBoundingClientRect().bottom + 12 : hero.getBoundingClientRect().top + 60 + 24;
    st.style.setProperty('--max', Math.max(120, box.bottom - top).toFixed(0) + 'px');
  }
  function size(){ release(); cap(); rooms(); fit(); }

  /* ---- the window's words ---- */
  function row(icon, title, fact, body){
    return '<div class="intel-m-r"><button class="intel-m-h" type="button" aria-expanded="false"><svg class="intel-i" aria-hidden="true"><use href="#intel-i-' + icon + '"/></svg><b>' + title + '</b><span class="intel-m-f">' + fact + '</span></button>' +
      '<div class="intel-m-d"><div><div class="intel-m-bx">' + body + '</div></div></div></div>';
  }
  function fill(m){
    var sq = '';
    K('a').textContent = m.a; K('sub').textContent = 'Held in ' + m.n[0] + ' of ' + m.n[1] + ' jobs';
    for (var k = 0; k < m.n[1]; k++) sq += '<i' + (k < m.n[0] ? ' class="on"' : '') + '></i>';
    K('sq').innerHTML = sq;
    rows.innerHTML =
      row('orders', 'Work order', '<code>' + m.job[0] + '</code> · ' + m.job[1], '<p>' + m.job[2] + '</p><code>' + m.job[3] + '</code>') +
      row('call', 'Close-out call', '<code>' + m.call[0] + '</code>', '<p class="intel-m-ln">' + m.call[1].map(function(l){ return '<span' + (l[3] ? ' class="hl"' : '') + '><code>' + l[0] + '</code><b>' + l[1] + '</b><i>' + l[2] + '</i></span>'; }).join('') + '</p>') +
      row('book', 'Service manual', m.doc[0], '<p class="intel-m-ln"><span class="one"><b>' + m.doc[1] + '</b></span><span class="one hl">' + m.doc[2] + '</span><span class="one">' + m.doc[3] + '</span></p>');
    release();
  }
  function type(text){
    var c = 0, g = gen;
    qe.textContent = ''; qe.classList.add('typing');
    (function step(){
      if (g !== gen) return;
      c = Math.min(text.length, c + 2); qe.textContent = text.slice(0, c);
      if (c < text.length) setTimeout(step, 20); else qe.classList.remove('typing');
    })();
  }
  function marks(i){ chips.forEach(function(c, k){ c.setAttribute('aria-pressed', k === i ? 'true' : 'false'); }); figs.forEach(function(f, k){ if (k === i) f.removeAttribute('aria-hidden'); else f.setAttribute('aria-hidden', 'true'); }); }
  /* the new words: swapped while unseen at t0, the question types, then the answer, then the three rows */
  function words(i, t0){
    later(t0, function(){ fill(M[i]); ans.classList.remove('in'); win.classList.add('pre'); win.classList.remove('gone'); type(M[i].q); });
    later(t0 + 330, function(){ ans.classList.add('in'); });
    [420, 480, 530].forEach(function(t, k){ later(t0 + t, function(){ rows.children[k].classList.add('in'); }); });
    later(t0 + 860, function(){ win.classList.remove('pre'); ans.classList.remove('in'); [].forEach.call(rows.children, function(r){ r.classList.remove('in'); }); st.classList.remove('moving'); busy = false; wait(); });
  }

  /* ---- the switch ---- */
  function go(i, user){
    if (user) { touched = true; clearTimeout(auto); }
    if (i === goal && (busy || i === at)) return;
    goal = i; stop(); marks(i);
    if (still){ figs.forEach(function(f, k){ f.classList.toggle('on', k === i); }); at = i; fill(M[i]); qe.textContent = M[i].q; return; }
    busy = true; st.classList.add('moving');
    figs.forEach(function(f, k){ if (k !== i) f.classList.remove('on'); });
    win.classList.add('gone'); qe.classList.remove('typing');
    /* an open row closes first (280ms, while its words fade), so the swap never makes the window jump; the rest waits for it */
    var was = rows.querySelector('.intel-m-r.open'), lag = was ? 130 : 0, g = gen;
    if (was) { was.classList.remove('open'); was.firstChild.setAttribute('aria-expanded', 'false'); }
    Promise.race([ready[i], new Promise(function(r){ setTimeout(r, 1200); })]).then(function(){
      if (g !== gen) return;
      later(120 + lag, function(){ at = i; figs[i].classList.add('on'); });
      words(i, 190 + lag);
    });
  }
  /* by itself every 7 s until the first touch; not while the pointer is over the hero, a row is open, or it is out of view */
  function wait(){
    clearTimeout(auto);
    if (still || touched) return;
    auto = setTimeout(function(){ if (live() && !over && seen && !document.hidden && !busy && !rows.querySelector('.open')) go((at + 1) % M.length, false); else wait(); }, 7000);
  }
  chips.forEach(function(c, i){ c.addEventListener('click', function(){ go(i, true); }); });
  function next(){ go((goal + 1) % M.length, true); }
  K('pick').addEventListener('click', next); K('next').addEventListener('click', next);
  rows.addEventListener('click', function(ev){
    var h = ev.target.closest('.intel-m-h'); if (!h || busy) return;
    var r = h.parentNode, on = !r.classList.contains('open');
    [].forEach.call(rows.children, function(x){ x.classList.toggle('open', on && x === r); x.firstChild.setAttribute('aria-expanded', on && x === r ? 'true' : 'false'); });
    touched = true; clearTimeout(auto); fit();
  });
  st.addEventListener('pointerdown', function(){ touched = true; clearTimeout(auto); });
  hero.addEventListener('pointerenter', function(){ over = true; }); hero.addEventListener('pointerleave', function(){ over = false; });
  if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ seen = es[0].isIntersecting; }, {threshold: .3}).observe(st);
  if (still) st.classList.add('still');
  fill(M[0]); marks(0);
  /* once, on load: the machine is there; the question types, the answer and the rows come in */
  function intro(){ stop(); busy = true; st.classList.add('moving'); win.classList.add('gone'); words(0, 150); }
  var rs = 0;
  window.addEventListener('resize', function(){ clearTimeout(rs); rs = setTimeout(size, 120); });
  function start(){ size(); if (still) wait(); else intro(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
})();

/* Reality (moved from index.html unchanged): the job photos. They drift slowly against the scroll and can be picked up and thrown. */
(function(){
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches, wide = window.matchMedia('(min-width:901px)');
  var phs = [].slice.call(document.querySelectorAll('.ph')), z = 5;
  function lim(v){ return Math.max(-2, Math.min(2, v)); }
  /* where a photo sits: where it was dropped, plus the drift (none when its stage is centred on screen) */
  function place(p){
    var d = 0;
    if (wide.matches && !still) { var r = p._stage.getBoundingClientRect(); d = (r.top + r.height / 2 - window.innerHeight / 2) * -p._k; }
    p.style.transform = wide.matches ? 'translate3d(' + p._x.toFixed(1) + 'px,' + (p._y + d).toFixed(1) + 'px,0)' : '';
  }
  phs.forEach(function(p){ p._x = 0; p._y = 0; p._k = +p.dataset.k || 0; p._stage = p.parentNode; });
  var tick = false;
  function all(){ tick = false; phs.forEach(place); }
  window.addEventListener('scroll', function(){ if (!tick) { tick = true; requestAnimationFrame(all); } }, {passive: true});
  window.addEventListener('resize', all); all();
  /* one pointer at a time; a thrown photo slows down, and one that leaves its stage comes back in */
  phs.forEach(function(p){
    var id = null, sx, sy, ox, oy, lx, ly, lt, vx, vy, moved, raf;
    p.addEventListener('pointerdown', function(e){
      if (id !== null || !wide.matches || e.button || e.pointerType === 'touch') return;
      id = e.pointerId; p.setPointerCapture(id); cancelAnimationFrame(raf); p.classList.remove('settle');
      sx = lx = e.clientX; sy = ly = e.clientY; lt = e.timeStamp; ox = p._x; oy = p._y; vx = vy = 0; moved = false;
    });
    p.addEventListener('pointermove', function(e){
      if (e.pointerId !== id) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved) { if (Math.abs(dx) + Math.abs(dy) < 4) return; moved = true; p.classList.add('drag'); p.style.zIndex = ++z; }
      var dt = Math.max(8, e.timeStamp - lt);
      vx = lim(.6 * vx + .4 * (e.clientX - lx) / dt); vy = lim(.6 * vy + .4 * (e.clientY - ly) / dt); lx = e.clientX; ly = e.clientY; lt = e.timeStamp;
      p._x = ox + dx; p._y = oy + dy; place(p);
    });
    function out(){ var s = p._stage.getBoundingClientRect(), r = p.getBoundingClientRect(); return [Math.max(0, s.left - r.left) - Math.max(0, r.right - s.right), Math.max(0, s.top - r.top) - Math.max(0, r.bottom - s.bottom)]; }
    function back(){ var o = out(); if (o[0] || o[1]) { p._x += o[0]; p._y += o[1]; p.classList.add('settle'); place(p); setTimeout(function(){ p.classList.remove('settle'); }, 600); } }
    function end(e){
      if (e.pointerId !== id) return; id = null; p.classList.remove('drag');
      if (!moved) return;
      if (still || e.timeStamp - lt > 80) { back(); return; }
      var last = performance.now();
      raf = requestAnimationFrame(function glide(now){
        var dt = Math.min(32, now - last), f = Math.pow(.88, dt / 16), o; last = now;
        p._x += vx * dt; p._y += vy * dt; vx *= f; vy *= f; place(p); o = out();
        if (Math.abs(vx) + Math.abs(vy) > .03 && Math.abs(o[0]) < 60 && Math.abs(o[1]) < 60) raf = requestAnimationFrame(glide); else back();
      });
    }
    p.addEventListener('pointerup', end); p.addEventListener('pointercancel', end);
  });
})();

/* Browse: three tabs over one panel. A click or a tap shows that tab's screen with a short crossfade (the styles do it);
   the arrow keys, Home and End move between the tabs and show the screen at once. */
(function(){
  var list = document.querySelector('.intel-tabs'), box = document.querySelector('.intel-browse');
  if (!list || !box) return;
  var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
  var pans = tabs.map(function(t){ return document.getElementById(t.getAttribute('aria-controls')); });
  function show(i, keyed){
    box.classList.toggle('intel-now', !!keyed);
    tabs.forEach(function(t, k){
      var on = k === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
      pans[k].classList.toggle('on', on);
    });
    if (keyed) tabs[i].focus();
  }
  tabs.forEach(function(t, i){ t.addEventListener('click', function(){ show(i, false); }); });
  list.addEventListener('keydown', function(e){
    var i = tabs.indexOf(document.activeElement), n = tabs.length, to = -1;
    if (i < 0) return;
    if (e.key === 'ArrowRight') to = (i + 1) % n;
    else if (e.key === 'ArrowLeft') to = (i + n - 1) % n;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = n - 1;
    if (to < 0) return;
    e.preventDefault(); show(to, true);
  });
})();
