## Description
The GitHub Pages deployment workflow is failing when attempting to deploy for the first time because the `gh-pages` branch doesn't exist yet.

## Error Details
- **Workflow**: Deploy to GitHub Pages (`.github/workflows/deploy-gh-pages.yml`)
- **Job Run**: https://github.com/paialex/word-match/actions/runs/21100615998/job/60684258598
- **Error**: `fatal: not a git repository (or any of the parent directories): .git`

## Root Cause
The deployment process attempts to:
1. Clone the `gh-pages` branch (which doesn't exist on first deployment)
2. When cloning fails, it tries to run `git remote rm origin` and `git remote add origin` in a directory that isn't initialized as a git repository
3. This causes exit code 128 errors

## Error Log
```
fatal: Remote branch gh-pages not found in upstream origin
[INFO] first deployment, create new branch gh-pages
[INFO] The process '/usr/bin/git' failed with exit code 128
...
fatal: not a git repository (or any of the parent directories): .git
```

## Suggested Solution
The workflow needs to handle the case where the `gh-pages` branch doesn't exist by initializing a new git repository when cloning fails:

```yaml
- name: Deploy to GitHub Pages
  run: |
    set -e
    TARGET_DIR="/home/runner/actions_github_pages_1768682754883"
    REPO_URL="https://github.com/paialex/word-match.git"
    BRANCH="gh-pages"

    # Try to clone existing gh-pages branch, if it fails initialize new repo
    git clone --depth=1 --single-branch --branch $BRANCH $REPO_URL $TARGET_DIR || {
      mkdir -p $TARGET_DIR
      cd $TARGET_DIR
      git init
      git checkout -b $BRANCH
    }
    cd $TARGET_DIR
    # Continue with deployment steps...
```