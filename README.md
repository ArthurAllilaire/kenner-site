# kenner.work

Static site served by GitHub Pages from `main` (custom domain in `CNAME`, keep that file). No build step, no backend, no cookies or analytics; fonts load from Google Fonts.

## Run locally
    python3 -m http.server 8765
    # open http://localhost:8765

## Structure
- `index.html`: the homepage, all markup, CSS and JS inline
- `legal.html`: imprint and privacy policy (`#imprint`, `#privacy`)
- `brand/`: logo lockups, mark and Kenner's profile picture
- `photos/`: industry photos
- `media/`, `demo/`, `light/`: chat media, demo app screenshots and light backgrounds
- `logos/`: integration and team logos
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`

## Notes
- Booking links point to https://calendar.app.google/fFpCL3WG3pJtqtC89 (kenner.work Google Workspace).
- `legal.html` must change whenever the site adds tracking, a form, new hosting or new service providers.
- Customer names, work orders and figures in the chats and demo screenshots are example data. Photos are AI-generated (Higgsfield).
