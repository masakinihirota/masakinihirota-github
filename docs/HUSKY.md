# Git hooks with Husky

What I added:

- Husky dependency in `package.json` (devDependencies)
- `prepare` script to install husky during install: `pnpm run prepare` will set up hooks
- Hooks added in `.husky/`:
  - `pre-commit`: runs `pnpm run lint` and aborts commit on lint error
  - `pre-push`: runs `pnpm run build` and aborts push if build fails

Notes:
- Ensure you run `pnpm install` locally (or CI) so the `prepare` script runs and husky hooks are installed.
- You can customize these hooks further (e.g. run tests, lint-staged, or add Captcha checks) as needed.

Example local setup:
```pwsh
pnpm install
# husky will run 'prepare' automatically but ensure it's installed
pnpm run prepare
```
