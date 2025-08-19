# Releasing Pro Code (closed source)

This repo uses a closed source model for Pro folders (e.g., `/pro/**`).

// ...existing code...
- “Change Date” must be ISO `YYYY-MM-DD`.

## Set Change Date = 36 months from today

### macOS (with GNU coreutils) / Linux
```
NEW_DATE=$(date -u -d "+36 months" +"%Y-%m-%d" 2>/dev/null || gdate -u -d "+36 months" +"%Y-%m-%d")
// ...existing code...
```

### Cross-platform Node one-liner (use on CI too)
```
node -e "const d=new Date(); d.setMonth(d.getMonth()+36); console.log(d.toISOString().slice(0,10))"
```
