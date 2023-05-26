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
[1.0.0]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v1.0.0
[0.0.18]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v0.0.18
[0.0.17]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v0.0.17
[0.0.16]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v0.0.16
[0.0.12]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/v0.0.12
[0.0.11-beta-rc1]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/0.0.11-beta-rc1
[0.0.10-beta]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/0.0.10-beta
[0.0.9-beta]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/0.0.9-beta
[0.0.8-beta]: https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases/0.0.8-beta
