/* "Watch Kenner work" from kenner-site PR #9, extracted for the refrigeration draft by build_agents.py. */
(function(){
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(id){ return document.getElementById(id); };
  /* icons used inside the phone screens (stroke icons at 24, filled where the apps fill them) */
  var S = function(inner, fill){ return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true" fill="'+(fill?'currentColor':'none')+'" stroke="'+(fill?'none':'currentColor')+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+inner+'</svg>'; };
  var ICONS = {
    back: S('<path d="M15 5l-7 7 7 7"/>'),
    video: S('<rect x="2.5" y="6.5" width="13" height="11" rx="3"/><path d="M15.5 10.5l6-3.5v10l-6-3.5"/>'),
    phone: S('<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
    phonefill: S('<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/>', true),
    plus: S('<path d="M12 5v14M5 12h14"/>'),
    camera: S('<rect x="2.5" y="6.5" width="19" height="14" rx="3"/><path d="M8.5 6.5l1.5-2.5h4l1.5 2.5"/><circle cx="12" cy="13.5" r="3.5"/>'),
    mic: S('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>'),
    micoff: S('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M4 4l16 16"/>'),
    speaker: S('<path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>'),
    hang: S('<path d="M12 9c-3.1 0-6 .9-8.3 2.5-.6.4-.8 1.2-.4 1.8l1.2 1.9c.4.6 1.1.8 1.7.5l2.3-1.1c.5-.2.8-.8.7-1.3l-.3-1.6c2-.6 4.2-.6 6.2 0l-.3 1.6c-.1.5.2 1.1.7 1.3l2.3 1.1c.6.3 1.3.1 1.7-.5l1.2-1.9c.4-.6.2-1.4-.4-1.8C18 9.9 15.1 9 12 9z"/>', true),
    more: S('<circle cx="5.5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18.5" cy="12" r="1.7"/>', true),
    sticker: S('<path d="M20 12.5V8a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h4.5z"/><path d="M12.5 20v-3.5a4 4 0 0 1 4-4H20"/>'),
    search: S('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'),
    compose: S('<path d="M11 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V13"/><path d="M17.5 3.5l3 3-8.5 8.5H9v-3z"/>'),
    chev: S('<path d="M9.5 6l6 6-6 6"/>'),
    lock: S('<rect x="5.5" y="10.5" width="13" height="10" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>'),
    play: S('<path d="M6 3.5l14 8.5-14 8.5z"/>', true),
    ticks: '<svg viewBox="0 0 16 11" aria-hidden="true"><path d="M1 6l3 3 6-7.5M6.5 8.5l.8.8 6-7.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    updates: S('<circle cx="12" cy="12" r="8.5" stroke-dasharray="3 2.2"/><circle cx="12" cy="12" r="4"/>'),
    people: S('<circle cx="12" cy="8.5" r="3.2"/><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0"/><circle cx="5" cy="10" r="2.2"/><circle cx="19" cy="10" r="2.2"/>'),
    chatfill: S('<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.6A8.5 8.5 0 1 1 21 11.5z"/>', true),
    bubble: S('<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.6A8.5 8.5 0 1 1 21 11.5z"/>'),
    chatplus: S('<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.6A8.5 8.5 0 1 1 21 11.5z"/><path d="M12.5 8v7M9 11.5h7"/>'),
    gear: S('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>'),
    bell: S('<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
    cal: S('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8.5 3v4M15.5 3v4"/>'),
    alarm: S('<circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2.5 2M4.5 4.5L2.5 6.5M19.5 4.5l2 2"/>'),
    /* the sources view's own icons, as the web app draws its sources */
    's-clip': S('<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01"/>'),
    's-hist': S('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/>'),
    's-cap': S('<path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"/><path d="M22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>'),
    's-page': S('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>'),
    's-trash': S('<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>'),
    's-act': S('<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>'),
    's-keep': S('<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2zM12 7v6M15 10H9"/>'),
    's-eye': S('<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>'),
    's-img': S('<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>'),
    's-msg': S('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>'),
    's-scroll': S('<path d="M15 12h-5M15 8h-5M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>'),
    's-down': S('<path d="m6 9 6 6 6-6"/>'),
    's-book': S('<path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>'),
    's-chev': S('<path d="m9 18 6-6-6-6"/>'),
    's-x': S('<path d="M18 6 6 18M6 6l12 12"/>'),
    's-up': S('<path d="m5 12 7-7 7 7M12 19V5"/>'),
    's-plane': S('<path d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a1 1 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"/>', true),
    's-send': S('<path d="M14.54 21.69a.5.5 0 0 0 .94-.03l6.5-19a.5.5 0 0 0-.64-.63l-19 6.5a.5.5 0 0 0-.02.93l7.93 3.18a2 2 0 0 1 1.11 1.11z"/><path d="m21.85 2.15-10.94 10.94"/>'),
    person: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="15.5" r="7.5" fill="#fff"/><path d="M5 40c1-9.5 7.5-14 15-14s14 4.5 15 14z" fill="#fff"/></svg>'
  };
  function icons(root){
    root.querySelectorAll('[data-i]').forEach(function(el){
      var svg = ICONS[el.dataset.i]; if (!svg) return;
      if (el.tagName === 'I') { el.outerHTML = el.className ? svg.replace('<svg class="i"', '<svg class="i '+el.className+'"') : svg; }
      else el.innerHTML = svg;
    });
  }
  var SB_IOS = '<svg viewBox="0 0 66 12" aria-hidden="true"><g fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="6" width="3" height="6" rx="1"/><rect x="10" y="3.5" width="3" height="8.5" rx="1"/><rect x="15" y="1" width="3" height="11" rx="1"/></g><path d="M24 4.4a8.7 8.7 0 0 1 11.6 0M26.2 6.8a5.4 5.4 0 0 1 7.2 0M28.4 9.2a2.2 2.2 0 0 1 2.8 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><rect x="40" y=".5" width="23" height="11" rx="3.6" fill="currentColor"/><text x="51.5" y="9" text-anchor="middle" font-size="8" font-weight="700" font-family="-apple-system,Helvetica,sans-serif" style="fill:var(--sb-inv,#fff)">100</text><path d="M64.6 4.3v3.4" stroke="currentColor" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var SB_AND = '<svg viewBox="0 0 44 12" aria-hidden="true" fill="currentColor"><path d="M0 4.2a10 10 0 0 1 13 0L6.5 11.5z"/><path d="M17 11.5L27 1.5v10z"/><rect x="33" y="1" width="6" height="11" rx="1.2"/><rect x="34.5" y="0" width="3" height="1.5" rx=".5"/></svg>';
  function sbars(){ document.querySelectorAll('.sbar[data-t]').forEach(function(s){ s.innerHTML = '<span class="num">'+s.dataset.t+'</span>'+(s.classList.contains('and')?SB_AND:SB_IOS); }); }
  function wave(el, n){
    var h = [5,9,6,14,8,5,12,7,16,10,6,13,5,9,15,7,4,11,8,14,6,10,5,12,7,9,4,8,13,6];
    var s = ''; for (var i=0;i<n;i++) s += '<i style="height:'+h[i%h.length]+'px"></i>';
    el.innerHTML = s + '<b class="vk"></b>';
  }
  icons(document.getElementById('showcase'));
  /* ---------- watch Kenner work: a technician's messages to one agent, and what the office sees of the same job ---------- */
  var askScr = $('ask-scr'), trail = $('trail'), lookB = $('look-b'), refc = $('refc'), look = $('look'), wo = $('wo');
  var AV = 'brand/logo-avatar.svg', ST = 'pr/logos/avatar/servicetitan.svg', TEAMS = 'logos/tiles/teams.svg';
  var C = function(k, s){ return '<button type="button" class="cite" data-k="'+k+'">'+s+'</button>'; };
  var SRC = function(m){ return m.src ? '<span class="src">'+m.src.map(function(x){ return C(x[0], x[1]); }).join(' · ')+'</span>' : ''; };
  var H = [5,9,6,14,8,5,12,7,16,10,6,13,5,9,15,7,4,11,8,14,6,10,5,12,7,9,4,8,13,6];
  var waveBars = function(n, knob){ var s = ''; for (var i = 0; i < n; i++) s += '<i style="height:'+H[i%H.length]+'px"></i>'; return '<span class="vw">'+s+(knob ? '<b class="vk"></b>' : '')+'</span>'; };

  /* Bayline Refrigeration's two Harbor Kitchen jobs from the commercial refrigeration demo: fictional contractor, people and
     records; the Scotsman manual and its pages are real. A step: its icon, what it is doing, what it did, what it asked,
     what came back, and the sources it cited. */
  var FLOWS = {
    fix: { start:'09:37', pre:[],
      briefing:{ t:'09:02', done:'Wrote the briefing', steps:[
        ['s-clip','Reading the work order','Read the work order','WO-RF-2046','Two harvest stops this morning. Bin running low before lunch.',['wo']],
        ['s-act','Reading IM-01’s data','Read IM-01’s data','','Both stops hit the harvest time limit.',['data']],
        ['s-hist','Looking up IM-01’s history','Looked up IM-01’s history','','Cleaned on 25 Oct. Water filter changed on 9 Sep.',['r2038','r2011']],
        ['s-cap','Checking company knowledge','Checked company knowledge','','After a clean, check the curtain first.',['kcurtain']] ] },
      turns:[
        { out:{h:'IM-01 stopped on max harvest time. What should I check?'}, t:'09:38', done:'Answered', steps:[
            ['s-act','Reading IM-01’s data','Read IM-01’s data','','Two harvests hit the time limit, at 6:12 and 7:48. Freeze cycles normal.',['data']],
            ['s-cap','Checking company knowledge','Checked company knowledge','','After a clean, swing the curtain first. Morgan cleaned it on 25 Oct.',['kcurtain','r2038']],
            ['s-book','Reading the manual','Read the manual','“maximum harvest time”','Curtain out of position comes first on p. 38. Switch test on p. 46.',['p38','p46']] ],
          a:[ {h:'<b>Check the curtain first.</b> Morgan cleaned IM-01 on 25 Oct, and after a clean Lee has seen curtains catch on the surround and never open.', src:[['r2038','WO-RF-2038'],['kcurtain','Lee in Teams']]},
              {h:'1. Swing it by hand. It should move freely.<br>2. Watch its light on the controller: on when the curtain opens, out as it closes. '+C('p46','p. 46')+'<br>3. Still stopping? Power off and meter the switch: 5 Ω or less closed. '+C('p46','p. 46')} ] },
        { out:{h:'Where’s the switch?'}, t:'09:44', done:'Answered', steps:[
            ['s-eye','Looking at a manual page','Looked at a manual page','p. 46','The photo on p. 46 circles the curtain switch.',['p46','photo']] ],
          a:[ {img:true, h:'Circled. Its light on the controller is on while the curtain is open.', src:[['p46','p. 46']]} ] },
        { out:{h:'Curtain was caught on the surround. Reseated it, 3 cycles clean.'}, t:'10:21', done:'Answered', steps:[
            ['s-act','Reading IM-01’s data','Read IM-01’s data','','Three harvests since 10:04, all inside the limit.',['data']],
            ['s-cap','Checking company knowledge','Checked company knowledge','','Nothing yet for cleaning visits on the Prodigy.',[]],
            ['s-keep','Saving company knowledge','Saved company knowledge','','After cleaning a Prodigy, swing each curtain before restarting.',['knew']] ],
          a:[ {h:'Good fix. Saved for the team: after cleaning a Prodigy, swing each curtain before restarting. Once Lee approves it, it’s in every cleaning briefing.', src:[['knew','Team knowledge']]} ] } ] },
    report: { start:'13:46',
      pre:[ {f:'in', h:'For WC-01’s report: findings, work, parts, refrigerant, tests, handover. Give readings with units, or say what you didn’t test.', t:'13:41'} ],
      turns:[
        { out:{voice:'0:25', h:'WC-01 at Harbor Kitchen. Fixed the leak at the liquid-line service valve stem packing. Pumped down into the receiver, adjusted the packing, pressure-tested and pulled a vacuum. No parts, nothing recovered. Added R-448A and the cooler’s back down to temperature. Floor in front gets wet during pump-down, I’ve dried it.'}, t:'13:48',
          a:[ {h:'Drafted. How much R-448A went in? And your test readings?'} ] },
        { out:{voice:'0:43', h:'Three pounds, six ounces. Nitrogen at 150 psig for 15 minutes, no bubbles at the stem. Vacuum 450 microns. Detector at the stem after restart, nothing. Cooler air 37 after 30 minutes, didn’t probe the food. I’ll check in with Maya by 10 tomorrow. Maya also wants a price for new door gaskets.'}, t:'13:52',
          a:[ {h:'All in. Reply OK to file it.'} ] },
        { out:{h:'OK'}, t:'13:53', a:[ {h:'Filed to WO-RF-2047. Maya has a copy.'} ] } ] }
  };
  var LEE = '<div class="said"><figure><figcaption><b>Jamie Patel</b> asked · 16:12</figcaption><blockquote>Another 0530 stopping on max harvest the day after a clean. Switch again?</blockquote></figure><figure><figcaption><b>Lee Carter</b> answered · 16:20</figcaption><blockquote>Swing the curtain before you meter anything. If it went back out of position it catches on the surround and never opens far enough.</blockquote></figure></div>';
  /* each source a chip can name, and its card: g, the source it reads as (work orders, unit data or Kenner's knowledge), else Kenner's blue */
  var CH = {
    wo:{i:'s-page', g:'fsm', l:'WO-RF-2046', av:ST, t:'Harbor Kitchen · Ice machine stops during harvest', s:'WO-RF-2046 · IM-01 · Scotsman MC0530SA-1A', x:'<span>Stopped twice during harvest this morning. Bin running low before lunch.</span>', f:'ServiceTitan'},
    data:{i:'s-act', g:'tel', l:'IM-01 data', av:AV, t:'IM-01 data', s:'Today · from the unit’s controller', x:'<dl><dt>06:12</dt><dd>Harvest hit the time limit</dd><dt>07:48</dt><dd>Harvest hit the time limit</dd><dt>From 10:04</dt><dd>Three harvests inside the limit</dd></dl>', f:'Unit data'},
    r2038:{i:'s-page', g:'fsm', l:'WO-RF-2038 report', av:ST, t:'WO-RF-2038 report', s:'25 Oct · Morgan Ellis · Planned cleaning', x:'<dl><dt>Found</dt><dd>Dust on the air filter, scale in the water system. No harvest shutdown seen.</dd><dt>Work</dt><dd>Cleaned the air filter and water system, including the water-level sensor.</dd><dt>Tests</dt><dd>Two complete cycles watched.</dd></dl>', f:'ServiceTitan'},
    r2011:{i:'s-page', g:'fsm', l:'WO-RF-2011 report', av:ST, t:'WO-RF-2011 report', s:'9 Sep · Jamie Patel · Water-filter service', x:'<dl><dt>Work</dt><dd>Replaced the cartridge and checked the connections.</dd><dt>Tests</dt><dd>No leaks.</dd></dl>', f:'ServiceTitan'},
    kcurtain:{teams:true, g:'kw', l:'Harvest stop after a clean: check the curtain first', av:AV, t:'Harvest stop after a clean: check the curtain first', s:'Company knowledge · approved by Lee Carter, service supervisor', x:LEE, f:'From Microsoft Teams · 28 Oct'},
    knew:{i:'s-keep', g:'kw', l:'After cleaning: swing each curtain', av:AV, t:'After cleaning a Prodigy, swing each curtain before restarting', s:'Company knowledge · waiting for Lee Carter to approve', x:'<span>From WO-RF-2046: after the 25 Oct clean the curtain caught on the surround. Reseating it cleared the stops; three cycles clean.</span>', f:'Learned on this job'},
    p38:{i:'s-book', g:'kw', l:'Prodigy Elite p. 38', av:AV, t:'Scotsman Prodigy Elite service manual, p. 38', s:'Diagnostics, air cooled', m:'pr/media/scotsman-p38.webp', open:'Scotsman Prodigy Elite service manual, page 38: diagnostics, air cooled', f:'Manual'},
    p46:{i:'s-book', g:'kw', l:'Prodigy Elite p. 46', av:AV, t:'Scotsman Prodigy Elite service manual, p. 46', s:'Test procedures: curtain switch', m:'pr/media/scotsman-p46.webp', open:'Scotsman Prodigy Elite service manual, page 46: curtain switch test procedures', f:'Manual'},
    photo:{i:'s-img', l:'Photo', av:AV, t:'Curtain switch, circled', s:'From the manual, p. 46', m:'pr/media/curtain-switch.webp', open:'Photo from the manual, page 46: the curtain switch, circled', f:'Sent in the chat'}
  };
  var IMG_LABEL = 'Photo from the manual, page 46: the curtain switch, circled';
  /* a send button for what the technician has ready: the visitor sends it */
  var TILE = '<span class="tm-tile"><img src="'+AV+'" alt=""></span>';
  var KVN = function(d){ return '<div class="kvn"><span class="pb">'+ICONS.play+'</span>'+waveBars(30)+'<em>'+d+'</em></div>'; };
  var SEND = function(icon){ return '<button type="button" class="snd cue" aria-label="Send">'+ICONS[icon]+'</button>'; };
  var APPS = {
    wa: { cls:'wa', body:'wa-body',
      head: function(){ return '<div class="wa-head"><span class="bk">'+ICONS.back+'<em class="bkn">5</em></span><img src="'+AV+'" alt=""><span class="n"><b>Kenner</b><span id="ask-st"></span></span><span class="hic">'+ICONS.video+ICONS.phone+'</span></div>'; },
      day: function(){ return '<span class="wa-day">Today</span>'; },
      bubble: function(m, gf, tl){
        var c = 'b '+m.f+(gf?' gf':'')+(tl?' tl':'');
        if (m.typ) return '<div class="'+c+' typ" aria-label="Kenner is typing"><i></i><i></i><i></i></div>';
        var meta = '<span class="meta">'+m.t+(m.f==='out'?ICONS.ticks:'')+'</span>';
        if (m.voice) return '<div class="'+c+'"><span class="vn">'+ICONS.play.replace('class="i"','class="i pl"')+waveBars(26, true)+'</span><span class="vd num">'+m.voice+'</span><span class="tr">'+m.h+'</span>'+meta+'</div>';
        if (m.img) return '<div class="'+c+' pic"><span class="ph sw" role="img" aria-label="'+IMG_LABEL+'"></span><span class="cap">'+m.h+SRC(m)+meta+'</span></div>';
        return '<div class="'+c+'">'+m.h+SRC(m)+meta+'</div>';
      },
      composer: function(d){
        var field = !d ? '<span class="tx"></span>' : d.voice ? '<span class="vdraft">'+waveBars(22)+'<em>'+d.voice+'</em></span>' : '<span class="tx">'+d.shown+'</span>';
        return '<div class="wa-in" id="ask-cmp">'+ICONS.plus+'<span class="fld">'+field+(d && d.voice ? '' : ICONS.sticker)+'</span>'+(d && d.ready ? SEND('s-plane') : d ? '' : ICONS.camera+'<span class="micb">'+ICONS.mic+'</span>')+'</div>';
      } },
    im: { cls:'im', body:'im-body',
      head: function(){ return '<div class="im-head"><span class="gb l">'+ICONS.back+'</span><span class="gb r">'+ICONS.video+'</span><span class="im-who"><img src="'+AV+'" alt=""><span>Kenner'+ICONS['s-chev']+'</span></span></div>'; },
      day: function(t){ return '<div class="im-ts">iMessage<br><b>Today</b> '+t+'</div>'; },
      bubble: function(m, gf, tl){
        var c = 'ib '+m.f+(gf?' gf':'');
        if (m.typ) return '<div class="'+c+' tl typ" aria-label="Kenner is typing"><i></i><i></i><i></i></div>';
        /* iMessage transcribes a voice note under it, and sends a photo and its words as separate bubbles */
        if (m.voice) return '<div class="'+c+(tl?' tl':'')+' voice"><span class="vrow">'+ICONS.play+waveBars(24)+'<em>'+m.voice+'</em></span><span class="trs">'+m.h+'</span></div>';
        if (m.img) return '<div class="'+c+' pic"><span role="img" aria-label="'+IMG_LABEL+'"></span></div><div class="ib '+m.f+(tl?' tl':'')+'">'+m.h+SRC(m)+'</div>';
        return '<div class="'+c+(tl?' tl':'')+'">'+m.h+SRC(m)+'</div>';
      },
      composer: function(d){
        var inner = !d ? '<span class="ph">iMessage</span>'+ICONS.mic : (d.voice ? '<span class="vdraft">'+waveBars(20)+'<em>'+d.voice+'</em></span>' : '<span class="tx">'+d.shown+'</span>')+(d.ready ? SEND('s-up') : '');
        return '<div class="im-in" id="ask-cmp"><span class="pl">'+ICONS.plus+'</span><span class="fld">'+inner+'</span></div>';
      } },
    tm: { cls:'tm', body:'tm-body',
      head: function(){ return '<div class="tm-head">'+ICONS.back+TILE+'<span class="tm-name"><b>Kenner</b><small>Chat'+ICONS['s-down']+'</small></span>'+ICONS.search.replace('class="i"','class="i r"')+ICONS.more.replace('class="i"','class="i r"')+'</div>'; },
      day: function(){ return '<span class="tm-day">Today</span>'; },
      bubble: function(m, gf){
        var meta = !gf ? '' : m.f === 'in' ? '<div class="tm-meta in"><b>Kenner</b>'+(m.t||'')+'</div>' : '<div class="tm-meta out">'+m.t+'</div>', tile = gf && m.f === 'in' ? TILE : '';
        if (m.typ) return meta+'<div class="tb in typ" aria-label="Kenner is typing">'+tile+'<i></i><i></i><i></i></div>';
        if (m.voice) return meta+'<div class="tb '+m.f+' voice"><span class="vrow">'+ICONS.play+waveBars(24)+'<em>'+m.voice+'</em></span><span class="trs">'+m.h+'</span></div>';
        /* Teams shows a photo Kenner sends as a card that opens it in Kenner */
        if (m.img) return meta+'<div class="tb in card">'+tile+'<span class="im2" role="img" aria-label="'+IMG_LABEL+'"></span><b>Curtain switch · Prodigy Elite p. 46</b><span>'+m.h+'</span><span class="tm-btn">Open in Kenner</span></div>';
        return meta+'<div class="tb '+m.f+'">'+tile+m.h+SRC(m)+'</div>';
      },
      composer: function(d){
        var inner = !d ? '<span class="ph">Type a message</span>' : d.voice ? '<span class="vdraft">'+waveBars(20)+'<em>'+d.voice+'</em></span>' : '<span class="tx">'+d.shown+'</span>';
        return '<div class="tm-in" id="ask-cmp">'+ICONS.plus+'<span class="fld">'+inner+'</span>'+(d && d.ready ? SEND('s-send') : d ? '' : ICONS.mic)+'</div>';
      } },
    /* Kenner's own chat, as the web app's Thread draws it: Kenner's turns beside its picture with their sources as chips */
    kw: { cls:'kw', body:'kw-body',
      head: function(){ return '<div class="kw-head"><img src="'+AV+'" alt=""><b>Kenner</b><span class="kw-job">WO-RF-'+(flow === 'fix' ? '2046' : '2047')+ICONS['s-down']+'</span>'+ICONS.phone.replace('class="i"','class="i kw-call"')+ICONS['s-chev']+'</div>'; },
      day: function(){ return '<p class="kw-day">8 Nov</p>'; },
      bubble: function(m, gf, tl){
        if (m.typ) return '<div class="ktyp" role="status"><img src="'+AV+'" alt="">Kenner is typing…</div>';
        if (m.f === 'out') return '<div class="kt out'+(gf?' gf':'')+'"><div class="kbub">'+(m.voice ? KVN(m.voice) : '')+m.h+'</div>'+(tl ? '<span class="kmeta">'+m.t+' · Sent</span>' : '')+'</div>';
        var chips = m.src ? '<div class="kchips">'+m.src.map(function(x){ var c = CH[x[0]]; return '<button type="button" class="cite kch'+(c.g === 'kw' ? ' k' : '')+'" data-k="'+x[0]+'">'+(c.teams ? '<img src="'+TEAMS+'" alt="">' : ICONS[c.i])+'<span>'+c.l+'</span></button>'; }).join('')+'</div>' : '';
        return '<div class="kt in'+(gf?' gf':'')+'">'+(gf ? '<img src="'+AV+'" alt="">' : '<i></i>')+'<div>'+(m.img ? '<span class="kpic" role="img" aria-label="'+IMG_LABEL+'"></span>' : '')+'<div class="kbub">'+m.h+'</div>'+chips+(tl ? '<span class="kmeta">'+m.t+'</span>' : '')+'</div></div>';
      },
      composer: function(d){
        var inner = d && d.voice ? '<span class="ib2">'+ICONS['s-trash']+'</span>'+KVN(d.voice) : '<span class="ib2">'+ICONS.camera+'</span>'+(d ? '<span class="tx">'+d.shown+'</span>' : '<span class="ph">Message Kenner</span>');
        return '<div class="kw-in" id="ask-cmp"><div class="fld">'+inner+(d && d.ready ? SEND('s-up') : d ? '' : '<span class="ib2">'+ICONS.mic+'</span>')+'</div></div>';
      } }
  };

  var flow = 'fix', app = 'wa', F = FLOWS.fix, log = [], turn = 0, busy = false, typing = false, draft = null, fresh = 0, askTimers = [], askBody = null;
  function at(fn, ms){ askTimers.push(setTimeout(fn, ms)); }
  function halt(){ askTimers.forEach(clearTimeout); askTimers = []; }
  function clockNow(){ var m = log[log.length-1]; return (m ? m.t : F.start).replace(/^0/, ''); }

  function paint(){
    var A = APPS[app];
    askScr.className = 'scr ' + A.cls;
    askScr.innerHTML = '<div class="sbar" id="ask-clock"></div>' + A.head() + '<div class="'+A.body+'" id="ask-body" aria-live="polite"></div>' + A.composer(draft) + '<span class="home"></span>';
    askBody = $('ask-body');
    paintBody(false);
  }
  function paintBody(smooth){
    var A = APPS[app], items = log.concat(typing ? [{f:'in', typ:true, t:''}] : []), html = '', top = askBody.scrollTop;
    if (items.length) html += A.day(items[0].t);
    items.forEach(function(m, i){
      var gf = i === 0 || items[i-1].f !== m.f, tl = i === items.length-1 || items[i+1].f !== m.f;
      var b = A.bubble(m, gf, tl);
      html += i >= fresh && smooth ? b.replace(/class="(b|ib|tb|kt) /g, 'class="$1 m-in ') : b;
    });
    if (app === 'im' && items.length && items[items.length-1].f === 'out') html += '<div class="im-rc">Delivered</div>';
    askBody.innerHTML = html;
    var st = $('ask-st'); if (st){ st.textContent = typing ? 'typing…' : ''; st.className = typing ? 'typing' : ''; }
    $('ask-clock').innerHTML = '<span class="num">'+clockNow()+'</span>'+SB_IOS;
    askBody.scrollTop = top;
    askBody.scrollTo({top: askBody.scrollHeight, behavior: smooth && !still ? 'smooth' : 'auto'});
  }
  function paintComposer(){ $('ask-cmp').outerHTML = APPS[app].composer(draft); }
  function say(m){ typing = false; fresh = log.length; log.push(m); paintBody(true); }
  function setTyping(on){ typing = on; fresh = log.length; paintBody(true); }
  /* the technician's next message, typed into the composer (a voice note arrives recorded) and waiting to be sent */
  function offer(i, instant){
    var o = F.turns[i] && F.turns[i].out;
    draft = o ? {h:o.h, voice:o.voice, shown:o.voice || instant || still ? o.h : '', ready:!!(o.voice || instant || still)} : null;
    paintComposer();
    if (!draft || draft.ready) return;
    var n = o.h.length, ticks = Math.max(6, Math.round(Math.min(900, n*18)/40));
    for (var k = 1; k <= ticks; k++) (function(k){ at(function(){ draft.shown = o.h.slice(0, Math.round(n*k/ticks)); draft.ready = k === ticks; paintComposer(); }, 250 + k*40); })(k);
  }
  function message(o, t){ return {f:'out', h:o.h, voice:o.voice, t:t}; }

  /* the timeline: a node for the briefing and for each question, the latest unfolded to its steps */
  var runOf = function(r){ return r ? F.turns[r-1] : F.briefing; };
  function chip(k){
    var c = CH[k], lead = c.teams ? '<img src="'+TEAMS+'" alt="">' : ICONS[c.i];
    return '<button type="button" class="ch'+(c.g ? ' g '+c.g : '')+'" data-k="'+k+'">'+lead+'<span>'+c.l+'</span></button>';
  }
  function stepEl(s, done){
    var li = document.createElement('li');
    li.className = 'st' + (done ? ' done' : ' ing');
    li.innerHTML = '<span class="st-i">'+ICONS[s[0]]+'</span><div><p class="st-t"><b>'+(done ? s[2] : s[1])+'</b>'+(s[3] ? '<span'+(s[3].charAt(0) === '“' ? '' : ' class="nw"')+'> · '+s[3]+'</span>' : '')+'</p>'
      +'<div class="st-d"><div><p>'+s[4].replace(/WO-RF-\d+/g, '<span class="nw">$&</span>')+'</p>'+(s[5].length ? '<div class="chs">'+s[5].map(chip).join('')+'</div>' : '')+'</div></div></div>';
    return li;
  }
  function finish(li, s){ li.classList.remove('ing'); li.classList.add('done'); li.querySelector('.st-t b').textContent = s[2]; }
  function doneEl(r){
    var R = runOf(r), li = document.createElement('li');
    li.className = 'st done';
    li.innerHTML = '<span class="st-i"><img src="'+AV+'" alt=""></span><div><p class="st-t"><b>'+R.done+'</b><span> · 8 Nov · '+R.t+'</span></p></div>';
    return li;
  }
  function runEls(r, open){
    var R = runOf(r), title = r ? '“'+R.out.h+'”' : 'Briefing';
    var node = document.createElement('li'), grp = document.createElement('li');
    node.className = 'run';
    node.innerHTML = '<span class="run-i">'+ICONS[r ? 's-msg' : 's-scroll']+'</span><button type="button" aria-expanded="'+open+'" title="'+title+'"><b>'+title+'</b><span>· '+R.t+'</span>'+ICONS['s-down']+'</button>';
    grp.className = 'grp' + (open ? ' open' : '');
    grp.innerHTML = '<ol></ol>';
    return [node, grp];
  }
  function fillRun(grp, r){
    var ol = grp.firstChild;
    runOf(r).steps.forEach(function(s){ ol.appendChild(stepEl(s, true)); });
    ol.appendChild(doneEl(r));
  }
  /* the line runs on from each node and step to the next; the last one shown ends it */
  function markEnd(){
    trail.querySelectorAll('.end').forEach(function(x){ x.classList.remove('end'); });
    var grps = trail.querySelectorAll('.grp'), last = grps[grps.length-1];
    var end = last && last.classList.contains('open') && last.firstChild.lastChild ? last.firstChild.lastChild : last && last.previousSibling;
    if (end) end.classList.add('end');
  }
  function foldRun(grp, open){
    grp.classList.toggle('open', open);
    grp.previousSibling.querySelector('button').setAttribute('aria-expanded', open ? 'true' : 'false');
    markEnd();
  }
  function toEnd(el){ el.scrollTo({top: el.scrollHeight, behavior: still ? 'auto' : 'smooth'}); }
  function paintLook(upTo){
    trail.innerHTML = '';
    for (var r = 0; r <= upTo; r++){
      var els = runEls(r, r === upTo && r > 0);
      fillRun(els[1], r);
      trail.appendChild(els[0]); trail.appendChild(els[1]);
    }
    markEnd();
    lookB.scrollTop = lookB.scrollHeight;
  }
  trail.addEventListener('click', function(e){
    var b = e.target.closest('.run > button');
    if (b){ var grp = b.parentNode.nextSibling; foldRun(grp, !grp.classList.contains('open')); }
  });

  /* the report agent's laptop: the captured work order page, moved on a stage as each message lands */
  var woStage = 0;
  function report(n, animate){
    woStage = n;
    var w = wo.contentWindow;
    if (w && w.show) w.show(n, animate);
  }
  wo.addEventListener('load', function(){ wo.contentWindow.show(woStage, false); });

  function settle(i){
    halt(); typing = false; log = F.pre.slice();
    F.turns.slice(0, i+1).forEach(function(T){ log.push(message(T.out, T.t)); T.a.forEach(function(m){ log.push({f:'in', h:m.h, img:m.img, src:m.src, t:T.t}); }); });
    turn = i+1; busy = false;
    if (flow === 'fix') paintLook(i+1); else report(i+1, true);
    draft = null; paint(); offer(turn, true);
  }
  /* a message sent: the troubleshooter's run joins the timeline and its steps come in one at a time, each turning from
     what it is doing to what it found, before the answer; the report fills in what the technician said */
  function run(i){
    var T = F.turns[i];
    if (still){ settle(i); return; }
    busy = true; hideCard();
    draft = null; paintComposer(); say(message(T.out, T.t));
    var t = 600;
    at(function(){ setTyping(true); }, t);
    if (flow === 'fix'){
      var grp, ol;
      at(function(){
        trail.querySelectorAll('.grp.open').forEach(function(g){ foldRun(g, false); });
        var els = runEls(i+1, true); els[0].classList.add('in');
        grp = els[1]; ol = grp.firstChild;
        trail.appendChild(els[0]); trail.appendChild(grp); markEnd(); toEnd(lookB);
      }, 150);
      T.steps.forEach(function(s){
        var li;
        at(function(){ li = stepEl(s, false); li.classList.add('in'); ol.appendChild(li); markEnd(); toEnd(lookB); }, t);
        at(function(){ finish(li, s); setTimeout(function(){ toEnd(lookB); }, 120); }, t + 850);
        t += 1150;
      });
    } else {
      t += 900;
      at(function(){ report(i+1, true); }, t);
      t += 1600;
    }
    T.a.forEach(function(m, j){
      if (j){ at(function(){ setTyping(true); }, t); t += 900; }
      at(function(){ say({f:'in', h:m.h, img:m.img, src:m.src, t:T.t}); }, t);
      if (!j && flow === 'fix') at(function(){ var li = doneEl(i+1); li.classList.add('in'); trail.querySelector('.grp:last-child ol').appendChild(li); markEnd(); toEnd(lookB); }, t);
      t += 1000;
    });
    at(function(){ turn = i+1; busy = false; offer(turn); }, t - 400);
  }
  function start(key){
    halt(); hideCard();
    flow = key; F = FLOWS[key]; turn = 0; busy = false; typing = false; log = F.pre.slice(); draft = null;
    look.hidden = key !== 'fix'; wo.hidden = key === 'fix';
    if (key === 'fix') paintLook(0); else report(0, false);
    paint(); offer(0, true);
  }

  askScr.addEventListener('click', function(e){ if (e.target.closest('.snd.cue') && !busy && draft && draft.ready) run(turn); });
  $('agents').querySelectorAll('button').forEach(function(b){
    b.addEventListener('click', function(){
      if (b.dataset.flow === flow) return;
      $('agents').querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      start(b.dataset.flow);
    });
  });
  $('dock').querySelectorAll('button').forEach(function(b){
    b.addEventListener('click', function(){
      if (b.dataset.app === app) return;
      $('dock').querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      app = b.dataset.app;
      /* a different app shows the same conversation: one still running finishes at once */
      if (busy) settle(turn); else paint();
    });
  });

  /* a chip's card: what the source holds, on hover or focus, or on a tap where nothing hovers */
  var cardFor = null, cardTimer = null;
  function showCard(ch){
    var c = CH[ch.dataset.k];
    refc.innerHTML = '<div class="refc-b">'+(c.m ? '<span class="refc-m"><img src="'+c.m+'" alt=""></span>' : '')
      +'<div class="refc-c"><p class="refc-t"><span class="refc-av'+(c.av === ST ? ' v' : '')+'"><img src="'+c.av+'" alt=""></span>'+c.t+'</p><p class="refc-s">'+c.s+'</p>'+(c.x ? '<div class="refc-x">'+c.x+'</div>' : '')+'</div></div>'
      +'<div class="refc-f"><span>'+(c.teams ? '<img src="'+TEAMS+'" alt="">' : '')+(c.f || 'Company knowledge')+'</span>'+(c.open ? '<button type="button" data-open="'+ch.dataset.k+'">Open'+ICONS['s-chev']+'</button>' : '')+'</div>';
    var r = ch.getBoundingClientRect(), w = refc.offsetWidth, h = refc.offsetHeight;
    var left = Math.max(16, Math.min(r.left, innerWidth - w - 16)), top = r.bottom + 8;
    if (top + h > innerHeight - 16) top = Math.max(16, r.top - h - 8);
    refc.style.left = left + 'px'; refc.style.top = top + 'px';
    refc.classList.add('on'); refc.setAttribute('aria-hidden', 'false'); cardFor = ch;
  }
  function hideCard(){ clearTimeout(cardTimer); refc.classList.remove('on'); refc.setAttribute('aria-hidden', 'true'); cardFor = null; }
  function soon(fn, ms){ clearTimeout(cardTimer); cardTimer = setTimeout(fn, ms); }
  trail.addEventListener('mouseover', function(e){ var ch = e.target.closest('.ch'); if (ch && ch !== cardFor) soon(function(){ showCard(ch); }, 250); });
  trail.addEventListener('mouseout', function(e){ if (e.target.closest('.ch')) soon(hideCard, 160); });
  trail.addEventListener('focusin', function(e){ var ch = e.target.closest('.ch'); if (ch) showCard(ch); });
  trail.addEventListener('focusout', function(e){ if (e.target.closest('.ch') && !refc.contains(e.relatedTarget)) soon(hideCard, 160); });
  refc.addEventListener('mouseover', function(){ clearTimeout(cardTimer); });
  refc.addEventListener('mouseout', function(e){ if (!refc.contains(e.relatedTarget)) soon(hideCard, 160); });
  refc.addEventListener('click', function(e){ var b = e.target.closest('[data-open]'); if (b){ var k = b.dataset.open; hideCard(); openPage(k); } });
  trail.addEventListener('click', function(e){
    var ch = e.target.closest('.ch'); if (!ch) return;
    if (CH[ch.dataset.k].open && !matchMedia('(hover: none)').matches){ hideCard(); openPage(ch.dataset.k); }
    else if (cardFor === ch) hideCard(); else showCard(ch);
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') hideCard(); });
  document.addEventListener('click', function(e){ if (cardFor && !e.target.closest('.ch, .refc, .cite')) hideCard(); });
  window.addEventListener('scroll', function(){ if (cardFor) hideCard(); }, {passive:true});
  lookB.addEventListener('scroll', function(){ if (cardFor && !cardFor.matches(':focus')) hideCard(); }, {passive:true});

  /* a citation in the chat points at its chip in the latest run that cited it: resting on it rings the chip, choosing it
     unfolds that run, brings the chip into view and opens its card */
  function chipFor(k){ var all = trail.querySelectorAll('.ch[data-k="'+k+'"]'); return all[all.length-1]; }
  function point(e, on){ var c = e.target.closest && e.target.closest('.cite'), ch = c && chipFor(c.dataset.k); if (ch) ch.classList.toggle('hl', on); }
  askScr.addEventListener('mouseover', function(e){ point(e, true); });
  askScr.addEventListener('mouseout', function(e){ point(e, false); });
  askScr.addEventListener('focusin', function(e){ point(e, true); });
  askScr.addEventListener('focusout', function(e){ point(e, false); });
  askScr.addEventListener('click', function(e){
    var c = e.target.closest('.cite'); if (!c) return;
    var ch = chipFor(c.dataset.k); if (!ch) return;
    var grp = ch.closest('.grp');
    if (!grp.classList.contains('open')) foldRun(grp, true);
    ch.classList.remove('ping'); void ch.offsetWidth; if (!still) ch.classList.add('ping');
    setTimeout(function(){ ch.scrollIntoView({block:'nearest', behavior: still ? 'auto' : 'smooth'}); }, still ? 0 : 420);
    setTimeout(function(){ showCard(ch); }, still ? 0 : 900);
  });

  /* a cited page or photo opens at a size that can be read */
  var pgv = $('pgv'), pgvImg = $('pgv-img');
  function openPage(k){
    var c = CH[k];
    pgvImg.src = c.m; pgvImg.alt = c.open;
    $('pgv-cap').textContent = c.open;
    if (pgv.showModal) pgv.showModal(); else window.open(c.m, '_blank', 'noopener');
  }
  $('pgv-x').addEventListener('click', function(){ pgv.close(); });
  pgv.addEventListener('click', function(e){ if (e.target === pgv) pgv.close(); });

  /* the first message sends itself once the section is in view, to show how it goes; the rest are the visitor's to send */
  start('fix');
  if (still) settle(0);
  else if ('IntersectionObserver' in window){
    new IntersectionObserver(function(es, o){
      es.forEach(function(e){ if (e.isIntersecting){ o.disconnect(); at(function(){ if (flow === 'fix' && turn === 0 && !busy) run(0); }, 2200); } });
    }, {threshold:.45}).observe($('work'));
  }

})();
