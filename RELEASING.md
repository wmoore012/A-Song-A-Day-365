# Releasing Pro Code under BSL (auto-stamped Change Date)

This repo uses Business Source License 1.1 (BSL 1.1) for closed folders (e.g., `/pro/**`). On the Change Date, the code automatically converts to the Change License (Apache-2.0 here).

- License file lives at: `licenses/PRO-LICENSE.BSL`
- “Change Date” must be ISO `YYYY-MM-DD`.

## Set Change Date = 36 months from today

### macOS (with GNU coreutils) / Linux
```
NEW_DATE=$(date -u -d "+36 months" +"%Y-%m-%d" 2>/dev/null || gdate -u -d "+36 months" +"%Y-%m-%d")
sed -i.bak -E "s/^(Change Date:\s*).*/\1${NEW_DATE}/" licenses/PRO-LICENSE.BSL && rm -f licenses/PRO-LICENSE.BSL.bak
git add licenses/PRO-LICENSE.BSL
git commit -m "chore(license): set BSL Change Date to ${NEW_DATE}"
```

### Cross-platform Node one-liner (use on CI too)
```
node -e "const d=new Date(); d.setMonth(d.getMonth()+36); console.log(d.toISOString().slice(0,10))"
```
