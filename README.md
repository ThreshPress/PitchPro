# Pitch Pro

A static web page. Players and logs stay in the browser.

## Publish on GitHub Pages

1. Push this repo to GitHub on the `main` branch.
2. In the repo, open **Settings → Pages → Build and deployment**.
3. Set **Source** to **GitHub Actions**.

The workflow in `.github/workflows/pages.yml` publishes the site on every push to `main`. The page will be:

`https://threshpress.github.io/PitchPro/`

Build the page locally with `npm run build:pages`. The files land in `dist-pages`.
