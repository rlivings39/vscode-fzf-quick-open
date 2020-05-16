[![Build Status](https://travis-ci.com/rlivings39/vscode-fzf-quick-open.svg?branch=master)](https://travis-ci.com/rlivings39/vscode-fzf-quick-open)
[![Marketplace](https://vsmarketplacebadge.apphb.com/version-short/rlivings39.fzf-quick-open.svg)](https://marketplace.visualstudio.com/items?itemName=rlivings39.fzf-quick-open)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/rlivings39.fzf-quick-open.svg)](https://marketplace.visualstudio.com/items?itemName=rlivings39.fzf-quick-open)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/rlivings39.fzf-quick-open.svg)](https://marketplace.visualstudio.com/items?itemName=rlivings39.fzf-quick-open&ssr=false#review-details)

# Basic integration of fzf into vscode to open files and folders
Any time that vscode requires interaction with the OS file dialog, the workflow can become much less efficient. This comes up when opening files outside of your workspace folders or adding a workspace folder. This extension solves that by providing these actions using [fzf](https://github.com/junegunn/fzf).

Works on *nix, Mac, and Windows using Git Bash as your shell in VSCode. The extension relies on calling `xargs` and `cut` in the terminal window.

# Usage
Provides the commands:

* `fzf: Open file using fzf` opens a terminal in which you can choose a file
* `fzf: Add workspace folder using fzf` to add a workspace folder
* `fzf: Search using rg and fzf` to search using `fzf` and `ripgrep`

On terminal launch, the `pwd` is chosen based on the active editor file. Also adds

* `fzf: Open file in PWD using fzf`
* `fzf: Add workspace folder from PWD using fzf`
* `fzf: Search in PWD using rg and fzf`

which are the same as above but switches to parent directory of active file on every invocation.

Bind the commands to keyboard shortcuts to launch faster.

Change the setting `fzf-quick-open.initialWorkingDirectory` to override the initial working directory used for the fzf terminal. Change `fzf-quick-open.findDirectoriesCmd` to change the command used to find directories. Something like `fd --type d` is very fast if you use [fd](https://github.com/sharkdp/fd).

# Setup

1. [Install fzf](https://github.com/junegunn/fzf)
1. [Install ripgrep](https://github.com/BurntSushi/ripgrep)
1. For best performance you should set up `fzf` to use the amazingly fast [fd](https://github.com/sharkdp/fd)

    **`~/.config/fish/config.fish`**

    ```bash
    set -x FZF_DEFAULT_COMMAND 'fd'
    ```

    **`~/.bashrc`**

    ```bash
    export FZF_DEFAULT_COMMAND='fd'
    ```

1. Configure the setting `fzf-quick-open.findDirectoriesCmd` to use `fd`: `fd --type d`

# Examples
**Open file**
![](resources/fzfVscodeOpenFile.gif)

**Open workspace folder**
![](resources/fzfVscodeOpenFolder.gif)