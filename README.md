# Coming of Age With Gun Violence

> My stunning Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## Initial setup up for gh-pages worktree branch

```

Checkout

$ git checkout --orphan gh-pages
$ git reset --hard
$ git commit --allow-empty -m "Init"
$ git checkout master

Make your worktree to your deploy folder

$ rm -rf _site
$ git worktree add _site gh-pages

```

## Deploy

```
First time
git clone --single-branch --branch gh-pages git@github.com:youthradio/PROJECTNAME.git

Update

git fetch 
git reset --hard FETCH_HEAD
git clean -df 

```

