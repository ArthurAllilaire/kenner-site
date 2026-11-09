# Builds the website's copy of the walk-in cooler work order page from tools/capture-work-order.mjs's captures: the
# app's own stylesheets, fonts and picture, and each stage open and folded, swapped by the homepage as messages are sent.
# Usage: python3 tools/assemble-work-order.py <capture dir> <site dir>, with the local Kenner still running.
import json, re, sys, urllib.request, urllib.parse, pathlib

cap, site = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
data = json.loads((cap / 'capture.json').read_text())
server = 'http://127.0.0.1:' + urllib.parse.urlparse(data['origin']).port.__str__()
out = site / 'app'
assets = out / 'kenner'
assets.mkdir(parents=True, exist_ok=True)

def fetch(path):
    with urllib.request.urlopen(server + path) as r:
        return r.read()

saved = {}
def keep(path):
    """Copies one of the app's files into the site, once, and returns its name there."""
    path = path.split('?')[0].split('#')[0]
    if path not in saved:
        name = pathlib.PurePosixPath(path).name
        (assets / name).write_bytes(fetch(path))
        saved[path] = name
    return saved[path]

css = []
for href in data['css']:
    path = urllib.parse.urlparse(href).path
    text = fetch(path).decode()
    def local(m):
        ref = m.group(2)
        if ref.startswith('data:'):
            return m.group(0)
        return 'url(' + keep(urllib.parse.urljoin(path, ref)) + ')'
    css.append(re.sub(r'url\((["\']?)([^)"\']+)\1\)', local, text))
(assets / 'kenner.css').write_text('\n'.join(css))

def page(html):
    html = re.sub(r'src="(/kenner/[^"]+)"', lambda m: 'src="kenner/' + keep(m.group(1)) + '"', html)
    return html.replace('title="Double-click to edit"', '')

templates = ''.join(f'<template id="s{i}">{page(h["open"])}</template>\n<template id="f{i}">{page(h["folded"])}</template>\n' for i, h in enumerate(data['shots']))
(out / 'work-order.html').write_text('''<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Walk-in cooler work order</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="kenner/kenner.css">
<style>
/* A still copy of Kenner's work order page: it scrolls and its cards fold from their titles; nothing else opens or edits. */
html,body{margin:0;background:var(--surface-page)}
main a,main button,main label,main summary,main input,main select,main textarea,main [role="button"]{pointer-events:none}
main section[id^="job-"] h2>button[aria-controls]{pointer-events:auto}
.fresh{animation:fresh 2.6s cubic-bezier(.16,1,.3,1)}
@keyframes fresh{from{background:color-mix(in oklab,#1438CA 12%,transparent);box-shadow:0 0 0 8px color-mix(in oklab,#1438CA 12%,transparent);border-radius:6px}}
@media (prefers-reduced-motion:reduce){.fresh{animation:none}}
</style>
</head>
<body>
<div id="page"></div>
''' + templates + '''<script>
(function(){
  var page = document.getElementById('page'), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* the service report stays open and the other cards start folded, as the visitor would scan the job */
  var start = ['job-briefing', 'job-actions', 'job-knowledge'], folded = start.slice(), stage = 0;
  function card(id, fold){ return document.getElementById((fold ? 'f' : 's') + stage).content.getElementById(id).cloneNode(true); }
  function render(){
    page.innerHTML = '';
    page.appendChild(document.getElementById('s' + stage).content.cloneNode(true));
    folded.forEach(function(id){ var el = document.getElementById(id); if (el) el.replaceWith(card(id, true)); });
  }
  page.addEventListener('click', function(e){
    var b = e.target.closest('section[id^="job-"] h2 > button[aria-controls]');
    if (!b) return;
    var id = b.closest('section').id, fold = b.getAttribute('aria-expanded') === 'true';
    folded = folded.filter(function(x){ return x !== id; }).concat(fold ? [id] : []);
    var next = card(id, fold);
    document.getElementById(id).replaceWith(next);
    next.querySelector('h2 > button').focus({preventScroll: true});
  });
  /* each report field by its form key, each action by its row, each knowledge list by its heading, and each card's
     title row, which is all a folded card shows; what a folded card hides is left out */
  function parts(){
    var m = {};
    function add(k, el){ if (el.getClientRects().length) m[k] = {el:el, text:el.textContent}; }
    page.querySelectorAll('section[id^="job-"]').forEach(function(s){ add('row:' + s.id, s.firstElementChild); });
    page.querySelectorAll('label[for^="report-field-"]').forEach(function(l){ add(l.htmlFor, l.closest('.min-w-0') || l.parentNode.parentNode); });
    page.querySelectorAll('tbody[id^="note-"]').forEach(function(b){ add(b.id, b); });
    page.querySelectorAll('#job-knowledge-body > section').forEach(function(s){ var h = s.querySelector('h3'); add('k:' + (h ? h.textContent : ''), s); });
    return m;
  }
  /* the stage the technician's messages have reached; what changed flashes, and the first change comes into view, or
     the first changed title row when only folded cards changed. A conversation starting again starts at the top with
     the cards folded again. Only this page scrolls: scrollIntoView would move the homepage too. */
  window.show = function(n, animate){
    var before = parts();
    stage = n;
    if (!animate) folded = start.slice();
    render();
    if (!animate){ scrollTo(0, 0); return; }
    var after = parts(), first = null, row = null;
    Object.keys(after).forEach(function(k){
      if (before[k] && before[k].text === after[k].text) return;
      after[k].el.classList.add('fresh');
      if (k.indexOf('row:') === 0) row = row || after[k].el; else first = first || after[k].el;
    });
    first = first || row;
    if (first){
      var r = first.getBoundingClientRect();
      scrollTo({top: scrollY + r.top - Math.max(16, (innerHeight - r.height) / 2), behavior: still ? 'auto' : 'smooth'});
    }
  };
  show(+(location.hash.slice(1) || 0), false);
})();
</script>
</body>
</html>
''')
print('page', (out / 'work-order.html').stat().st_size, 'assets', sorted(p.name for p in assets.iterdir()))
