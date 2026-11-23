/* home.js: the home page's own script below the hero (index.html). Loaded with defer. Styles: pages/home.css.
   The four pillars: the text block that crosses the middle of the window is the one in view. It gets is-on, which puts it
   at full strength and shows its visual in the card that stays in place; the others step back. On a phone the four are
   stacked and the class changes nothing. Without this script every block stays at full strength (no is-live on the list). */
(function(){
  var list = document.getElementById('home-p');
  if (!list || !('IntersectionObserver' in window)) return;
  var items = [].slice.call(list.querySelectorAll('.home-p-item')), on = 0;
  function show(i){
    if (i < 0 || i === on) return;
    on = i;
    items.forEach(function(it, k){ it.classList.toggle('is-on', k === i); });
  }
  list.classList.add('is-live');
  /* the window's middle line: of the four blocks, which lie one under the other, exactly one crosses it at a time */
  var mid = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) show(items.indexOf(e.target.parentNode)); });
  }, {rootMargin: '-50% 0px -50% 0px'});
  items.forEach(function(it){ mid.observe(it.querySelector('.home-p-text')); });
  /* a link reached with the keyboard may sit away from the middle: its block is the one in view all the same */
  list.addEventListener('focusin', function(e){
    var it = e.target.closest && e.target.closest('.home-p-item');
    if (it) show(items.indexOf(it));
  });
})();

/* the systems pillar's rotating stack: every few seconds each card moves one place up (data-d, its distance from the middle; home.css does the rest).
   It runs only while its panel is the one that shows and is on screen. No motion: it stands still. */
(function(){
  var st = document.getElementById('home-stack');
  if (!st || !('IntersectionObserver' in window) || !window.matchMedia || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var cards = [].slice.call(st.children), item = st.closest('.home-p-item'), stacked = matchMedia('(max-width:860px)'), timer = 0;
  function step(){
    if (document.hidden || !(stacked.matches || item.classList.contains('is-on'))) return;
    cards.forEach(function(c){ var d = +c.getAttribute('data-d') - 1; c.setAttribute('data-d', d < -3 ? 3 : d); });
  }
  new IntersectionObserver(function(es){
    clearInterval(timer);
    if (es[es.length - 1].isIntersecting) timer = setInterval(step, 2600);
  }, {threshold: .4}).observe(st.parentNode);
})();

/* the agents pillar's queue of agent posts: the front post gets its yes (the button shows a tick), leaves, and the next one comes forward; the one
   that left goes to the back. Runs only while its panel shows and is on screen. No motion: it stands still. */
(function(){
  var q = document.getElementById('home-queue');
  if (!q || !('IntersectionObserver' in window) || !window.matchMedia || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var cards = [].slice.call(q.children), item = q.closest('.home-p-item'), stacked = matchMedia('(max-width:860px)'), timer = 0, busy = false;
  function at(d){ return cards.filter(function(c){ return c.getAttribute('data-d') === d; })[0]; }
  function step(){
    if (busy || document.hidden || !(stacked.matches || item.classList.contains('is-on'))) return;
    var front = at('0'), second = at('1'), third = at('2'); if (!front || !second || !third) return;
    busy = true; front.classList.add('is-ok');
    setTimeout(function(){
      front.setAttribute('data-d', 'out'); second.setAttribute('data-d', '0'); third.setAttribute('data-d', '1');
      setTimeout(function(){ front.classList.remove('is-ok'); front.setAttribute('data-d', '2'); busy = false; }, 650);
    }, 900);
  }
  new IntersectionObserver(function(es){
    clearInterval(timer);
    if (es[es.length - 1].isIntersecting) timer = setInterval(step, 4200);
  }, {threshold: .4}).observe(q.parentNode);
})();
