# Pitch Pro: phone installation

This is an installable web app project, not yet a published app.

## Publish
1. Deploy the project to a hosting platform that supports TanStack Start / Nitro and server-side routes. Configure server runtime, secrets and persistence according to the platform requirements.
2. Run `npm ci`, `npm run typecheck`, `npm test`, `npm run build` and verify login, progress saves, manifest and icons on the deployed HTTPS URL.
3. Open `/manifest.webmanifest`, `/icon-192.png`, `/icon-512.png` at the live URL.
4. For iPhone, open the live HTTPS URL in Safari → Share → Add to Home Screen → Add.
5. For Android, open in Chrome → menu → Add to home screen or Install app.

## Notes
- Installing does not create cloud sync or offline-first functionality; network connectivity may be needed.
- This project stores sensitive player information locally; do not use real children's personal information until privacy, consent, authorization, backups and secure hosting are implemented.
- The app is not currently on the App Store or Google Play.
- `public/` contains the original design converted into a mobile app icon.
