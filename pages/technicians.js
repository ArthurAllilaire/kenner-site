/* Technicians page: its own script. Loaded by technicians.html with defer, after site.js (the nav).
   1. The hero call: the mark on the phone is the voice. One control plays the recorded call (audio/debrief.mp3); the two
      in-call messages arrive on the phone's screen at their times, and one short line says what is being said.
      The logic is the home page's hero call (index.html before v6), with the same cues, speed and message times.
   2. The phone's scale as a number, for a browser whose CSS cannot divide two lengths.
   3. The channel row: one tile is lit and its line stands under the row. */
(function(){
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(id){ return document.getElementById(id); };

  /* ---- 1. the hero call ---- */
  (function(){
    var phone = $('tech-phone'), mk = $('tech-mk'), mkG = $('tech-rays'), cta = $('tech-cta'), ctaL = $('tech-cta-l'), ctaT = $('tech-cta-t');
    var cap = $('tech-cap'), aud = $('mk-audio'), tip = $('tech-tip'), vis = $('tech-vis');   /* mk-audio: the id analytics.js listens on */
    if (!phone || !mk || !mkG || !cta || !cap || !aud) return;
    /* the mark. Its sixteen rays are the logo's own shapes; each keeps its inner end and changes length.
       At rest they breathe; while the call plays they move with the voice (the recording's own spectrum, or a speech-like rhythm
       when there is no sound). The rays nearest the pointer reach for it, and moving the pointer round the mark spins it. */
    var MARK = 'M48.4 36.6L39.8 4.1L36.4 5.0L32.9 6.2L45.9 37.6ZM31.1 7.0L27.8 8.5L24.8 10.3L41.7 39.4L44.1 38.4ZM39.4 41.7L10.3 24.8L8.5 27.8L7.0 31.1L38.4 44.1ZM6.2 32.9L5.0 36.4L4.1 39.8L36.6 48.4L37.6 45.9ZM36.6 51.6L4.1 60.2L5.0 63.6L6.2 67.1L37.6 54.1ZM7.0 68.9L8.5 72.2L10.3 75.2L39.4 58.3L38.4 55.9ZM41.7 60.6L24.8 89.7L27.8 91.5L31.1 93.0L44.1 61.6ZM32.9 93.8L36.4 95.0L39.8 95.9L48.4 63.4L45.9 62.4ZM67.1 6.2L63.6 5.0L60.2 4.1L51.6 36.6L54.1 37.6ZM58.3 39.4L75.2 10.3L72.2 8.5L68.9 7.0L55.9 38.4ZM93.0 31.1L91.5 27.8L89.7 24.8L60.6 41.7L61.6 44.1ZM63.4 48.4L95.9 39.8L95.0 36.4L93.8 32.9L62.4 45.9ZM93.8 67.1L95.0 63.6L95.9 60.2L63.4 51.6L62.4 54.1ZM60.6 58.3L89.7 75.2L91.5 72.2L93.0 68.9L61.6 55.9ZM68.9 93.0L72.2 91.5L75.2 89.7L58.3 60.6L55.9 61.6ZM51.6 63.4L60.2 95.9L63.6 95.0L67.1 93.8L54.1 62.4Z';
    /* the recorded call, one short line at a time: start in recording seconds, who speaks (K for Kenner), the words.
       The twelve starts marked * are the home page's cues, unchanged. Its lines were too long for a phone's screen, so each is cut
       into phrases; the starts in between come from a word-level transcript of the recording (whisper, run on this machine) */
    var CUES = [
      [0, 'K', 'Hey, it’s Kenner.'],                      /* * */
      [1.48, 'K', 'What can I help you with?'],
      [2.5, '', 'Hi Kenner, I’m at the site now'],        /* * */
      [4.29, '', 'and it’s throwing an F74 error.'],
      [6.39, '', 'What does that mean again?'],
      [8.7, 'K', 'F74 means the boiler is reporting'],    /* * */
      [10.77, 'K', 'water pressure too low.'],
      [12.9, 'K', 'It locks out the burner'],             /* * */
      [13.92, 'K', 'and stops heating.'],
      [15.2, 'K', 'Since it’s recurring,'],               /* * */
      [16.07, 'K', 'compare the boiler reading'],
      [17.25, 'K', 'with an external manometer.'],
      [19.9, '', 'Sure, will do.'],                       /* * */
      [20.72, '', 'Do you have any photos'],
      [21.73, '', 'you can send me'],
      [22.72, '', 'from the last visit,'],
      [23.68, '', 'so I can compare?'],
      [26.2, 'K', 'I’ll send last visit’s photos.'],      /* * */
      [28.82, 'K', 'Sent to your iMessage.'],
      [31.0, '', 'Cheers. And one more note'],            /* * */
      [32.77, '', 'before I continue:'],
      [33.75, '', 'the owner has changed.'],
      [34.5, '', 'It’s now George, no longer Tom,'],      /* * */
      [35.91, '', 'because he’s taken over'],
      [36.85, '', 'from his father.'],
      [39.2, 'K', 'Got it. I’ll note George'],            /* * */
      [40.09, 'K', 'as the owner.'],
      [41.44, 'K', 'Noted.'],
      [42.7, '', 'Cheers Kenner, see you later.'],        /* * */
      [45.2, 'K', 'See you later.']                       /* * */
    ], capAt = -1;
    /* messages that arrive during the call: element, the second it arrives, how long it stays (the home page's times) */
    var MSGS = [['tech-note', 29.5, 2.5], ['tech-act', 41.4, 2.5]].map(function(m){ return {el: $(m[0]), at: m[1], stay: m[2], state: 0}; }).filter(function(m){ return m.el; });
    /* the call plays a little faster than it was recorded; the cues stay in recording seconds because they follow the audio's own clock */
    var SPEED = 1.1;
    aud.defaultPlaybackRate = aud.playbackRate = SPEED;

    var RIN = 13.8, rays = MARK.split('Z').filter(Boolean).map(function(d){
      var pts = d.slice(1).split('L').map(function(p){ var xy = p.trim().split(/\s+/), x = +xy[0] - 50, y = +xy[1] - 50; return {r: Math.hypot(x, y), a: Math.atan2(y, x)}; });
      var mid = pts.reduce(function(m, p){ return p.r > m.r ? p : m; }, pts[0]).a;
      return {pts: pts, a: mid, el: document.createElementNS('http://www.w3.org/2000/svg', 'polygon'), s: 1};
    });
    rays.sort(function(p, q){ return p.a - q.a; });
    mkG.textContent = '';                                 /* the still shape gives way to the sixteen rays */
    rays.forEach(function(r){ mkG.appendChild(r.el); });
    /* the caption row: Kenner's lines carry the mark in front */
    var capI = document.createElement('img'), capS = document.createElement('span');
    capI.src = 'brand/mark-ultramarine.svg'; capI.alt = ''; capI.hidden = true; cap.appendChild(capI); cap.appendChild(capS);

    var finePtr = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var on = false, play = false, T = 0, last = 0, raf = 0, dur = 46.6, sound = false, wait = false, rot = 0, spin = 0, ptr = null, ptrAng = null, ctx = null, analyser = null, bins = null, shown = -1;
    function wrap(a){ while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }
    function mmss(s){ s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
    /* the button says what a click does, with the call's length at rest and the time it has run after that */
    function face(){
      var sec = T > 0 ? Math.floor(T / SPEED) : -1;
      ctaL.textContent = play ? 'Pause' : T > 0 ? 'Resume' : 'Listen to a call';
      if (sec !== shown){ shown = sec; ctaT.textContent = sec < 0 ? mmss(dur / SPEED) : mmss(sec); }
    }
    function draw(now){
      var t = now / 1000, env = 0;
      if (play){
        /* without a recording: syllables in bursts, a breath between sentences */
        env = Math.max(0, Math.sin(t * 5.2) * .5 + .5) * (.55 + .45 * Math.sin(t * 13.7 + 1)) * (Math.sin(t * 1.3) > -.86 ? 1 : .15);
        if (sound && analyser) analyser.getByteFrequencyData(bins);
      }
      rays.forEach(function(r, i){
        var want = 1;
        if (!still) want += .03 * Math.sin(t * 1.15 + i * .9);
        if (!still && !play){ var ph = wrap(r.a + rot - t * 1.4); want += .07 * Math.exp(-(ph * ph) / .5); }
        if (play) want += sound && analyser ? (bins[2 + (i * 3) % 40] / 255) * .42 - .08 : env * (.1 + .26 * (Math.sin(t * 8.3 + i * 2.4) * .5 + .5)) - .05;
        if (ptr){
          var diff = wrap(ptr.a - (r.a + rot)), near = Math.max(0, 1 - Math.abs(ptr.d - .8) / 1.7);
          want += Math.exp(-(diff * diff) / .28) * near * (play ? .34 : .13);
        }
        r.s += (want - r.s) * (still ? 1 : .2);
        r.el.setAttribute('points', r.pts.map(function(p){ var rr = RIN + (p.r - RIN) * r.s; return (50 + rr * Math.cos(p.a)).toFixed(2) + ',' + (50 + rr * Math.sin(p.a)).toFixed(2); }).join(' '));
      });
      if (!still){ rot += spin + (play ? .0016 : 0); spin *= .94; }
      mkG.setAttribute('transform', 'rotate(' + (rot * 180 / Math.PI).toFixed(2) + ' 50 50)');
    }
    function tick(now){
      raf = 0; if (!on && !play) return;
      if (play){
        if (sound) T = aud.currentTime; else if (!wait) T += (now - last) / 1000 * SPEED;
        last = now;
        if (T >= dur) stop(true);
        else {
          /* each message arrives as Kenner says it is done, stays a moment, and leaves */
          MSGS.forEach(function(m){ if (m.state === 0 && T >= m.at){ m.state = 1; m.el.classList.remove('tech-out'); } if (m.state === 1 && T >= m.at + m.stay){ m.state = 2; m.el.classList.add('tech-gone'); } });
          var k = 0; while (k < CUES.length - 1 && CUES[k + 1][0] <= T) k++;
          if (k !== capAt){ capAt = k; capI.hidden = CUES[k][1] !== 'K'; capS.textContent = CUES[k][2]; cap.classList.toggle('tech-cap-k', CUES[k][1] === 'K'); }
          face();
        }
      }
      draw(now);
      if (!still || play) raf = requestAnimationFrame(tick);
    }
    function msgReset(){ MSGS.forEach(function(m){ m.state = 0; m.el.classList.remove('tech-gone'); m.el.classList.add('tech-out'); }); }
    function stop(reset){
      play = false; if (sound) aud.pause();
      phone.classList.remove('tech-playing'); cta.setAttribute('aria-pressed', 'false');
      if (reset){ T = 0; capAt = -1; capS.textContent = ''; capI.hidden = true; cap.classList.remove('tech-cap-k'); msgReset(); }
      face();
    }
    /* the sound runs through an analyser so the rays can follow the voice. iOS starts an AudioContext only inside the tap that asks for it,
       and on a first visit the recording can take seconds to arrive: a context made when the sound begins stays suspended and the call is silent.
       So it is made, and resumed, in the tap. The "playback" session keeps the call audible with the ringer on silent, as a plain <audio> is */
    function voice(){
      if (navigator.audioSession) navigator.audioSession.type = 'playback';
      try {
        if (!ctx){
          var AC = window.AudioContext || window.webkitAudioContext;
          ctx = new AC();
          var src = ctx.createMediaElementSource(aud), an = ctx.createAnalyser();
          an.fftSize = 128; src.connect(an); an.connect(ctx.destination);
          analyser = an; bins = new Uint8Array(an.frequencyBinCount);
        }
        if (ctx.state !== 'running') ctx.resume();
      } catch (e) {}
    }
    function toggle(){
      if (tip) tip.classList.remove('tech-on');
      if (play){ stop(false); return; }
      if (T === 0) msgReset();
      voice();
      phone.classList.add('tech-heard');
      play = true; last = performance.now(); phone.classList.add('tech-playing'); cta.setAttribute('aria-pressed', 'true'); face();
      /* the words wait for the sound to start (up to a second and a half), so lines and messages stay in step with the recording; with no recording they run on the clock */
      wait = !sound; setTimeout(function(){ wait = false; }, 1500);
      /* a paused call is already at its place: seeking there again would restart it on a server that cannot serve a part of the file */
      try { if (Math.abs(aud.currentTime - T) > .3) aud.currentTime = T; var p = aud.play(); if (p && p.catch) p.catch(function(){ sound = false; wait = false; }); } catch (e) { wait = false; }
      if (!raf) raf = requestAnimationFrame(tick);
    }
    cta.addEventListener('click', toggle);
    mk.addEventListener('click', toggle);
    aud.addEventListener('playing', function(){
      if (!play) return;
      sound = true; wait = false; if (isFinite(aud.duration) && aud.duration > 1) dur = aud.duration;
    });
    aud.addEventListener('ended', function(){ if (play) stop(true); });
    /* something outside the page paused the sound (a media key, a call coming in): show the call as paused, so one tap resumes it */
    aud.addEventListener('pause', function(){ if (play && sound && !aud.ended) stop(false); });
    aud.addEventListener('error', function(){ sound = false; wait = false; });
    /* the pointer, measured from the mark's centre in units of its radius */
    function onPtr(e){
      if (!on) return;
      var b = mk.getBoundingClientRect(), R = b.width / 2, x = (e.clientX - b.left - R) / R, y = (e.clientY - b.top - b.height / 2) / R, d = Math.hypot(x, y), a = Math.atan2(y, x);
      if (tip){
        var hint = finePtr && !play && d <= 1.05 && e.type === 'pointermove';
        tip.classList.toggle('tech-on', hint); if (hint) tip.style.transform = 'translate(' + (e.clientX + 14) + 'px,' + (e.clientY + 18) + 'px)';
      }
      if (d > 2.6){ ptr = null; ptrAng = null; return; }
      if (ptrAng !== null && d > .25 && !still) spin = Math.max(-.02, Math.min(.02, spin + wrap(a - ptrAng) * (play ? .045 : .018)));
      ptrAng = a; ptr = {a: a, d: d};
    }
    window.addEventListener('pointermove', onPtr, {passive: true});
    mk.addEventListener('pointerdown', onPtr);
    document.addEventListener('pointerleave', function(){ ptr = null; ptrAng = null; if (tip) tip.classList.remove('tech-on'); });
    /* the rays rest while the hero is off screen; a call that is playing carries on */
    function run(v){ on = v; if (v){ draw(performance.now()); if (!raf && !still) raf = requestAnimationFrame(tick); } else if (tip) tip.classList.remove('tech-on'); }
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ es.forEach(function(e){ run(e.isIntersecting); }); }, {threshold: .05}).observe(vis || phone);
    else run(true);
    draw(performance.now());
  })();

  /* ---- 2. the phone's scale. The render and the screen lie on a stage of fixed size, scaled to the phone's box: the box's width over
     the stage's own, as a plain number. The stylesheet works out the same number with tan(atan2()); this is for a browser that
     cannot, and it follows the box when the window changes ---- */
  (function(){
    var phone = $('tech-phone'), stage = $('tech-stage'); if (!phone || !stage) return;
    function fit(){ var w = stage.offsetWidth; if (w) stage.style.setProperty('--tech-s', (phone.getBoundingClientRect().width / w).toFixed(5)); }
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(phone); else window.addEventListener('resize', fit);
    fit();
  })();

  /* ---- 3. the channel row. The lit tile moves along the row by itself while the row is on screen and nobody is choosing;
     the pointer or the keyboard holds it on a tile, and a click or a tap keeps it there for good. No motion, no moving ---- */
  (function(){
    var row = $('tech-chs'), line = $('tech-line'); if (!row || !line) return;
    var tiles = [].slice.call(row.querySelectorAll('.tech-tile')); if (!tiles.length) return;
    var STEP = 3600, cur = 0, timer = 0, seen = false, held = false, done = still;
    function show(i){
      if (i === cur) return;
      cur = i;
      tiles.forEach(function(t, k){ t.classList.toggle('tech-on', k === i); });
      var b = document.createElement('b'); b.textContent = tiles[i].dataset.n;
      line.textContent = ''; line.appendChild(b); line.appendChild(document.createTextNode(' ' + tiles[i].dataset.d));
      if (!still && line.animate) line.animate([{opacity: .35}, {opacity: 1}], {duration: 260, easing: 'ease'});
    }
    function plan(){
      clearTimeout(timer);
      if (done || held || !seen || document.hidden) return;
      timer = setTimeout(function(){ show((cur + 1) % tiles.length); plan(); }, STEP);
    }
    function hold(v){ held = v; row.classList.toggle('tech-hov', v); plan(); }
    tiles.forEach(function(t, i){
      t.addEventListener('pointerenter', function(e){ if (e.pointerType === 'mouse'){ show(i); hold(true); } });
      t.addEventListener('focus', function(){ show(i); hold(true); });
      t.addEventListener('blur', function(){ hold(false); });
      t.addEventListener('click', function(){ done = true; show(i); plan(); });
    });
    row.addEventListener('pointerleave', function(e){ if (e.pointerType === 'mouse' && !row.contains(document.activeElement)) hold(false); });
    document.addEventListener('visibilitychange', plan);
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ es.forEach(function(e){ seen = e.isIntersecting; plan(); }); }, {threshold: .6}).observe(row);
  })();
})();
