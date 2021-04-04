# Changelog

## [0.4.1] - 2021-04-04

### Changed

- Dependabot and `npm audit fix` fixes

## [0.4.0] - 2020-08-22

### Added

- Full support on Windows with the VSCode shell as Windows CMD or Git Bash

## [0.3.0] - 2020-06-14

### Changed

- Changed implementation to avoid using command line utilities: `xargs, cut, code`. `fzf` output is now sent through named pipes and processed in the VSCode extension code. This avoids issues with having those utilities installed, having the wrong `code` on the path, and allows for implemeting arbitrary functionality beyond what the `code` command supports.

## [0.2.12] - 2020-05-26

### Added

- Added setting `fzf-quick-open.ripgrepSearchStyle` to modify the `rg` case matching behavior between case sensitive, ignore case, and smart case.

## [0.2.11] - 2020-05-25

### Changed

- Added setting `fzf-quick-open.fuzzyCmd` to allow using a fuzzy matcher other than `fzf`. E.g. skim (`sk`).

## [0.2.10] - 2020-05-24

### Changed

- `rg` search string is pre-filled based on selection/cursor postion as requested in #11.

## [0.2.0] - 2020-05-13

### Added

- Searching commands which search using fzf and ripgrep: `fzf-quick-open.runFzfSearch, fzf-quick-open.runFzfSearchPwd`

## [0.1.0] - 2020-04-30

### Added

- Windows support by using null-terminated strings from `fzf` and `xargs`. Thanks to [NgrNxk](https://github.com/NgrNxk) for the fix!

## [0.0.8] - 2020-04-16

### Added

- Setting `fzf-quick-open.codeCmd` to override the command used to launch `code`. Useful if you use `code-insiders`.

## [0.0.7] - 2020-04-06

### Changed

- Upgrade some package dependencies

## [0.0.6] - 2020-02-09

### Added

- New commands which always use active document `pwd` on every invocation:
  - `fzf: Open file in PWD using fzf`
  - `fzf: Add workspace folder from PWD using fzf`

## [0.0.3] - 2020-01-18

### Added

- Initial release with `open file` and `add workspace folder functionality`
