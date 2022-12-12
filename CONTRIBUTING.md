# Contributing

You can do a few things to contribute:

1. **Create issues.** Create issues for bugs you find or features you'd like to see. Please follow the issues guidelines
   found below. You can propose just about anything through an issue.
2. **Create pull requests.** Assign yourself to an issue you're working on and create a pull request when you're done.
   Please follow the pull request guidelines found below.
3. Be part of the discussion in the Discord: https://discord.gg/WYJa6uCbSd

## Onboarding

If you plan to contribute to this project, please send Kal#0963 a ping on Discord with a brief overview of your
development background (not required, just something I'd like to know) as well as your GitHub username to get read-only
access to a few things:

- **GitHub.** I'll add you as a collaborator to the repo, which will allow you to create branches and pull requests
  without needing to fork. I have the CODEOWNERS file and permissions set up such that a review from me is still
  necessary to
  merge in - I'm also happy to add more people as the project matures and I develop a sense for who would make a good
  fit.
- **Firebase.** This can be useful for logs, database entries, and so on.
- **Vercel.** This is our Continuous Deployment solution, and can be useful for diagnosing build failures and details
  regarding the deployment workflow.

## Issues Guidelines

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
- **Good First Issue:** Label as `good first issue` if this is something that is relatively small in scope and is
  approachable for someone without really needing to understand how the entire app comes together.

## Pull Request Process

Pull requests should be branched from `master` and merged back into `master`. `master` has protection rules set up such
that a pull request with passing status checks is mandatory.

Pull requests require at least one approval from someone with write access to the repo. This group will potentially
expand to include anyone that makes significant contributions to the project, but for now is just the main developer.