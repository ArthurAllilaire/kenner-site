/* Agents page: its own script. Loaded by agents.html with defer, after site.js (the nav).
   The hero's office screen (pages/agents.html section 1, pages/agents.css part 2): the display is a render, its screen is HTML.
   On the screen one agent at a time runs: its three sources are checked one after another, then its finding stands with the yes.
   An answer files the card and the next agent runs; until the first touch the next also runs by itself; pressing an agent runs
   that one (in the rail; on a phone the rail is a row of tiles). With reduced motion nothing runs by itself and nothing travels; an answer still brings the next finding.
   Without this script the screen shows its finished state. */
(function(){
  'use strict';
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var live = document.querySelector('[data-agt-live]');
  function say(s){ if (live) live.textContent = s; }

  /* the agents, by their job as in the app, each with what it found. The first finding is the app's own (as on the home hero);
     the others are examples in the same form. The Briefing agent needs no yes: its work is shown as sent */
  var AG = {
    projects: {icon: 'file', name: 'Projects and contracts', when: 'Daily', find: 'Send the $402.60 invoice for job LV-2119, which was never billed'},
    quoting: {icon: 'quote', name: 'Quoting agent', when: 'After the job', find: 'Send the quote for the worn expansion vessel'},
    stock: {icon: 'truck', name: 'Inventory and fleet', when: 'Every evening', find: 'Move 2 capacitors to van 2 for tomorrow\u2019s jobs'},
    briefing: {icon: 'brief', name: 'Briefing agent', when: 'Before every job', done: 'sent', find: 'Briefing for the 8:00 job at Riverside Centre, with the last three visits'},
    parts: {icon: 'part', name: 'Parts agent', when: 'On request', find: 'Order the fan motor for job LV-2140 from the supplier'},
    warranty: {icon: 'shield', name: 'Warranty recovery', when: 'Every morning', find: 'File a warranty claim of $207.10 for the dual sensor fitted to B-02'}
  };
  /* what each agent checks, and the order the findings come in (the Briefing agent runs when its tile is pressed) */
  var SRC = {projects: ['Work order', 'Contract', 'Invoices'], quoting: ['Site call', 'Price book', 'Customer'], stock: ['Van stock', 'Tomorrow\u2019s jobs', 'Warehouse'],
    briefing: ['Work order', 'Past visits', 'Unit'], parts: ['Work order', 'Supplier', 'Van stock'], warranty: ['Work order', 'Warranty terms', 'Invoices']};
  var ORDER = ['projects', 'quoting', 'stock', 'parts', 'warranty'];

  function desk(root, C){
    var P = C.p, $1 = function(s){ return root.querySelector(s); }, $all = function(s){ return [].slice.call(root.querySelectorAll(s)); };
    var obj = $1('[data-dk-obj]'), stage = $1('[data-dk-stage]'), card = $1('[data-dk-card]'), tiles = $all('[data-dk-a]');
    if (!obj || !stage || !card) return;
    var pIcon = $1('[data-dk-icon]'), pName = $1('[data-dk-name]'), pWhen = $1('[data-dk-when]'), pSrc = $1('[data-dk-srcs]'), find = $1('[data-dk-find]'), pText = $1('[data-dk-text]'), pActs = $1('[data-dk-acts]');
    /* the stage's scale: the box's width over the stage's own, as a plain number. The stylesheet works out the same number with
       tan(atan2()); this is for a browser that cannot, and it follows the box when the window changes */
    function fit(){ var w = stage.offsetWidth; if (w) stage.style.setProperty('--dk-s', (obj.getBoundingClientRect().width / w).toFixed(5)); }
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(obj); else window.addEventListener('resize', fit);
    fit(); document.addEventListener(C.event || 'dk-none', fit);

    var RES = {approve: ['check', 'Approved'], change: ['pen', 'Changed'], decline: ['x', 'Declined'], sent: ['check', 'Sent']};
    var BTN = '<button class="' + P + '-btn ' + P + '-btn-ink" type="button" data-dk-act="approve">Approve</button><button class="' + P + '-btn" type="button" data-dk-act="change">Change</button><button class="' + P + '-btn" type="button" data-dk-act="decline">Decline</button>';
    function stateHTML(kind){ var r = RES[kind] || RES.approve; return '<span class="' + P + '-state" data-k="' + kind + '"><svg class="agt-ic" aria-hidden="true"><use href="' + C.icon + r[0] + '"/></svg><span>' + r[1] + '</span></span>'; }
    function chips(key, done){ return C.src[key].map(function(s){ return '<span class="' + P + '-s' + (done ? ' ' + P + '-ok' : '') + '"><svg class="agt-ic" aria-hidden="true"><use href="' + C.icon + 'check"/></svg>' + s + '</span>'; }).join(''); }
    function after(key){ var i = C.order.indexOf(key); return C.order[(i + 1) % C.order.length]; }
    var cur = C.order[0], token = 0, running = false, touched = false, seen = false, hover = false, STEP = 520, HOLD = C.still ? 500 : 870;

    /* the card as it stands for one agent: with its sources checked and its finding (done), or as the run begins */
    function fill(key, done){
      var a = C.ag[key]; cur = key;
      pIcon.setAttribute('href', C.icon + a.icon); pName.textContent = a.name; pWhen.textContent = a.when; pText.textContent = a.find;
      pActs.innerHTML = a.done ? stateHTML(a.done) : BTN; pSrc.innerHTML = chips(key, done); find.classList.toggle(P + '-hid', !done);
      tiles.forEach(function(el){ var on = el.getAttribute('data-dk-a') === key; el.classList.toggle(P + '-on', on); el.setAttribute('aria-pressed', on ? 'true' : 'false'); if (on) el.classList.remove(P + '-tick'); });
    }
    /* one run: the card on top is filed (it leaves upwards) and the next comes up from the pile; its three sources are checked one
       after another (a ring turns, then a tick); then the finding shows with the yes */
    function run(key){
      var my = ++token; running = true;
      if (C.still){ fill(key, true); running = false; C.say(C.ag[key].name + ': ' + C.ag[key].find); return; }
      card.classList.add(P + '-out');
      setTimeout(function(){
        if (my !== token) return;
        fill(key, false); card.classList.remove(P + '-out'); card.classList.add(P + '-pre'); void card.offsetWidth; card.classList.remove(P + '-pre');
        var list = [].slice.call(pSrc.children), t0 = 420;
        list.forEach(function(ch, i){
          setTimeout(function(){ if (my === token) ch.classList.add(P + '-now'); }, t0 + i * STEP);
          setTimeout(function(){ if (my === token){ ch.classList.remove(P + '-now'); ch.classList.add(P + '-ok'); } }, t0 + i * STEP + STEP - 80);
        });
        setTimeout(function(){ if (my !== token) return; void find.offsetWidth; find.classList.remove(P + '-hid'); running = false; C.say(C.ag[key].name + ': ' + C.ag[key].find); }, t0 + list.length * STEP + 80);
      }, 220);
    }
    /* an answer stands where the buttons stood, the agent's tile gets its tick, then the next agent runs */
    card.addEventListener('click', function(e){
      var b = e.target.closest('[data-dk-act]'); if (!b || running) return; touched = true; running = true;
      var kind = b.getAttribute('data-dk-act'), was = cur;
      pActs.innerHTML = stateHTML(kind); C.say(RES[kind][1]);
      tiles.forEach(function(el){ if (el.getAttribute('data-dk-a') === was) el.classList.add(P + '-tick'); });
      setTimeout(function(){ run(after(was)); }, HOLD);
    });
    /* pressing an agent runs that one */
    tiles.forEach(function(el){ el.addEventListener('click', function(){ touched = true; var k = el.getAttribute('data-dk-a'); if (k !== cur || !running) run(k); }); });
    root.addEventListener('pointerenter', function(){ hover = true; }); root.addEventListener('pointerleave', function(){ hover = false; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ es.forEach(function(e){ seen = e.isIntersecting; }); }, {threshold: .25}).observe(root); else seen = true;
    /* until the first touch the next agent also runs by itself every few seconds, while the display is in view and the pointer is off it */
    (function auto(first){
      if (touched || C.still) return;
      if (!first && seen && !hover && !document.hidden && C.active() && !running) run(after(cur));
      setTimeout(auto, first ? 5200 : 6800);
    })(true);
  }

  var el = document.querySelector('[data-agt-desk]');
  if (el) desk(el, {p: 'agt-m', icon: '#agt-i-', ag: AG, src: SRC, order: ORDER, still: still, say: say, active: function(){ return true; }});
})();
