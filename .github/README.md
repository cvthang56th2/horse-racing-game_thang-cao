# GitHub Actions Workflows

This project uses GitHub Actions for continuous integration, deployment, and automation. Below is an overview of all configured workflows:

## Workflows

### 1. CI (`ci.yml`)
**Triggered on:** Push to main/develop, Pull requests to main/develop

**Jobs:**
- **Lint and Format Check**: Runs ESLint and Prettier formatting checks
- **TypeScript Type Check**: Validates TypeScript types
- **Unit Tests**: Runs Vitest unit tests
- **Build**: Builds the application and uploads artifacts
- **E2E Tests**: Runs Playwright end-to-end tests
- **Matrix Testing**: Tests across multiple Node.js versions (20, 22)

### 2. Deploy (`deploy.yml`)
**Triggered on:** Push to main, Manual dispatch

**Purpose:** Deploys the application to GitHub Pages
- Runs full test suite before deployment
- Builds the application with production settings
- Deploys to GitHub Pages environment

**Setup Required:**
1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Ensure proper base path configuration in `vite.config.ts`

### 3. Release (`release.yml`)
**Triggered on:** Git tags matching `v*.*.*` pattern

**Purpose:** Creates GitHub releases with built artifacts
- Runs full test suite
- Creates compressed archives (tar.gz and zip)
- Attaches build artifacts to release

**Usage:** Create a tag like `v1.0.0` to trigger a release

### 4. Security (`security.yml`)
**Triggered on:** Push, Pull requests, Weekly schedule

**Jobs:**
- **Security Audit**: Runs npm audit for vulnerabilities
- **Dependency Review**: Reviews dependencies in PRs
- **CodeQL Analysis**: Static code analysis for security issues

### 5. Dependency Updates (`dependency-updates.yml`)
**Triggered on:** Weekly schedule (Mondays), Manual dispatch

**Purpose:** Automatically updates dependencies and creates PRs
- Updates all dependencies to latest versions
- Runs tests to ensure compatibility
- Creates pull request with changes

### 6. Performance (`performance.yml`)
**Triggered on:** Push to main, Pull requests to main

**Jobs:**
- **Bundle Analysis**: Analyzes and reports bundle sizes
- **Lighthouse CI**: Runs performance audits

## Environment Variables

### For GitHub Pages Deployment
- `NODE_ENV=production`: Enables production build optimizations
- `GITHUB_PAGES=true`: Configures proper base path for GitHub Pages

### Repository Settings Required

1. **GitHub Pages:**
   - Go to Settings → Pages
   - Set Source to "GitHub Actions"

2. **Security (Optional):**
   - Enable Dependabot alerts
   - Enable secret scanning
   - Enable code scanning

3. **Branch Protection (Recommended):**
   - Require status checks to pass
   - Require branches to be up to date
   - Require review from code owners

## Secrets

Most workflows use the default `GITHUB_TOKEN` which is automatically provided. No additional secrets are required for basic functionality.

## Customization

### Adding New Environments
To deploy to additional environments (staging, preview, etc.), duplicate the deploy workflow and modify:
- Trigger conditions
- Environment name
- Build configuration
- Deployment target

### Modifying Test Requirements
Edit the CI workflow to add or remove test steps:
- Add new test commands in the appropriate jobs
- Modify the `needs` dependencies between jobs
- Add new matrix configurations for different environments

### Performance Thresholds
Update the performance workflow to set custom bundle size limits or Lighthouse score thresholds.

## Monitoring

- Check the Actions tab in your repository for workflow runs
- Failed workflows will show up as red X marks
- Successful deployments will be visible in the Environments section
- Performance reports are uploaded as artifacts

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check that all dependencies are properly listed in package.json
   - Ensure TypeScript compilation passes locally
   - Verify all tests pass locally

2. **Deployment Issues:**
   - Check that GitHub Pages is enabled
   - Verify the base path configuration in vite.config.ts
   - Ensure the workflow has proper permissions

3. **Test Failures:**
   - E2E tests may fail in CI due to timing issues
   - Check Playwright configuration for CI-specific settings
   - Verify test data and mocks are properly set up

### Getting Help

- Check workflow logs in the Actions tab
- Review the specific job that failed
- Look for error messages in the step outputs
- Compare with successful runs to identify changes
