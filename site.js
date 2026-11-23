/* site.js: the nav, on every page (markup: partials/nav.html, styles: site.css part 4). Loaded with defer.
   0. The colour scheme: ?scheme=blue in the address shows the site in its second scheme (site.css part 8); ?scheme=mix a draft
      with a different first light in every panel (scheme-mix.css).
   1. The bar: clear over the page's first section, a light glass bar once the page moves, plain white past that section.
   2. The Platform panel: opens on hover and on click, works from the keyboard, closes on Escape and on a click outside.
   3. Phones: one button opens the same links as a full-screen menu. */
/* 0. the second colour scheme, for looking at a draft: no switch on the pages. ?scheme=blue sets data-scheme on <html>, and
   every link that stays on the site gets the parameter too, so the whole site can be clicked through in that scheme.
   This file is deferred, so it runs when the page is parsed: as a rule before the first paint, but that is not promised. */
(function(){
  /* the draft switches: ?scheme=blue|mix, ?grain=on (first light with its grain; without is the default), ?browse=tilt (Browse turned in space).
     Each sets data-<name> on <html> and stays on every link inside the site */
  var ALLOWED = {scheme:['blue','mix'], grain:['on'], browse:['tilt'], impact:['four'], posts:['3'], found:['pieces','story'], corners:['round'], claim:['control'], chs:['lit','tiles'], pillars:['cards'], hero:['vans'], loop:['on'], vis:['plain','glow','none','dots','tint','blue','ink','cells'], tone:['light','glow','fields','blue','print','rise','rays','day','beam','photo'], rails:['off'], frame:['plain'], photo:['one'], real:['scatter'], band:['sky','photo','blue']}, q = new URLSearchParams(location.search), on = {}, any = false;
  Object.keys(ALLOWED).forEach(function(k){ var v = q.get(k); if (ALLOWED[k].indexOf(v) < 0) return; on[k] = v; any = true; document.documentElement.setAttribute('data-' + k, v); });
  if (!any) return;
  /* ?scheme=mix: a draft with a different first light in every panel; its rules live in their own file, beside this one */
  if (on.scheme === 'mix') {
    var me = document.currentScript || document.querySelector('script[src$="site.js"]'), l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = (me ? me.src : 'site.js').replace(/site\.js(\?.*)?$/, 'scheme-mix.css'); document.head.appendChild(l);
  }
  function keep(a){
    if (a.origin !== location.origin || a.getAttribute('href').charAt(0) === '#') return;
    var u = new URL(a.href), ch = false;
    Object.keys(on).forEach(function(k){ if (u.searchParams.get(k) !== on[k]){ u.searchParams.set(k, on[k]); ch = true; } });
    if (ch) a.href = u.href;
  }
  [].forEach.call(document.querySelectorAll('a[href]'), keep);
  /* a link written into the page later (the cookie note) gets it when it is clicked */
  document.addEventListener('click', function(e){ var a = e.target.closest && e.target.closest('a[href]'); if (a) keep(a); }, true);
})();

/* 0b. ?photo=one, a draft since 2026-11-22 (with ?tone=photo, or on the photo draft's pages): one photograph across a whole
   grid of tiles (.p-grid, the Intelligence panels' .ip-grid, the three columns of a .p-trio), cut by the gaps between them, in place of a picture per tile. The picture is the grid's --p-one
   (site.css); it covers the grid, anchored at --p-one-y (0 top, 100 bottom). Each tile gets the picture's size and its own
   place in it, again whenever the grid changes size. site.css uses these from 900px. */
