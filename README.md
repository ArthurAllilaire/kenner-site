# getkenner.com

Static site served by GitHub Pages from `main` (custom domain in `CNAME`, keep that file). No build step, no backend, no cookies or analytics; fonts load from Google Fonts.

## Run locally
    python3 -m http.server 8765
    # open http://localhost:8765

## Structure
- `index.html`: the homepage; markup, CSS and most of the JS inline
- `legal.html`: imprint and privacy policy (`#imprint`, `#privacy`)
- `agents/`: styles and script of the "Watch Kenner work" demo (troubleshooting and reporting agents)
- `pr/`: what that demo shows: the work order page (`pr/app/`), manual pages and logos
- `img/`: hero and closing photos, founder portraits
- `brand/`: logo lockups, mark and Kenner's profile picture
- `logos/`, `mono/`: integration, channel and team logos, in colour and in one colour
- `light/`: light backgrounds
- `photos/`, `media/`, `demo/`: from the previous homepage, not used by the current one
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og-image.jpg` (link preview, 1200x630, still the previous headline)

## Notes
- Booking links point to https://calendar.app.google/fFpCL3WG3pJtqtC89 (existing Google Workspace booking page).
- `legal.html` must change whenever the site adds tracking, a form, new hosting or new service providers.
- Customer names, work orders and figures in the chats and demo screenshots are example data. Photos are AI-generated (Higgsfield).
