/* intel-panels.js: the two motions of the Intelligence page's five panels (section #panels). Each runs once, when its visual scrolls into view.
   The page's markup is the final state. The inline script before the section sets html.ip-js before the panels are painted, only when motion
   is allowed and the browser can watch the viewport; without that class this script does nothing and the final states show.
   Styles: pages/intel-panels.css part 6. */
(function(){
  'use strict';
  var root=document.documentElement;
  window.ipReady=true;
  if(!root.classList.contains('ip-js'))return;

  /* run fn once, when at least `share` of el is in the window (or el fills most of the window, for a visual taller than it) */
  function once(el,share,fn){
    if(!el)return;
    var io=new IntersectionObserver(function(entries){
      for(var i=0;i<entries.length;i++){
        var e=entries[i],vh=window.innerHeight||1;
        if(e.isIntersecting&&(e.intersectionRatio>=share||e.intersectionRect.height>=vh*.6)){io.disconnect();fn();return;}
      }
    },{threshold:[0,share/2,share,.99]});
    io.observe(el);
  }

  /* panel 2: Kenner's rows arrive one after another (the delays are in the stylesheet) */
  var wo=document.querySelector('.ip-wo');
  once(wo,.4,function(){wo.classList.add('ip-go');});

  /* panel 5: the squares fill one by one, up to the number filled in the markup (7 of 9); the answer changes where a line
     says so (data-at: 1, 4, 7) */
  var sharp=document.querySelector('.ip-sharp');
  once(sharp,.7,function(){
    var sq=sharp.querySelectorAll('.intel-sq>i'),lines=sharp.querySelectorAll('.ip-lines p');
    var last=sharp.querySelectorAll('.intel-sq>.on').length,k=0,STEP=420;
    var i;
    for(i=0;i<sq.length;i++)sq[i].classList.remove('on');
    for(i=0;i<lines.length;i++)lines[i].classList.remove('is');
    sharp.classList.add('ip-run');
    function step(){
      k++;
      sq[k-1].classList.add('on');
      var now=null;
      for(var j=0;j<lines.length;j++)if(+lines[j].getAttribute('data-at')<=k)now=lines[j];
      for(j=0;j<lines.length;j++)lines[j].classList.toggle('is',lines[j]===now);
      if(k<last)setTimeout(step,STEP);
    }
    setTimeout(step,250);
  });
})();
