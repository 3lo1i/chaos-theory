#!/bin/sh
npx webpack --config webpack.config.js
git subtree push --prefix dist origin gh-pages