(function(){
  var root = document.documentElement;
  if (root.getAttribute('data-photo') !== 'one') return;
  [].forEach.call(document.querySelectorAll('.p-grid,.ip-grid,.p-trio'), function(grid){
    var cs = getComputedStyle(grid), src = (cs.getPropertyValue('--p-one').match(/url\(["']?([^"')]+)/) || [])[1];
    if (!src) return;
    var at = parseFloat(cs.getPropertyValue('--p-one-y')); if (isNaN(at)) at = 50;
    var img = new Image();
    function place(){
      if (!img.naturalWidth) return;
      /* the area the tiles cover together (the grid itself may be a full-width section with the tiles in its .wrap) */
      var tiles = [].filter.call(grid.classList.contains('p-trio') ? grid.children : grid.querySelectorAll('.p-tile'), function(t){ return t.offsetWidth > 0; }), g = {left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity};
      tiles.forEach(function(t){ var r = t.getBoundingClientRect(); g.left = Math.min(g.left, r.left); g.top = Math.min(g.top, r.top); g.right = Math.max(g.right, r.right); g.bottom = Math.max(g.bottom, r.bottom); });
      g.width = g.right - g.left; g.height = g.bottom - g.top;
      if (!(g.width > 0 && g.height > 0)) return;
      var k = Math.max(g.width / img.naturalWidth, g.height / img.naturalHeight);
      var w = img.naturalWidth * k, h = img.naturalHeight * k, x0 = (g.width - w) / 2, y0 = (g.height - h) * at / 100;
      tiles.forEach(function(t){
        var r = t.getBoundingClientRect(), st = t.style;
        st.setProperty('--p-bw', w + 'px'); st.setProperty('--p-bh', h + 'px');
        st.setProperty('--p-bx', (x0 - (r.left - g.left)) + 'px'); st.setProperty('--p-by', (y0 - (r.top - g.top)) + 'px');
      });
      grid.classList.add('p-one');
    }
    img.onload = place; img.src = new URL(src, location.href).href;
    if ('ResizeObserver' in window) new ResizeObserver(place).observe(grid); else window.addEventListener('resize', place);
  });
})();

(function(){
  var nav = document.getElementById('nav'); if (!nav) return;
  var root = document.documentElement;
  var wide = window.matchMedia('(min-width:861px)');

  /* 1. the bar. A page with no hero under the bar (class nav-bar, the blog) keeps one look */
  var first = document.querySelector('main > section');
  if (first && !nav.classList.contains('nav-bar')) {
    var navState = function(){ var y = window.scrollY, end = first.offsetTop + first.offsetHeight - 60; nav.classList.toggle('solid', y >= end); nav.classList.toggle('dim', y > 40 && y < end); };
    navState(); window.addEventListener('scroll', navState, {passive: true}); window.addEventListener('resize', navState);
  }

  /* 2. the Platform panel. `how` remembers what opened it: a panel opened by hover closes when the pointer leaves, one
     opened by a click or a key stays until it is dismissed. From the keyboard it opens and closes with no motion */
  var trigger = nav.querySelector('.nav-trigger'), panel = document.getElementById('nav-panel');
  if (!trigger || !panel) return;
  var item = trigger.parentNode, open = false, how = '', timer = 0;
  function links(){ return [].slice.call(panel.querySelectorAll('a')); }
  function setPanel(on, by){
    clearTimeout(timer);
    if (on === open) { if (on && by !== 'hover') how = by; return; }
    open = on; how = on ? by : '';
    nav.classList.toggle('panel-now', by === 'key');
    nav.classList.toggle('panel-open', on);
    trigger.setAttribute('aria-expanded', on ? 'true' : 'false');
  }
  trigger.addEventListener('click', function(e){
    var by = e.detail === 0 ? 'key' : 'click';   /* a click with no pointer behind it came from Enter or Space */
    if (!open) setPanel(true, by);
    else if (how === 'hover') how = 'click';      /* hover opened it a moment ago: the click keeps it, it does not shut it */
    else setPanel(false, by);
  });
  item.addEventListener('pointerenter', function(e){
    if (e.pointerType !== 'mouse' || !wide.matches) return;
    clearTimeout(timer);
    if (!open) timer = setTimeout(function(){ setPanel(true, 'hover'); }, 60);   /* a pointer only crossing the bar opens nothing */
  });
  item.addEventListener('pointerleave', function(e){
    if (e.pointerType !== 'mouse') return;
    clearTimeout(timer);
    if (open && how === 'hover') timer = setTimeout(function(){ setPanel(false, 'hover'); }, 140);
  });
  trigger.addEventListener('keydown', function(e){
    if (e.key !== 'ArrowDown' || !wide.matches) return;
    e.preventDefault(); setPanel(true, 'key'); var l = links(); if (l[0]) l[0].focus();
  });
  panel.addEventListener('keydown', function(e){
    var l = links(), i = l.indexOf(document.activeElement), to = -1;
    if (e.key === 'ArrowDown') to = (i + 1) % l.length;
    else if (e.key === 'ArrowUp') to = (i + l.length - 1) % l.length;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = l.length - 1;
    if (to < 0 || !wide.matches) return;
    e.preventDefault(); l[to].focus();
  });
  panel.addEventListener('click', function(e){ if (e.target.closest('a[href]')) { setPanel(false, 'key'); setMenu(false); } });
  document.addEventListener('pointerdown', function(e){ if (open && !item.contains(e.target)) setPanel(false, 'click'); });
  nav.addEventListener('focusout', function(e){ if (open && e.relatedTarget && !item.contains(e.relatedTarget)) setPanel(false, 'key'); });

  /* 3. the phone menu: the page behind it neither scrolls nor takes the focus */
  var toggle = nav.querySelector('.nav-toggle'), menu = false;
  function setMenu(on){
    if (on === menu) return;
    menu = on;
    nav.classList.toggle('menu-open', on); root.classList.toggle('nav-lock', on);
    if (toggle) { toggle.setAttribute('aria-expanded', on ? 'true' : 'false'); toggle.setAttribute('aria-label', on ? 'Close the menu' : 'Open the menu'); }
    [].forEach.call(document.querySelectorAll('main, footer'), function(el){ el.inert = on; });
  }
  if (toggle) toggle.addEventListener('click', function(){ setMenu(!menu); });
  nav.addEventListener('click', function(e){ if (menu && e.target.closest('a[href]')) setMenu(false); });

  document.addEventListener('keydown', function(e){
    if (e.key !== 'Escape') return;
    if (open) { var inside = item.contains(document.activeElement); setPanel(false, 'key'); if (inside) trigger.focus(); }
    if (menu) { setMenu(false); toggle.focus(); }
  });
  /* crossing between the phone and the desktop layout closes whatever was open */
  var reset = function(){ setPanel(false, 'key'); setMenu(false); };
  if (wide.addEventListener) wide.addEventListener('change', reset); else wide.addListener(reset);
})();
