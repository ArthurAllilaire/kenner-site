/* home-hero.js: the home page's hero (index.html, section[data-h6]). Loaded with defer. Styles: pages/home-hero.css.
   Three small parts:
   1. the industry in the headline flicks through the trades we serve;
   2. the ask box types a few example requests into its placeholder;
   3. an agent's post opens to Approve, Change, Decline; on an answer it closes as done and the next one arrives.
   Without this script the hero shows its finished state: field, the placeholder, the open post. With reduced motion the
   headline and the ask box stay that way too; the posts still answer a click, with plain fades. */
(function(){
  'use strict';
  var root = document.querySelector('[data-h6]'); if (!root) return;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* draft switch ?claim=control: the headline only, to look at.
     The category phrase itself is set in Product vision v4; the page's title and description are untouched */
  if (new URLSearchParams(location.search).get('claim') === 'control') {
    var h1 = root.querySelector('.h6-h1'), l1 = h1 && h1.querySelector('.h6-l');
    if (l1) { l1.textContent = 'The AI control center'; h1.setAttribute('aria-label', 'The AI control center for field service'); }
  }

  /* "field" first: the page opens on the plain tagline; then the trades, as on the page before */
  var INDS = ['field','HVAC/R','elevator','fire protection','heat pump','medical device','forklift','data center','food equipment','wind turbine','machinery'];
  /* example requests for the ask box, short enough to fit a phone */
  var ASKS = ['Which jobs have no invoice yet?','What does van 3 need tomorrow?','Draft the Riverside renewal quote','Which warranty claims are open?'];
  /* the posts. The first two stand in the page (in this order: contract renewals, the unbilled invoice, then van stock;
     warranty recovery comes last); the others arrive after an answer and are adapted
     from the examples in Product vision v4 (dollars instead of pounds) */
  var POSTS = [
    {icon:'renew', name:'Contract renewals', text:'Put a renewal quote of $4,260.00 a year on Riverside Centre’s account'},
    {icon:'file', name:'Projects and contracts', text:'Send the $402.60 invoice for job LV-2119, which was never billed'},
    {icon:'truck', name:'Inventory and fleet', text:'Move 2 capacitors to van 2 for tomorrow’s jobs'},
    {icon:'quote', name:'Quoting agent', text:'Send the quote for the worn expansion vessel'},
    {icon:'truck', name:'Inventory and fleet', text:'Move 1 expansion tank from the Central warehouse to van 3'},
    {icon:'shield', name:'Warranty recovery', text:'File a warranty claim of $207.10 for the dual sensor fitted to B-02'}
  ];
  var RESULT = {approve:['check','Approved'], change:['pen','Changed'], decline:['x','Declined']};
  /* what the three parts tell each other, so only one thing moves at a time */
  var state = {quietUntil: 0, rotAt: 0, rotHold: 0};

  function onView(el, fn, th){
    if (!('IntersectionObserver' in window)) { fn(true); return; }
    new IntersectionObserver(function(es){ es.forEach(function(e){ fn(e.isIntersecting); }); }, {threshold: th}).observe(el);
  }

  /* ---- 1. the headline ----
     The page loads with field as plain text; nothing moves until the first hold is over. It waits while the headline is off
     screen or the tab is hidden. On a wide screen the word sits inside the second line: its slot takes the new word's width
     and "for" and "service" follow; on a phone the word has a row of its own and nothing beside it moves. */
  function rotator(){
    var rot = root.querySelector('[data-h6-rot]'); if (!rot || still) return;
    var HOLD = 3300, i = 0, seen = true;
    function word(n, cls){
      var w = document.createElement('span'); w.className = 'h6-rot-w' + (cls ? ' ' + cls : '');
      INDS[n].split('').forEach(function(ch, k){ var c = document.createElement('span'); c.className = 'h6-rot-c'; c.style.setProperty('--i', k); c.textContent = ch; w.appendChild(c); });
      return w;
    }
    function ownRow(){ return getComputedStyle(rot).display === 'block'; }
    /* letters in their own boxes lose the font's kerning; put it back from the plain word. On its own row, a word wider than
       the column is shrunk to fit */
    function fit(w, n){
      var p = document.createElement('span'); p.style.cssText = 'position:absolute;left:0;top:0;visibility:hidden;white-space:pre'; p.textContent = INDS[n];
      w.style.transform = ''; vis.appendChild(p);
      var r = document.createRange(), t = p.firstChild, p0 = p.getBoundingClientRect().left, w0 = w.getBoundingClientRect().left, fs = parseFloat(getComputedStyle(w).fontSize), cs = [].slice.call(w.children);
      cs.forEach(function(c){ c.style.marginLeft = ''; });
      var d = cs.map(function(c, k){ r.setStart(t, k); r.setEnd(t, k + 1); return (r.getBoundingClientRect().left - p0) - (c.getBoundingClientRect().left - w0); });
      cs.forEach(function(c, k){ c.style.marginLeft = ((d[k] - (k ? d[k - 1] : 0)) / fs) + 'em'; });
      var k = rot.clientWidth / p.getBoundingClientRect().width; p.remove();
      if (ownRow() && k < 1) w.style.transform = 'scale(' + k + ')';
    }
    var vis = document.createElement('span'); vis.setAttribute('aria-hidden', 'true');
    var cur = word(0); vis.appendChild(cur);
    rot.textContent = ''; rot.appendChild(vis); fit(cur, 0);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ fit(cur, i); });
    state.rotAt = Date.now(); state.rotHold = HOLD;
    function step(){
      if (!seen || document.hidden) { setTimeout(step, 500); return; }
      var inline = !ownRow(), w0 = inline ? rot.getBoundingClientRect().width : 0;
      var old = cur; i = (i + 1) % INDS.length; state.rotAt = Date.now();
      cur = word(i, 'h6-in'); old.classList.remove('h6-in'); old.classList.add('h6-out');
      vis.appendChild(cur); fit(cur, i);
      if (inline) {
        /* the slot goes from the old word's width to the new one's, and the line around it follows. The slot clips
           sideways (home-hero.css), so a longer word on its way out is cut at the slot's edge and never lies over "service" */
        var w1 = cur.getBoundingClientRect().width;
        rot.style.transition = 'none'; rot.style.width = w0 + 'px'; void rot.offsetWidth;
        rot.style.transition = ''; rot.style.width = w1 + 'px';
      } else rot.style.width = '';
      setTimeout(function(){ old.remove(); }, 900);
      setTimeout(step, HOLD);
    }
    onView(rot, function(v){ seen = v; }, .5);
    window.addEventListener('resize', function(){ rot.style.width = ''; fit(cur, i); });
    setTimeout(step, HOLD);
  }

  /* ---- 2. the ask box ----
     Its placeholder rests, then one example request is typed, held, and gives way to the placeholder again. An accent only:
     it runs while the hero is on screen, never under reduced motion, and pauses for a moment when a post is being worked on. */
  function ask(){
    var box = root.querySelector('[data-h6-ask]'); if (!box || still) return;
    var ph = box.querySelector('[data-h6-ph]'), base = ph.textContent, n = 0, seen = false, running = false;
    function rest(){ box.classList.remove('h6-typing', 'h6-held'); ph.textContent = base; setTimeout(next, 3200); }
    function next(){
      if (!seen || document.hidden || Date.now() < state.quietUntil) { setTimeout(next, 700); return; }
      /* one thing at a time: type in the quiet part of the headline's hold, a second after its word has changed */
      var since = Date.now() - state.rotAt;
      if (state.rotAt && since < state.rotHold + 900 && (since < 1100 || since > 1500)) { setTimeout(next, 100); return; }
      var text = ASKS[n % ASKS.length], k = 0; n++;
      box.classList.add('h6-typing'); box.classList.remove('h6-held'); ph.textContent = '';
      (function type(){
        k++; ph.textContent = text.slice(0, k);
        if (k < text.length) setTimeout(type, text.charAt(k - 1) === ' ' ? 70 : 34 + Math.random() * 30);
        else { box.classList.add('h6-held'); setTimeout(rest, 2600); }
      })();
    }
    onView(box, function(v){ seen = v; if (v && !running) { running = true; setTimeout(next, 3000); } }, .6);
  }

  /* ---- 3. the posts ----
     One post is open at a time. A click on Approve, Change or Decline shows the result where the buttons stood; then, in one
     movement, that post folds away, the next one opens and a new post arrives at the end, so the count stays the same. The
     feed keeps its height, so nothing around it moves. After the last post in the list the first ones return. */
  function feed(){
    var el = root.querySelector('[data-h6-feed]'); if (!el) return;
    var tpl = el.querySelector('template[data-h6-tpl]'), live = root.querySelector('[data-h6-live]');
    /* two posts stand in the page; the draft switch ?posts=3 puts the third back before anything is measured */
    var SHOW = new URLSearchParams(location.search).get('posts') === '3' ? 3 : 2, nextI = SHOW % POSTS.length, busy = false;
    var HOLD = still ? 500 : 720, MOVE = still ? 220 : 340;
    function posts(){ return [].slice.call(el.querySelectorAll('[data-h6-post]')).filter(function(p){ return !p.classList.contains('h6-leave'); }); }
    function lock(){ if (!busy) { el.style.minHeight = ''; el.style.minHeight = getComputedStyle(el).height; } }
    function setOpen(p, on){
      p.classList.toggle('h6-open', on);
      p.querySelector('[data-h6-toggle]').setAttribute('aria-expanded', on ? 'true' : 'false');
    }
    function make(d){
      var p = tpl.content.firstElementChild.cloneNode(true);
      p.querySelector('use').setAttribute('href', '#h6-i-' + d.icon);
      p.querySelector('.h6-post-name').textContent = d.name;
      p.querySelector('.h6-post-text').textContent = d.text;
      return p;
    }
    function act(p, kind, viaKeys){
      if (busy || p.classList.contains('h6-done')) return;
      lock(); busy = true; state.quietUntil = Date.now() + 5000;
      var res = RESULT[kind] || RESULT.approve;
      p.classList.add('h6-done'); p.setAttribute('data-h6-result', kind);
      var st = document.createElement('span'); st.className = 'h6-post-state h6-pop';
      st.innerHTML = '<svg class="h6-ic" aria-hidden="true"><use href="#h6-i-' + res[0] + '"/></svg><span></span>'; st.lastChild.textContent = res[1];
      /* the three buttons give way to the result, in their place; the post keeps its height until it leaves */
      var acts = p.querySelector('.h6-post-acts'); acts.textContent = ''; acts.appendChild(st);
      if (live) live.textContent = p.querySelector('.h6-post-name').textContent + ': ' + res[1] + '.';
      setTimeout(function(){
        /* the next post from the list, skipping any that is still on screen */
        var shown = posts().map(function(q){ return q.querySelector('.h6-post-text').textContent; }), d, tries = 0;
        do { d = POSTS[nextI]; nextI = (nextI + 1) % POSTS.length; tries++; } while (shown.indexOf(d.text) > -1 && tries < POSTS.length);
        var np = make(d); np.classList.add('h6-enter', 'h6-moving'); p.classList.add('h6-moving');
        el.insertBefore(np, tpl);
        void np.offsetWidth;
        p.classList.add('h6-leave'); np.classList.remove('h6-enter');
        var first = posts()[0];
        if (first) setOpen(first, true);
        if (viaKeys && first) { var go = first.querySelector('[data-h6-act="approve"]'); if (go) go.focus({preventScroll: true}); }
        setTimeout(function(){ p.remove(); np.classList.remove('h6-moving'); busy = false; lock(); }, MOVE + 40);
      }, HOLD);
    }
    el.addEventListener('click', function(e){
      var b = e.target.closest('[data-h6-act]'), t = e.target.closest('[data-h6-toggle]'), p = e.target.closest('[data-h6-post]');
      if (!p || !el.contains(p)) return;
      if (b) { act(p, b.getAttribute('data-h6-act'), e.detail === 0); return; }
      if (t && !busy && !p.classList.contains('h6-done')) {
        state.quietUntil = Date.now() + 5000;
        var on = !p.classList.contains('h6-open');
        posts().forEach(function(q){ if (q !== p) setOpen(q, false); });
        setOpen(p, on);
      }
    });
    for (var have = el.querySelectorAll('[data-h6-post]').length; have < SHOW; have++) el.insertBefore(make(POSTS[have]), tpl);
    lock();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(lock);
    var rz = 0; window.addEventListener('resize', function(){ clearTimeout(rz); rz = setTimeout(lock, 150); });
  }

  rotator(); ask(); feed();
})();
