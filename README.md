# AIM1 project "NiteOut"

A personal request:

Those who are familiar with [Gitflow](http://nvie.com/posts/a-successful-git-branching-model/), please use it. A short introduction to all the others:

* When developing anything, create a branch called `feature/<choose a name>` by branching from `develop` (e.g. `git checkout develop` to make sure you are on the `develop` branch, then `git checkout -b feature/<choose a name>` to create the new branch).

* When you are done and your code is working, merge this branch into `develop`.

* Never commit to or merge into `master`. Whenever I find a stable state on `develop` I will release this to `master`.

There are tools that help, e.g. [gitflow](https://github.com/nvie/gitflow) for CLI enthusiasts and [SourceTree](https://www.sourcetreeapp.com/) for users of Windows or Mac.

Even if this looks complicated in the beginning, I hope it will save us time in the end. I think we can not afford to lose time hunting bugs, so a little discipline might help us to catch them early.

- Niels
