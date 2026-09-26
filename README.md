# Kenner website (draft)

Static site: one `index.html` plus `img/`, `logos/`, `audio/`. No build step, no backend, no dependencies beyond Google Fonts.

## Run locally
    python3 -m http.server 8765
    # open http://localhost:8765

## Deploy
Any static host works (Vercel, Netlify, Cloudflare Pages, S3 + CloudFront). Upload the folder as is; `index.html` is the entry point.
Example with Vercel: `vercel deploy --prod` from this folder.

## Before going public
- Hero videos are compressed (about 0.4-0.7 MB each, 1600px, H.264).
- Booking links point to https://calendar.app.google/nbvqe8x4o7QsxCVu5 (5 places in index.html).
- Add analytics / cookie banner if needed (none included).
- Favicon included; social preview image (og:image) not included yet.
- Page is private-draft content: see the claims checklist below.

## Claims to confirm before launch (content, not code)
- Security: ISO 27001 and SOC 2 marked "Pending" / "in preparation"; GDPR claim.
- FSM names (Salesforce, SAP FSM, ServiceNow, Dynamics 365, IFS, ServiceTitan) imply live integrations.
- Channels: WhatsApp business calling limits in the US; Telegram has no business-initiated calls.
- "Built by people from" logos (Palantir, Bayer, EnBW, Imperial, ESCP, Y Combinator): need confirmation / permission.
- All customer names, work orders, figures and people in the demo and desktop views are invented example data.
- Images and hero videos are AI-generated (Higgsfield); demo voices are AI-generated (OpenAI).

## Structure
- index.html: all markup, CSS and JS inline
- img/: hero videos + posters, industry photos, textures
- logos/: team logos
- audio/: demo call audio (way / unit / leave)
