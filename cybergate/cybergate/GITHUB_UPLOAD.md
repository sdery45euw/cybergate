# Upload CyberGate to GitHub

From the project root (`cybergate/`):

```bash
# 1. Initialize git
git init
git add .
git commit -m "feat: initial CyberGate – VLESS Gateway + Cyberpunk Dashboard"

# 2. Create a new empty repo on github.com (do NOT add README/license)
#    e.g. https://github.com/yourname/cybergate

# 3. Push
git branch -M main
git remote add origin https://github.com/yourname/cybergate.git
git push -u origin main
```

That's it. Railway can now import from GitHub.

### Updating
```bash
git add .
git commit -m "update: ..."
git push
```

Railway auto-deploys.
