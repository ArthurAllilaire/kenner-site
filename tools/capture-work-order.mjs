// Captures the walk-in cooler's work order page from the real Kenner web app at each stage of the service report
// conversation, with the report, actions and knowledge scripted per stage, for the laptop on the homepage.
// Run it against a local Kenner holding the refrigeration scenario (in kenner-demo: npm run local -- start --template
// <refrigeration release>), then build the page with tools/assemble-work-order.py; README.md has the steps.
//   node tools/capture-work-order.mjs <the server's /s/ sign-in link> <capture dir> [width]
import fs from 'node:fs';
import path from 'node:path';

// Playwright comes from kenner-demo's browser tests, beside this checkout, unless PLAYWRIGHT names another copy.
const { chromium } = await import(process.env.PLAYWRIGHT || new URL('../../kenner-demo/tests/browser/node_modules/playwright/index.mjs', import.meta.url).href);
const [,, link, out, width = '700'] = process.argv;
const origin = new URL(link).origin;
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +width, height: 1400 } });
await page.goto(link);
await page.waitForURL(/#\/jobs/);
const get = p => page.evaluate(async p => (await (await fetch('/api/v1' + p)).json()).data, p);
const jobs = await get('/jobs');
const cooler = jobs.find(j => j.reference === 'WO-RF-2047').id;
const live = await get('/jobs/' + cooler);
// The demo's finished copy of this job holds the complete report the stages are cut from.
const finished = await get('/jobs/' + encodeURIComponent(jobs.find(j => j.reference === 'WO-RF-2044').id));
const access = (await get('/knowledge-candidates?state=approved')).find(c => /harbor-access/.test(c.id));
const asset = live.assets[0];

// The report, trimmed to what the technician talks through: the service record and the owner's record go.
const keep = new Set(['findings', 'work', 'parts', 'added', 'addedLbs', 'addedUnit', 'recovered', 'recoveredLbs', 'recoveredUnit', 'handling', 'tests', 'outcome', 'followup']);
const definition = { ...live.reportForm, fields: live.reportForm.fields.filter(f => keep.has(f.key)) };
const swap = value => JSON.parse(JSON.stringify(value).split(finished.job.id).join(cooler).split('WO-RF-2044').join('WO-RF-2047'));
const full = swap(finished.latestReport.form.values);
// Shorter readings and handover than the demo's, so the report reads at a glance on the website.
full.tests = JSON.stringify({ status: 'recorded', notes: 'Standing vacuum rise and food temperature not measured.', rows: [
  { label: 'Leak check at the valve stem', value: 'No bubbles observed', unit: '', context: 'Nitrogen at 150 psig for 15 minutes', result: 'Pass' },
  { label: 'Vacuum before reopening', value: '450', unit: 'microns', context: 'Standing rise not measured', result: 'Recorded' },
  { label: 'Leak detector after restart', value: 'No indication', unit: '', context: 'Normal operating conditions', result: 'Pass' },
  { label: 'Cooler air temperature', value: '37', unit: '°F', context: 'After 30 minutes; food not probed', result: 'Recorded' },
] });
full.followup = 'Jamie Patel checks overnight temperature and the leak detector with Maya by 10:00 tomorrow.';
full.outcome = 'WC-01 back to 37°F air after 30 minutes. Maya informed.';
// After the first voice note: what Jamie said, with the amount, the tests and the handover still to come.
const values = stage => (stage >= 2 ? full : {
  ...Object.fromEntries(Object.entries(full).filter(([k]) => ['summary', 'findings', 'parts', 'added', 'recovered', 'recoveredLbs', 'recoveredUnit', 'addedUnit'].includes(k))),
  work: 'Pumped down into the appliance receiver and isolated the valve section. Adjusted the existing service-valve stem packing, pressure-tested the isolated section and evacuated it before reopening. No parts replaced.',
  handling: 'Pumped down into the appliance receiver; none recovered into an external cylinder. R-448A added; amount not given yet.',
  addedLbs: '', tests: '', outcome: '', followup: '',
});
function detail(stage) {
  const d = structuredClone(live);
  d.reportForm = definition;
  if (stage >= 1) {
    const report = swap(finished.latestReport);
    report.form = { definition, values: values(stage) };
    report.readings = stage < 2 ? [] : JSON.parse(full.tests).rows;
    if (stage < 3) Object.assign(report, { confirmedAt: null, confirmedBy: null });
    d.latestReport = report;
  }
  d.latestReceipt = stage >= 3 ? swap(finished.latestReceipt) : null;
  return d;
}

// What Kenner filed while Jamie talked: each note in the system that takes its kind.
const at = min => new Date(Date.parse('2026-11-08T21:47:00.000Z') + min * 60000).toISOString();
const fsm = { systemId: 'fsm', system: 'Service work orders', role: 'fsm', product: 'salesforce' };
const crm = { systemId: 'crm', system: 'Customer accounts', role: 'crm', product: 'salesforce' };
const note = (id, type, text, fields, record, kind, reference, quote, min) => {
  const site = type === 'hazard' || type === 'lead';
  return {
    id: 'note-' + id, text, type, fields, source: { by: 'sweep', messageId: null, quote, at: at(min) },
    written: [{ ...record, kind, reference, at: at(min) }],
    kept: { place: site ? 'site' : 'unit', siteId: asset.siteId, assetId: site ? null : asset.id },
    appliesTo: [{ kind: 'unit', id: asset.id, name: 'WC-01' }],
    from: { anchor: 'voice-' + (min < 4 ? 1 : 2), kind: 'voice_note', channel: 'whatsapp', text: quote, photoId: null, at: at(min) },
    createdAt: at(min), channel: 'whatsapp', author: 'kenner',
  };
};
const notes = [
  note('valve', 'equipment', 'Liquid-line service valve stem packing adjusted; existing valve and packing kept in service.', { location: 'Liquid-line service valve' }, fsm, 'Equipment update', 'EQ-WC01-0412', 'Fixed the leak at the liquid-line service valve stem packing.', 1),
  note('floor', 'hazard', 'Floor in front of the walk-in gets wet during pump-down. Barrier it and dry before handing back.', {}, crm, 'Site hazard', 'HZ-0087', 'Floor in front gets wet during pump-down, I’ve dried it.', 1),
  note('follow', 'follow_up', 'Check overnight temperature and the leak detector at the valve stem with Maya.', { due: 'Tomorrow, 10:00', reason: 'Confirm the repair holds overnight' }, fsm, 'Follow-up task', 'FU-2047-1', 'I’ll check in with Maya by 10 tomorrow.', 5),
  note('lead', 'lead', 'Maya wants a price for new door gaskets on WC-01.', { equipment: 'WC-01 door gaskets', interest: 'Replacement quote' }, crm, 'Lead', 'LD-0219', 'Maya also wants a price for new door gaskets.', 5),
];
const notesAt = stage => ({ materialSeq: stage * 4, knowledge: [], notes: stage >= 2 ? notes : stage >= 1 ? notes.slice(0, 2) : [] });
const used = stage => (stage >= 1 && access ? [{ id: access.id, title: access.title, state: 'approved', candidateVersion: access.version || 2, interactionId: null, createdAt: at(0) }] : []);
const learned = stage => (stage >= 3 ? [{ id: cooler + ':knowledge:stem-packing', title: 'Service-valve stem leak: adjust the packing and leak-test before replacing the valve', state: 'pending', version: 1 }] : []);

let stage = 0;
await page.route('**/api/v1/**', async route => {
  const key = new URL(route.request().url()).pathname.slice(7);
  const json = (data, more = {}) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data, ...more }) });
  if (route.request().method() !== 'GET') return json({});
  // The website's company runs its work orders and customer accounts on Salesforce, so both show its logo.
  if (key === '/session') {
    const session = await (await route.fetch()).json();
    session.data.systems = session.data.systems.map(s => (s.role === 'fsm' || s.role === 'crm' ? { ...s, product: 'salesforce' } : s));
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(session) });
  }
  if (key === `/jobs/${cooler}`) return json(detail(stage));
  if (key === `/jobs/${cooler}/notes`) return json(notesAt(stage));
  if (key === `/jobs/${cooler}/knowledge-used`) return json(used(stage), { nextCursor: null });
  if (key === `/jobs/${cooler}/knowledge-learned`) return json(learned(stage), { nextCursor: null });
  if (key === `/jobs/${cooler}/report-progress`) return json({ progress: null, latestVersion: stage >= 1 ? 1 : 0 });
  return route.continue();
});
// The page without the job's Overview and Conversation switch, which the website leaves out.
const main = () => page.evaluate(() => {
  const copy = document.querySelector('main').cloneNode(true);
  copy.querySelector('nav[data-tour="job-view"]')?.remove();
  return copy.outerHTML;
});
const toggles = 'main section[id^="job-"] h2 > button[aria-controls]';
// Each stage with every card open, then with every card folded, so the website can fold each one from its title.
const shots = [];
for (stage = 0; stage <= 3; stage++) {
  await page.goto(origin + '/kenner/?stage=' + stage + '#/jobs/' + cooler);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(2500);
  // Clicking a card's title changes which titles match, so each pass takes the first one left.
  const all = async state => {
    const left = page.locator(toggles + `[aria-expanded="${state}"]`);
    while (await left.count()) {
      await left.first().click();
      await page.waitForTimeout(700);
    }
  };
  await all('false');
  await page.waitForTimeout(1200);
  const open = await main();
  await all('true');
  // A folded card is its title row; its hidden body never shows, so only the open copy keeps one.
  const folded = await page.evaluate(() => [...document.querySelectorAll('main section[id^="job-"]')].map(card => {
    const copy = card.cloneNode(true);
    copy.querySelector('#' + card.id + '-body')?.replaceChildren();
    return copy.outerHTML;
  }).join(''));
  shots.push({ open, folded });
}
const css = await page.evaluate(() => [...document.styleSheets].map(s => s.href).filter(Boolean));
fs.writeFileSync(path.join(out, 'capture.json'), JSON.stringify({ origin, css, shots }, null, 1));
console.log('captured', shots.length, 'stages');
await browser.close();
