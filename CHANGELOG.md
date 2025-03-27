# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/)

<!--
## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

### Known Issues
-->
## [Unreleased]

## [1.0.5] - 2025-03-27

### Changed
- Update monster template sheet. Fixes #102 [@KillerWabbit]
- Split out status effects [@KillerWabbit]
- Update monster saves label [@KillerWabbit]
- Update changelog, template, localization and labels in sheets [@KillerWabbit]
- Comment out migration removing elements until later [@KillerWabbit]
- Monster Actors - Remove Resources and add Sanity (!102) [@KillerWabbit]

### Fixed
- Fix potential problem areas in spell and weapon sheets [@KillerWabbit]
- Fix typo in monster sheet. Fixes #98 [@KillerWabbit]

## [1.0.4] - 2024-11-26

### Bug Fixes

- Spell damage button not working on spell page (!87) [@KillerWabbit]
- Edit spell not showing localized labels (!86) [@KillerWabbit]
- Level box appends comma and class when changed (!84) [@KillerWabbit]

### New Features

- Change background box on character sheet to diety (!65) [@KillerWabbit]
- Resize wealth boxes and add field for custom items (!64) [@KillerWabbit]
- Add weight field in description section (!63) [@KillerWabbit]

### Other Changes

- Fix newly created spell item always drags into level 0 even if level is set (!97) [@KillerWabbit]
- Check attack, damage and save rolls (!96) [@KillerWabbit]
- Remove all status effects except dead and unconscious (!95) [@KillerWabbit]
- Change Alignment to Disposition (!94) [@KillerWabbit]
- Remove 'Hit Points' roll on monster sheet (!93) [@KillerWabbit]
- Change 'HD Size' to 'Level' on monster sheet (!92) [@KillerWabbit]
- Add level bonus to monster to hit roll on monster sheet (!91) [@KillerWabbit]
- 1.04 pre-release fixes (!90) [@KillerWabbit]
- Update System to FoundryVTT v12 compatibility (!62) [@KillerWabbit]

## [1.0.3] - 2024-06-28

### Changed

- Update System to FoundryVTT v12 compatibility (#62) by @KillerWabbit

## [1.0.2] - 2023-12-19

### Changed

- Implemented fix proposed by @javiercanadillas for Issue #57 Character sheet doesn't add STR or DEX modifier on attack or damage rolls by @4d2gaming
- Attack rolls now add the correct math d20+ BTH + AbilityMOD + Weapon Bonus by @4d2gaming


## [1.0.1] - 2023-05-29

### Changed

- Removed maximum compatibility version to allow verifying against future Foundry versions (#56) by @KillerWabbit


## [1.0.0] - 2023-05-27

### Changed

- First public release on FoundryVTT installer

## [0.0.18] - 2023-05-23

### Added

- Terser minification of production code to make download size smaller (#54) by **@KillerWabbit**.
- New [contribution guide](https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/blob/main/CONTRIBUTING.md) for developers by **@KillerWabbit**.
- New [code of conduct](https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/blob/main/CODE_OF_CONDUCT.md) for contributors by **@KillerWabbit**.

### Changed

- Reformatted changelog to better match [Keep a Changelog](http://keepachangelog.com/).

### Removed

- Releases from changelog that had no significant changes.

## [0.0.17] - 2023-05-22

### Fixed

- Updated monster sheet to properly display hitpoints and hitdice when closing and reopening sheet from a token by  by **@KillerWabbit**.

## [0.0.16] - 2023-05-22

### Added

- Typescript compilation by **@KillerWabbit**.
- Converted _.mjs_ files to typescript to reduce type mismatch issues and improve organization of code by **@KillerWabbit**.

## [0.0.12] - 2023-05-17

### Added

- Storage of previous version in [package registry](https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/packages) by **@KillerWabbit**. 
- Auto creation of [releases](https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases) in gitlab by **@KillerWabbit**. 
- Linting of code to maintain common formatting by **@KillerWabbit**.
- Ability to connect dev environment to local Foundry instance with `npm run link:create` by **@KillerWabbit**. 

### Changed

- Moved source code to `/src` folder to prevent unneeded development code from
- Restructured code and build infrastructure to reduce download size and ease development (#53) by **@KillerWabbit**.
- Updated gitlab build scripts to [automate release process](https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/pipelines) on new version branch tag  by **@KillerWabbit**. 

## [0.0.11-beta-rc1] - 2023-03-02

### Changed

- Created release candidate 1.

## [0.0.9-beta] - 2023-02-24

### Added

- Spanish language (i18n) [translations](https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/commit/ee03b5a57ea5269ad8adfe2bcf3ed20750ad0719) by **@Elfonochasis**.
- All TinyMCE fields are automatically enriched (able to drop links to other items etc.) by **@pwatson100**.

### Changed
- Updated Copyright notice (TLG) by **@42datasquirrels**.

### Fixed 

- Cleaned up Foundry V10 warning messages by changing .data. references to .system. references by **@pwatson100**.
- Creating a Spell as an Item and dragging it onto an actor sheet causes errors and breaks the actor sheet (#47) by **@pwatson100**.

## [0.0.8-beta] - 2022-12-20

### Added

- Embedded the TLG icon pack for global use.
- Established a font folder for future use.

### Changed

- Swapped the Author to TLG for branding.

### Fixed 

- Disable XP calculation. Revert to simple data field (FBB-18).
- When creating a weapon, there is a field for size. C&C does not have size as a weapon attribute. Dropped from item-detail-sheet (FBB-17).
- Fixed hover over AC with Helmet misspelled (FBB-16).
- Corrected how item AC is displayed.

[unreleased]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/compare/main...develop?from_project_id=36291450&straight=false
[1.0.5]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v1.0.5
[1.0.4]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v1.0.4
[1.0.3]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v1.0.3
[1.0.2]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v1.0.2
[1.0.1]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v1.0.1
[1.0.0]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v1.0.0
[0.0.18]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v0.0.18
[0.0.17]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v0.0.17
[0.0.16]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v0.0.16
[0.0.12]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v0.0.12
[0.0.11-beta-rc1]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/0.0.11-beta-rc1
[0.0.10-beta]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/0.0.10-beta
[0.0.9-beta]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/0.0.9-beta
[0.0.8-beta]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/0.0.8-beta
