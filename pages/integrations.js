/* Integrations page: its own script. Loaded by integrations.html with defer, after site.js (the nav).
   The directory (#hub; styles: part 2 of pages/integrations.css) works without it: every card and every line is in the page.
   1. the search field in the hero filters the cards as one types;
   2. the list of categories marks the one being read and jumps to the one clicked. */
(function(){
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(id){ return document.getElementById(id); };
  var input = $('int-q'), hub = $('hub'), nav = $('int-nav'), none = $('int-none');
  var cats = [].slice.call(hub.querySelectorAll('.int-cat')), links = [].slice.call(nav.querySelectorAll('a'));
  /* what a card is found by: its name, its line and its category's name */
  var cards = cats.map(function(cat){
    var name = cat.querySelector('h2').textContent;
    return [].slice.call(cat.querySelectorAll('.int-card')).map(function(el){ return {el: el, text: (el.textContent + ' ' + name).toLowerCase()}; });
  });

  /* 1. the search. Every word typed has to be in the card's text. A category with no card left goes and its name in the list
     pales; with no card left at all, one card stands in their place: the custom connector. Escape empties the field, Enter goes to the cards */
  function filter(){
    var words = input.value.toLowerCase().split(/\s+/).filter(Boolean), total = 0;
    cats.forEach(function(cat, i){
      var n = 0;
      cards[i].forEach(function(c){ var ok = words.every(function(w){ return c.text.indexOf(w) > -1; }); c.el.hidden = !ok; if (ok) n++; });
      cat.hidden = !n; links[i].classList.toggle('is-empty', !n);
      if (n) links[i].removeAttribute('aria-disabled'); else links[i].setAttribute('aria-disabled', 'true');
      total += n;
    });
    none.hidden = total > 0;
    mark();
  }
  input.addEventListener('input', filter);
  input.addEventListener('search', filter); /* the browser's own clear button */
  input.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && input.value) { e.preventDefault(); input.value = ''; filter(); }
    if (e.key === 'Enter') { e.preventDefault(); hub.scrollIntoView({behavior: still ? 'auto' : 'smooth', block: 'start'}); }
  });

  /* 2. the list. The category being read is the last one whose top has passed a line a little under the nav bar (where a category
     stops when the list jumps to it, plus 24px); before any has, the first. It is read from where the categories stand, once per
     frame while the page moves: an IntersectionObserver on that line misses a jump from one place with no category on the line to
     another (Home, End, a jump under reduced motion) and left the wrong name marked.
     Where the list is a row of chips (up to 999px) the row is pushed so that the marked chip is in view */
  var cur = -1, due = 0;
  function mark(){
    due = 0;
    var now = -1, y = (parseFloat(getComputedStyle(cats[0]).scrollMarginTop) || 88) + 24;
    cats.forEach(function(cat, i){ if (cat.hidden) return; if (now < 0 || cat.getBoundingClientRect().top <= y) now = i; });
    if (now === cur) return;
    cur = now;
    links.forEach(function(a, i){ if (i === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    if (cur > -1 && nav.scrollWidth > nav.clientWidth) nav.scrollTo({left: links[cur].offsetLeft - 20, behavior: still ? 'auto' : 'smooth'});
  }
  function soon(){ if (!due) due = requestAnimationFrame(mark); }
  window.addEventListener('scroll', soon, {passive: true}); window.addEventListener('resize', soon);
  mark();
  links.forEach(function(a, i){
    a.addEventListener('click', function(e){
      e.preventDefault();
      if (!cats[i].hidden) cats[i].scrollIntoView({behavior: still ? 'auto' : 'smooth', block: 'start'});
    });
  });
  /* a field the browser filled in again (back and forward) filters at once */
  if (input.value) filter();
})();
