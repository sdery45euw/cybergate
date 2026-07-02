# Upload CyberGate to GitHub

**IMPORTANT: Push the files in this folder – NOT a parent folder containing a `cybergate/` subfolder.**

Your GitHub repo root MUST look like this:
```
backend/
dashboard/
docker-compose.yml
README.md
...
```
NOT like this:
```
cybergate/
  backend/
  dashboard/
```

**If you downloaded this as `cybergate.zip`, unzip it, `cd` INTO the cybergate folder, then run git commands there.**

---

From the project root (the folder containing `backend/` and `dashboard/`):

```bash
# 1. Initialize git HERE
pwd
# should show .../cybergate  NOT .../
# ls should show backend dashboard README.md  – NOT a single cybergate/ folder

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

### Fixing a wrong upload (nested cybergate/cybergate)
If your GitHub repo shows a single `cybergate/` folder at the root:
```bash
# clone your repo, move files up
git clone https://github.com/yourname/cybergate.git tmp
cd tmp
git mv cybergate/* .
git mv cybergate/.* . 2>/dev/null || true
rmdir cybergate
git commit -am "fix: flatten repo root for Railway"
git push
```

### Updating
```bash
git add .
git commit -m "update: ..."
git push
```

Railway auto-deploys.
