# Regression Explorer

An interactive, browser-based regression lab for learning how regression models fit data. Built with Vite, React, TypeScript, Plotly.js, KaTeX, Tailwind CSS, and a Web Worker. All fitting runs locally in your browser; there is no backend.

## Screenshots

The live preview attached to this project shows the Playground layout. Recommended captures for a deployed release: the fit chart, Explain model tab, and residual diagnostics panel.

## Features in this release

- Responsive dark/light UI, data presets, numeric CSV import, add/remove observations.
- OLS, polynomial regression, Ridge, Lasso, and Elastic Net model plug-ins.
- Educational Gaussian-elimination solver, closed-form OLS/Ridge, and coordinate descent for L1/Elastic Net.
- Live fit curve, R², RMSE, MAE, AIC, residual overview, model explanations, and Python scikit-learn code export.
- Fitting in a Web Worker, GitHub Pages workflow, and Vitest algorithm tests.

This is the first runnable milestone, not a claim that every model in the long-term roadmap is already implemented. The architecture is deliberately plug-in based for adding the remaining model families and diagnostics without pretending they are implemented.

## Local setup

Requires Node.js 20+ (22 recommended) and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To run tests and create a production build:

```bash
npm test
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create a GitHub repository named `regression-explorer` (or change the base path setting below).
2. Push this folder to the repository's `main` branch.
3. In **Settings → Pages**, choose **GitHub Actions** as the build and deployment source.
4. The included `.github/workflows/deploy.yml` installs dependencies, runs tests, builds, and deploys on each push to `main`.
5. For a project repository, the workflow sets `VITE_BASE_PATH=/<repository-name>/` automatically. If you build locally for a differently named repository, run `VITE_BASE_PATH=/your-repo-name/ npm run build`.

## Project structure

```text
src/app/              Application state hooks
src/components/       Chart and UI components
src/data/             Dataset generators and presets
src/engine/           Web Worker and numerical utilities
src/export/            Reproducible Python code generation
src/models/types.ts   Shared plug-in contracts
src/models/registry.ts Model metadata and explainers
src/models/linear/    Solvers and least-squares implementations
src/styles.css        Responsive application styling
 tests/               Vitest algorithm validation
.github/workflows/    GitHub Pages CI/CD
```

## Add a new regression model

1. Add its ID and parameter/result types in `src/models/types.ts`.
2. Implement a pure fitting function in a family folder under `src/models/`. Return coefficients, predictions, residuals, metrics, and a curve.
3. Register the model's name, family, equation, intuition, assumptions, pros, cons, and defaults in `src/models/registry.ts`.
4. Route its ID to the fitting function in `src/engine/regression.worker.ts` (or replace the worker dispatch with a family registry as the model collection grows).
5. Add a focused test with a known synthetic dataset under `tests/` and validate numerical tolerances.
6. If needed, add model-specific controls and explain what the hyperparameters mean.

## Numerical notes

- OLS solves the normal equations with partial-pivot Gaussian elimination for teaching clarity. QR/SVD are preferable for production numerical stability.
- Ridge adds an L2 penalty to non-intercept coefficients.
- Lasso and Elastic Net use coordinate descent with soft thresholding; predictor standardization is a recommended next enhancement for datasets with differently scaled features.
- Classical standard errors, p-values, confidence intervals, GLM inference, Bayesian posterior inference, and nonlinear algorithms are not included in this initial milestone. Do not use this teaching demo as a substitute for a statistical package in high-stakes analysis.
