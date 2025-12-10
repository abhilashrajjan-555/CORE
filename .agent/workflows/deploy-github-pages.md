---
description: Deploy C.O.R.E. Workflow to GitHub Pages
---

# Deploy to GitHub Pages

Follow these steps to deploy your C.O.R.E. Workflow application to GitHub Pages:

## Prerequisites
- You need a GitHub account
- Git should be configured with your credentials

## Deployment Steps

### 1. Create a new repository on GitHub
- Go to https://github.com/new
- Repository name: `core-workflow` (or your preferred name)
- Description: "Personal productivity system using C.O.R.E. methodology"
- Choose **Public** (required for free GitHub Pages)
- **DO NOT** initialize with README, .gitignore, or license (we already have these)
- Click "Create repository"

### 2. Link your local repository to GitHub
Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/core-workflow.git
```

// turbo
### 3. Verify the remote was added
```bash
git remote -v
```

// turbo
### 4. Push your code to GitHub
```bash
git push -u origin main
```

### 5. Enable GitHub Pages
- Go to your repository on GitHub
- Click on **Settings** tab
- Scroll down to **Pages** section (in the left sidebar under "Code and automation")
- Under "Source", select **Deploy from a branch**
- Under "Branch", select **main** and **/ (root)**
- Click **Save**

### 6. Wait for deployment
- GitHub will build and deploy your site (usually takes 1-2 minutes)
- Refresh the Pages settings page to see the deployment status
- Once deployed, you'll see: "Your site is live at https://YOUR_USERNAME.github.io/core-workflow/"

### 7. Visit your live site
Your C.O.R.E. Workflow application will be available at:
```
https://YOUR_USERNAME.github.io/core-workflow/
```

## Updating Your Site

After making changes to your application:

// turbo-all
```bash
# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "Update: describe your changes here"

# Push to GitHub
git push origin main
```

GitHub Pages will automatically rebuild and deploy your updated site within 1-2 minutes.

## Troubleshooting

### Site not loading?
- Make sure the repository is **Public**
- Check that GitHub Pages is enabled in Settings → Pages
- Wait a few minutes for the initial deployment
- Check the Actions tab for any build errors

### Changes not appearing?
- Clear your browser cache (Cmd+Shift+R on Mac)
- Wait 1-2 minutes for GitHub to rebuild
- Check that your changes were pushed: `git log --oneline`

### Custom domain (optional)
If you want to use a custom domain:
- Add a `CNAME` file to your repository root with your domain
- Configure DNS settings with your domain provider
- Update the custom domain in GitHub Pages settings

## Notes
- All data is stored in browser LocalStorage (client-side only)
- No server-side processing required
- Works completely offline after first load
- Free hosting with GitHub Pages
