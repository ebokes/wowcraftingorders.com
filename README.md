## WoW Crafting Orders

This is the main repository for [wowcraftingorders.com](https://wowcraftingorders.com/).

### Contributing

If you'd like to contribute, please read the [contributing guidelines](CONTRIBUTING.md). Thanks for so much for helping
make this project a reality for the community!

### Tech Stack

- **Frontend** is in React, using Next.js and TypeScript. The frontend is in the `wowtrade` directory (for legacy
  reasons - it can be changed to a more sensible name soon).
- **Backend** is in Node.js, using Express and TypeScript running on Google Cloud Functions / Firebase Functions. This
  is all present in the `functions` directory.
- **Database** is Google Cloud Firestore.
- **Frontend CI/CD** is done through Vercel. Vercel automates the frontend deployment, publishing both the
  master branch and preview branches whenever you put a PR up.
- **Backend CI/CD** is done through GitHub Actions. These are the yaml files you'll find in the `.workflows` folder. The
  master branch is deployed, and PRs are also deployed, though
  this doesn't yet work in situations where multiple PRs are up - in that situation, the most recent one will just
  overwrite it.

### Database Schema

There's currently two tables - one for buyer listings (i.e. listings where someone's indicating an item they'd want to
buy) and one for seller listings (i.e. listings where someone's indicating an item they can craft).
The [TypeScript types
files](https://github.com/aacitelli/wowcraftingorders.com/blob/master/functions/src/types/types.ts) have the schema of
each of these. I also use the `ajv` library on the backend to validate
them ([link for the Buyer Listings one](https://github.com/aacitelli/wowcraftingorders.com/blob/master/functions/src/models/BuyerListingPayload.ts))
, which might give
you a better idea what exactly they look like.

