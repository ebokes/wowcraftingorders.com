# Contributing

You can do a few things to contribute:

1. **Create issues.** Create issues for bugs you find or features you'd like to see. Please follow the issues guidelines
   found below.
2. **Create pull requests.** Assign yourself to an issue you're working on and create a pull request when you're done.
   Please follow the pull request guidelines found below.

## Onboarding

If you plan to contribute to this project, please send Kal#0963 a ping on Discord with a brief overview of your
development background (not mandatory) to get read-only access to a few important tools:

- **Firebase.** This can be useful for logs, database entries, and so on.
- **Vercel.** This is our Continuous Deployment solution, and can be useful for diagnosing build failures and details
  regarding the deployment workflow.

## Issues Guidelines

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Guidelines for labeling issues:

- **Main Types:** Label as a `bug` if it's incorrect behavior, `enhancement` if it's a new feature or a new system,
  and `documentation` if it's requesting a writeup on something.
- **Priority:** The following priority labels exist:
    - `priority-critical` should be used for anything that's actively breaking up commonly used site behavior.
    - `priority-high` should be used for anything that's actively breaking uncommonly used site behavior, or for
      particularly desired features.
    - `priority-medium` should be used for anything that's not actively breaking anything, but has a decent amount of
      demand.
    - `priority-low` should be used for smaller features or enhancements that are a quality of life
      improvement.

## Pull Request Process

Pull requests should be branched from `master` and merged back into `master`. `master` has protection rules set up such
that a pull request with passing status checks is mandatory.

Pull requests require at least one approval from someone with write access to the repo. This group will potentially
expand to include anyone that makes significant contributions to the project, but for now is just the main developer.