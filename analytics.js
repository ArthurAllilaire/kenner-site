/* Analytics (PostHog), visitor identification (RB2B) and the cookie notice that governs both. Loaded by index.html and legal.html.
   Every visit is measured without touching the device: PostHog keeps its state in memory, so nothing is stored and a visitor
   is a new anonymous id on each page load. A cookie, a lasting id and session recordings need the visitor's say:
   outside the United States they start only after "Accept"; in the United States they run, together with RB2B, until the
   visitor switches them off under "Cookie settings".
   The privacy policy (legal.html#analytics) describes exactly this split; change them together. */
(function(){
  var TOKEN = 'phc_xtRPdEy5DnNUASjW574UqMAqzziktLwgG7B4H3pFjUkc', HOST = 'https://us.i.posthog.com';
  var LIVE = /^(www\.)?getkenner\.com$/.test(location.hostname);
  var KEY = 'kenner-consent';

  /* PostHog's loader, as published at posthog.com/docs/libraries/js: a stub that queues calls until array.js arrives */
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  /* the choice is the one thing kept on the device before consent; a browser that refuses storage is asked again next visit.
     'granted' and 'denied' are the visitor's answers; 'implied' is the United States default, kept so a returning visitor is recognised from the first event */
  function stored(){ try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v){ try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch (e) {} }
  var consent = stored();
  function on(){ return consent === 'granted' || consent === 'implied'; }
  /* PostHog keeps a per-tab id in session storage that its own reset leaves behind */
  function clearTabId(){ try { Object.keys(sessionStorage).forEach(function(k){ if (k.indexOf('ph_') === 0) sessionStorage.removeItem(k); }); } catch (e) {} }
  if (!on()) clearTabId();

  function mode(granted){
    return {
      persistence: granted ? 'localStorage+cookie' : 'memory',
      /* a person profile per visitor only makes sense once the visitor has a lasting id */
      person_profiles: granted ? 'always' : 'identified_only',
      disable_session_recording: !granted
    };
  }
  var config = mode(on());
  config.api_host = HOST;
  config.defaults = '2026-08-30';
  config.capture_heatmaps = true;
  config.capture_performance = true;
  config.capture_exceptions = true;
  /* previews and local copies run the same code but record nothing: each event is printed instead */
  if (!LIVE) config.before_send = function(e){ console.debug('[analytics, not sent]', e.event, e.properties); return null; };
  posthog.init(TOKEN, config);
  posthog.register({consent: consent || 'pending'});
  function track(name, props){ posthog.capture(name, props); }

  function set(next){
    var was = on();
    consent = next;
    store(consent);
    posthog.set_config(mode(on()));
    /* switched off: the lasting id goes with the cookie, so what follows is not tied to the visits before */
    if (was && !on()){ posthog.reset(); clearTabId(); }
    posthog.register({consent: consent || 'pending'});
  }
  function decide(granted){
    set(granted ? 'granted' : 'denied');
    track(granted ? 'consent_granted' : 'consent_declined');
    if (granted && us) rb2b();
    /* RB2B cannot be stopped once it runs on a page: what it and the partner it calls (LiveIntent, the _li_ and _lc2_ names)
       stored here is removed, and the page loaded again without it. A cookie's domain cannot be read back, so each way it may have been set is cleared */
    if (!granted && window.reb2b){
      var theirs = /^(_reb2b|_li_|_lc2_)/, host = location.hostname.replace(/^www\./, '');
      try {
        [localStorage, sessionStorage].forEach(function(st){ Object.keys(st).forEach(function(k){ if (theirs.test(k)) st.removeItem(k); }); });
        document.cookie.split('; ').forEach(function(c){
          var name = c.split('=')[0];
          if (theirs.test(name)) ['', '; domain=' + host, '; domain=www.' + host].forEach(function(d){ document.cookie = name + '=; max-age=0; path=/' + d; });
        });
      } catch (e) {}
      location.reload();
    }
  }

  /* RB2B puts a company, or for some visitors a name, to a visit from the United States. Its loader as RB2B publishes it */
  function rb2b(){
    if (!LIVE){ console.debug('[rb2b, not loaded]'); return; }
    !function(key){if(window.reb2b)return;window.reb2b={loaded:true};var s=document.createElement("script");s.async=true;s.src="https://ddwl4m2hdecbv.cloudfront.net/b/"+key+"/"+key+".js.gz";document.getElementsByTagName("script")[0].parentNode.insertBefore(s,document.getElementsByTagName("script")[0]);}("XOE9GH30K3OM");
  }

  /* the notice */
  var CSS = '.kn-ck{position:fixed;z-index:80;left:max(20px,env(safe-area-inset-left,0px));bottom:max(20px,env(safe-area-inset-bottom,0px));width:min(380px,calc(100vw - 40px));padding:20px;border:1px solid #DADDE3;border-radius:16px;background:#fff;color:#0A0B1E;box-shadow:0 18px 48px -12px rgba(10,11,30,.22),0 2px 6px rgba(10,11,30,.05);font:400 14px/1.5 "Geist",system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;opacity:0;transform:translateY(12px);transition:opacity .3s,transform .5s cubic-bezier(.16,1,.3,1)}' +
    '.kn-ck.on{opacity:1;transform:none}.kn-ck:focus{outline:none}' +
    '.kn-ck h2{margin:0 0 6px;font:inherit;font-weight:500;font-size:15px;line-height:1.3;letter-spacing:0}.kn-ck p{margin:0;color:#5D6173;text-wrap:pretty}.kn-ck a{color:#0A0B1E;text-underline-offset:2px}' +
    '.kn-ck-acts{display:flex;gap:10px;margin-top:16px}' +
    '.kn-ck button{flex:1;height:40px;padding:0 16px;border:1px solid #DADDE3;border-radius:10px;background:#fff;color:#0A0B1E;font:inherit;font-weight:500;line-height:1;cursor:pointer;transition:background .2s,border-color .2s,transform .16s cubic-bezier(.16,1,.3,1)}' +
    '.kn-ck button:hover{border-color:#0A0B1E}.kn-ck button:active{transform:scale(.97)}' +
    '.kn-ck button[data-v="1"]{border-color:#0A0B1E;background:#0A0B1E;color:#fff}.kn-ck button[data-v="1"]:hover{background:#262A45;border-color:#262A45}' +
    '.kn-ck a:focus-visible,.kn-ck button:focus-visible{outline:2px solid #1438CA;outline-offset:3px}' +
    '@media (max-width:560px){.kn-ck{left:max(12px,env(safe-area-inset-left,0px));right:max(12px,env(safe-area-inset-right,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));width:auto;padding:18px}.kn-ck button{height:44px}html.kn-ck-open body{padding-bottom:calc(var(--kn-ck-h,0px) + 24px)}}' +
    '@media (prefers-reduced-motion:reduce){.kn-ck{transition:none;transform:none}}';
  var notice = null, root = document.documentElement;
  function show(focus){
    if (!notice){
      var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
      notice = document.createElement('div');
      notice.className = 'kn-ck'; notice.tabIndex = -1; notice.setAttribute('role', 'region'); notice.setAttribute('aria-labelledby', 'kn-ck-t');
      notice.innerHTML = '<h2 id="kn-ck-t">Analytics cookies</h2><p></p>' +
        '<div class="kn-ck-acts"><button type="button" data-v="0">Decline</button><button type="button" data-v="1">Accept</button></div>';
      notice.addEventListener('click', function(e){
        var b = e.target.closest('button'); if (!b) return;
        decide(b.dataset.v === '1'); hide();
      });
      /* on a phone the notice spans the window: the page gets that much room below the footer, so the imprint and privacy links can always be scrolled into reach */
      if ('ResizeObserver' in window) new ResizeObserver(room).observe(notice);
    }
    /* first in the document, so a keyboard reaches it before the rest of the page */
    notice.querySelector('p').innerHTML = (us
      ? 'We use cookies to understand how this site is used. If you decline, we only count visits and store nothing on your device.'
      : 'With your OK we set a cookie and record your visit, to improve this site. Without it we only count visits and store nothing on your device.') +
      ' <a href="legal.html#analytics">Privacy policy</a>';
    document.body.insertBefore(notice, document.body.firstChild);
    room(); notice.classList.add('on'); root.classList.add('kn-ck-open');
    if (focus) notice.focus();
  }
  function room(){ root.style.setProperty('--kn-ck-h', notice.offsetHeight + 'px'); }
  function hide(){
    notice.classList.remove('on'); root.classList.remove('kn-ck-open');
    setTimeout(function(){ if (!notice.classList.contains('on')) notice.remove(); }, 500);
  }

  /* Where the visitor is decides the default. PostHog answers from the IP address (feature flag us-visitor, changed in PostHog
     without a deploy). Until it answers, and if it never does, a visitor counts as outside the United States and is asked. */
  var us = false;
  function ask(){ if (!consent && !(notice && notice.classList.contains('on'))) show(false); }
  var late = setTimeout(ask, 4000);
  posthog.onFeatureFlags(function(flags, variants, ctx){
    clearTimeout(late);
    if (ctx && ctx.errorsLoading){ ask(); return; }
    us = flags.indexOf('us-visitor') >= 0;
    if (us && !consent){ set('implied'); if (notice && notice.classList.contains('on')) hide(); }
    /* the default belongs to the place, not the browser: a visitor who has since left the United States is asked like anyone else */
    else if (!us && consent === 'implied') set(null);
    if (us && on()) rb2b();
    ask();
  });

  /* what the page's own scripts know and autocapture cannot name. Listened for from outside, so those scripts stay as they are;
     in the capture phase, because some of them change the element (a send button loses its cue) before the click bubbles up */
  function sectionName(s){ return s.id || s.className.split(' ')[0]; }
  function pressed(group){ return document.querySelector(group + ' [aria-pressed="true"]'); }
  var sends = {};
  document.addEventListener('click', function(e){
    var t = e.target, el;
    if (!t.closest) return;
    if (t.closest('[data-cookie-settings]')){ show(true); return; }
    /* the page clicks its own controls while it sets up; only the visitor's clicks count */
    if (!e.isTrusted) return;
    if ((el = t.closest('a[href*="calendar.app.google"]'))){
      var sec = el.closest('section');
      track('book_demo_clicked', {placement: el.closest('header') ? 'nav' : sec ? sectionName(sec) : 'page', label: el.textContent.trim()});
    }
    /* the agent or app already showing does nothing when clicked; choosing an agent starts its conversation from the top */
    else if ((el = t.closest('#agents [data-flow][aria-pressed="false"]'))){ sends[el.dataset.flow] = 0; track('demo_agent_selected', {agent: el.dataset.flow}); }
    else if ((el = t.closest('#dock [data-app][aria-pressed="false"]'))) track('demo_app_selected', {app: el.dataset.app});
    /* a send button is on the page only while a message is ready, so each click on it, or on the pill that stands for it, sends one */
    else if (t.closest('.snd.cue, .send-cue')){
      var agent = pressed('#agents').dataset.flow, draft = document.querySelector('#ask-cmp .fld'), said = draft ? draft.textContent.trim() : '';
      sends[agent] = (sends[agent] || 0) + 1;
      track('demo_message_sent', {agent: agent, step: sends[agent], app: pressed('#dock').dataset.app, message: draft && draft.querySelector('.vdraft') ? 'Voice note, ' + said : said});
    }
  }, true);

  /* how far down the page a visit gets, section by section: a section counts once it crosses the middle of the window */
  if ('IntersectionObserver' in window){
    var seen = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (!e.isIntersecting) return;
        seen.unobserve(e.target);
        track('section_viewed', {section: sectionName(e.target)});
      });
    }, {rootMargin: '-50% 0px -50% 0px'});
    document.querySelectorAll('main > section').forEach(function(s){ seen.observe(s); });
  }

  /* the recorded call in the hero: started, and how far it was heard */
  var call = document.getElementById('mk-audio'), calling = false;
  if (call){
    call.addEventListener('play', function(){ calling = true; track('call_played', {from_seconds: Math.round(call.currentTime)}); });
    var stopped = function(){
      if (!calling) return;
      calling = false;
      var d = call.duration || 0;
      track('call_stopped', {seconds: Math.round(call.currentTime), completed: d > 0 && call.currentTime >= d - 1});
    };
    call.addEventListener('pause', stopped); call.addEventListener('ended', stopped);
  }

  /* toggle does not bubble, hence the capture phase */
  document.addEventListener('toggle', function(e){
    var d = e.target;
    if (d.matches && d.matches('details.q') && d.open) track('faq_opened', {question: d.querySelector('summary').textContent.trim()});
  }, true);

  /* integrations: which tiles a visitor stops on (a pointer passing over on its way elsewhere does not count) or taps */
  document.querySelectorAll('#hub .tile').forEach(function(g){
    var timer = 0, done = false;
    function inspected(){ if (done) return; done = true; track('integration_inspected', {name: g.dataset.n}); }
    g.addEventListener('pointerenter', function(){ timer = setTimeout(inspected, 600); });
    g.addEventListener('pointerleave', function(){ clearTimeout(timer); });
    g.addEventListener('click', inspected);
  });
})();
