# Pro (BSL 1.1)

This folder contains proprietary features licensed under Business Source License 1.1.

- License file: ../licenses/PRO-LICENSE.BSL
- Change Date: see license file. On/after that date, the contents convert to Apache-2.0.

Guidelines
- Do not commit secrets. Keep keys in Netlify/GitHub Actions or other secret managers.
- Keep clear boundaries: public APIs and open adapters live in the open core.
- Tests for pro code can live alongside, but avoid leaking internal assets.
