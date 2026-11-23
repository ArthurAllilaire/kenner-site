/* home-found.js: the home page's section "Adoption first. The data follows." (index.html, #foundation). Loaded with defer.
   Styles: pages/home-found.css. The loop is drawn in the markup and its dot is moved by CSS, so the section is complete
   without this script. All the script does: the dot stands still while the loop is off screen (.f6-off), so nothing is
   animated that nobody sees. With reduced motion there is no dot (the stylesheet), and nothing to do here. */
(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  [].forEach.call(document.querySelectorAll('.f6-loop'), function(loop){
    new IntersectionObserver(function(es){
      es.forEach(function(e){ loop.classList.toggle('f6-off', !e.isIntersecting); });
    }, {threshold: .1}).observe(loop);
  });
})();
