# Development Notes

## Current Status
**Last Updated:** 2024-11-17

### In Progress
- [ ] Version 1.0.4 Release
    - Status: In development
    - Blockers: None
    - PR: #57, #62, #59, #63, #64, #65

### Quick Notes
- To debug handlebars templates: `<!--  {{log "CONTEXT!!!!"}} {{log this}}-->`
- Need refactor of folders, etc.

### Known Issues
- [X] Level box appends the class when changed
    - Workaround: Ignore for now
    - Ticket: #84
- [ ] Spell damage roll not working
    - Workaround: Roll manually in chat
    - Ticket: #84

## Setup
```bash
# Critical environment setup
npm run install
npm run build
npm link:create
npm run build:watch
```

## Links
- Gitlab Issues: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/issues 


---
*Keep daily notes above this line, archive below when needed*