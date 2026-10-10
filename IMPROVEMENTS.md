# PitchPath improvements

## Implemented
- A bounded 28-day recorded touch shortfall backlog, carried forward to eligible training sessions when weekly workload capacity is available.
- Excess touches do not reduce subsequent training targets.
- Missed periodic check-ins no longer silently lower the training baseline.
- Logged touch credit is proportional and capped; zero gives zero.
- Players can log whether planned drills were completed; incomplete work reduces the estimated training credit.
- Editing a day's recorded touches retains that day's original target.
- Clip upload now clearly identifies the guided parent/coach checklist rather than claiming automatic video analysis.

## Not production-ready yet
- The existing skill scores and elite benchmarks are *illustrative*, not empirically validated or benchmarked against elite U18 players; elite readiness cannot be inferred from touch counts.
- Short clips are stored locally on the same device; there is no real computer-vision model, server upload or coach validation.
- Player profiles are stored client-side and are not a secured, synced family/coach account service.
- Unlogged sessions are pending rather than assumed missed; the backlog counts recorded shortfalls only.
- Training workload must be verified with sports-science specialists, and injury/pain, rest and club workload should override catch-up.
- Add authentication, consent/parent controls, secure cloud storage, privacy policy, deletion controls, encryption, rate limits, age-appropriate safeguarding and end-to-end tests before launching.
- npm dependency installation and build could not be completed in the current environment.

## Local development
Run `npm ci`, `npm run typecheck`, `npm test`, then `npm run dev`.
