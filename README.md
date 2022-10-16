# Castles & Crusades for FoundryVTT

This game system for [Foundry Virtual Tabletop](http://foundryvtt.com) provides character sheet and game system support for the Castles and Crusades roleplaying game by [Troll Lord Games](https://trolllord.com/).

This system provides character sheet support for Actors and Items, mechanical support for dice and rules necessary to play games of Castles and Crusades using the SEIGE Engine.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

* [FoundryVTT](http://foundryvtt.com) (v10+)
* [Node.js](https://nodejs.org/en/) (v16+)
* [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (latest version)
* A programmers editor/IDE

### Installing

To install the project on windows, you will need to locate your FoundryVTT `data/systems` folder. This is typically `C:\Users\[USER]\AppData\Local\FoundryVTT\Data\systems\`

_Note: replace [USER] with your login name!_

Launch powershell or cmd and execute the following commands:

```powershell
# Change directory to the Foundry system data folder
PS C:\Users\[USER]> cd AppData\Local\FoundryVTT\Data\systems\
# Clone the Castles and Crusades FoundryVTT repo
PS C:\Users\[USER]\AppData\Local\FoundryVTT\Data\systems> git clone git@gitlab.com:troll-lord/foundry-vtt/ruleset/castles-and-crusades.git
```

After the repository is cloned, install the development dependencies

```powershell
# Change directory into the newly cloned repo
PS C:\Users\[USER]\AppData\Local\FoundryVTT\Data\systems> cd castles-and-crusades
# Install the node js dependencies
PS C:\Users\[USER]\AppData\Local\FoundryVTT\Data\systems\castles-and-crusades> npm i
```

The development environment is now installed.

## Running the tests

### Coding style tests

To lint the code, run the following from within the `castles-and-crusades` folder:

```powershell
npm run lint
# or to fix linting issues: 
npm run lint:fix
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## License

All software components are licensed under the MIT license - see _LICENSE.txt_ for details.

### Copyright Notices

* Open Game License v 1.0 Copyright 2000, Wizards of the Coast, Inc.
* System Reference Document Copyright 2000-2003, Wizards of the Coast, Inc.; Authors Jonathan Tweet, Monte Cook, Skip Williams, Rich Baker, Andy Collins, David Noonan, Rich Redman, Bruce R. Cordell, John D. Rateliff, Thomas Reid, James Wyatt, based on original material by E. Gary Gygax and Dave Arneson.
* Castles & Crusades: Players Handbook, Copyright 2004, Troll Lord Games; Authors Davis Chenault and Mac Golden.
* Castles & Crusades: Monsters Product Support, Copyright 2005, Troll Lord Games.
* The Basic Fantasy Field Guide Copyright © 2010 Chris Gonnerman and Contributors.
* Basic Fantasy Role-Playing Game Copyright © 2006-2015 Chris Gonnerman.
* Boilerplate System Copyright © 2020 Asacolips Projects / Foundry Mods.
* Basic Fantasy RPG for FoundryVTT © 2022 Steve Simenic.
