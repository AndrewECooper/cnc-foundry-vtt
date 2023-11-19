# Castles & Crusades: The Role Playing Game

This readme outlines how to prepare the development environment, build and 
create a release for the Castles & Crusades FoundryVTT Game System.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

These instructions assume you have cloned the repository to your local machine.

### Prerequisites

You will need the following software installed to properly build and deploy the software:

* [Node.js v16+](https://nodejs.org/en) - Javascript Runtime
* [nvm](https://github.com/nvm-sh/nvm) - Node Version Manager (OPTIONAL)
* [Visual Studio Code](https://code.visualstudio.com/) - Programmer's Editor (OPTIONAL)
* [git-flow](https://github.com/petervanderdoes/gitflow-avh/wiki) - Git branching model used 


### Installing

After installing node.js (and (OPTIONALLY) nvm), install the Node.JS packages with the following commands:

```shell
npm i
```

This will prep the repo to run builds, link to the local foundry system, etc.

## Building

Running the following commands will build the software and update the `system.json` and `template.json` files.

```shell
# transpile the Typescript into javascript and place in the '/dist' 
# directory
npm run build
```

Several commands are available to run with `npm run <COMMAND>` where COMMAND is:

| Command | Description |
|---------|-------------|
| build | Transpile code & build `dist` directory |
| build:watch | Runs `build` automatically when changes to code are detected |
| build:ci | Build used in pipeline/deploy
| link:create | Create link to local FoundryVTT system |
| link:remove | Remove link to local FoundryVTT system |
| clean | Remove `/dist` build directory
| update-manifest | Updates links in the build `system.json` file based on version |
| check:lint | Uses eslint to lint the code |
| lint:fix | Runs lint and attempt to fix linting issues in code |
| prettier | Runs the prettier formatter on code |
| pretty-quick | Runs prettier on changed files |

## Connecting build to local FoundryVTT

The development environment has the capability of connecting to your local 
instance of FoundryVTT and pointing it to the `dist` directory you build by
running `npm run build`. You will first need to create a `foundryconfig.json` 
with the following contents:

```json
{
    "dataPath": "C:/Users/YOURUSERNAME/AppData/Local/FoundryVTT/"
}
```

You can also change this to a UNIX style path for MacOS X.

Running the following command will create a symlink to your FoundryVTT game
system for debugging in FoundryVTT:

```shell
npm run link:create
```

To remove the link, run the following:

```shell
npm run link:remove
```

## Running the tests

Unit tests and end-to-end tests are currently in the process of being added.

### And coding style tests

Coding style and linting can be done with the following commands:

```shell
# Run code formatting
npm run prettier
# Run code linting
npm run lint:fix
```

## Deployment

Deployment is kicked off after the system is fully tested to deploy a set of 
features or bugfixes. Deployment uses [git-flow](https://github.com/petervanderdoes/gitflow-avh/wiki) 
to create a release. The CI/CD pipeline only kicks off for a tagged Semver 
version (i.e. 1.0.0, 1.0.1, etc.) pushed to the repository. To create a release 
and deploy the system, use the following commands (for example version 1.0.2):

```shell
git flow release start 1.0.2
# update the package.json version using npm for x.y.z, use 'major' for x, 'minor'
# for y and 'patch' for z. For example to update 1.0.1 to 1.0.2:
npm version patch
# finish the release
git flow release finish 1.0.2
git push origin develop
git push origin main
git push --tags
```

You can watch the ci/cd pipeline [here](https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/pipelines).  
You can view releases [here](https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/releases).

After the CI/CD pipeline completes, be sure to update the `CHANGELOG.md` file with the current changes.

## Built With

* [Node JS](https://nodejs.org/en/) - Javascript runtime used
* [Visual Studio Code](https://code.visualstudio.com/) - Editor used
* [SemVer](https://semver.org/) - The versioning system used

## Contributing

Please read the Viking Sasquatch [development-standards](https://github.com/Viking-Sasquatch/development-standards) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://gitlab.com/troll-lord/foundry-vtt/ruleset/castles-and-crusades/-/tags). 

## Authors

* **Michael Pflugrad** - *Initial work* - [4d2gaming](https://gitlab.com/4d2gaming)
* **Ken Taylor** - *Initial work* - [KillerWabbit](https://gitlab.com/KillerWabbit)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

Copyright &copy; 2023 Troll Lord Games. All rights reserved.

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc