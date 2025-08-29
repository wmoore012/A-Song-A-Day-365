# Releasing Perday Music 365

## Licensing Model

This repository uses a dual-licensing approach:

- **Core Application**: GPL-3.0 (open source) - Everything in `perday-music/src/**` and root level files
- **Pro Features**: Proprietary (closed source) - Everything in `/pro/**` folders

## Core Application (GPL-3.0)

The main application code is licensed under GPL-3.0, which means:
- ✅ Free to use, modify, and distribute
- ✅ Must share source code when distributing
- ✅ Derivative works must also be GPL-3.0
- ✅ Commercial use allowed with GPL-3.0 compliance

## Pro Features (Proprietary)

Pro features in `/pro/**` folders are proprietary and closed source:
- ❌ Not included in GPL-3.0 license
- ❌ Source code not shared
- ❌ Commercial licensing required for use
- ✅ Excluded from git via .gitignore

## Release Process

1. **Core Application**: Tag releases with semantic versioning (v1.0.0, v1.1.0, etc.)
2. **Pro Features**: Released separately under proprietary license
3. **Documentation**: Update README.md with current licensing information

## Version Management

- Use semantic versioning for core application
- Pro features have separate versioning scheme
- Keep licensing information current in all documentation
