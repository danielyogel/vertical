# ~~ Abstract ~~

## Objectives

1. Declerative Ui description (full-stack planned)
2. Auto parent child relationship - parent aggregates children data, children auto-pass parent data.
3. Audo bindings of nodes by key.
4. Cross concern auto deps - for example disabled when loading
5. Statically typed API.
6. Statically typed data.
7. 100% cusomizable - prefer composability over inheritence and/or big config.
8. Dependecy Injection

## Commands

TSDX scaffolds your new library inside `/src`, and also sets up a [Parcel-based](https://parceljs.org) playground for it inside `/example`.

The recommended workflow is to run TSDX in one terminal:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run either Storybook or the example playground:

### Storybook

Run inside another terminal:

```bash
yarn storybook
```

This loads the stories from `./stories`.

> NOTE: Stories should reference the components as if using the library, similar to the example playground. This means importing from the root project directory. This has been aliased in the tsconfig and the storybook webpack config as a helper.
