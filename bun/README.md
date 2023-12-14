# redditscraper

To install dependencies:

```bash
bun add fs puppeteer
```
There is currently a bug in puppeteer where the testing version of Chrome is not available. This can be remedied with 
the following snippet:

```bash
node node_modules/puppeteer/install.js
```
this forces puppeteer to run the post-install script. 
This is only necessary if you receive the `Could not find Chrome version (119.xx.xxxxxx)` error

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.16. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
