## run-in-parallel [![npm][npm-image]][npm-url]

Simple utility to run multiple commands in parallel.

### Install
```bash
npm install --save-dev run-in-parallel
```

```bash
yarn install -D run-in-parallel
```

### Usage

Command line:
```bash
run-in-parallel \"comand1 arg1\" \"comand2 arg1 arg2\"
```
will start `comand1` and `comand2` with arguments in parallel and will wait for both to finish.
If any of the commands fail, the whole process will fail. You will see the output of both commands in the console.
Also, you can use `run-in-parallel` in `package.json` scripts:

```json
{
  "scripts": {
    "build": "run-in-parallel \"tsc --noEmit\" \"vite build\""
  }
}
```

This is one of the real use cases when you need to run `tsc --noEmit` and `vite build` together. 
Vite suggests this solution `tsc --noEmit && vite build`, but it runs sequentially and takes more time than if it were run in parallel.
This problem can be solved by using this script.

result of `npm run build`
```bash
> run-in-parallel "tsc --noEmit" "vite build"
node build.mjs "tsc --noEmit" "vite build"

Start: tsc --noEmit
Start: vite build
vite: vite v5.1.0 building for production...

vite: transforming...

✓ tsc: executed successfully!
vite: ✓ 34 modules transformed.

vite: rendering chunks...

vite: computing gzip size...

vite: dist/index.html                   0.46 kB │ gzip:  0.30 kB

vite: dist/assets/react-h3aPdYU7.svg    4.13 kB │ gzip:  2.14 kB
dist/assets/index-4sK4E3Wk.css    1.39 kB │ gzip:  0.72 kB
dist/assets/index-YnIXOLyF.js   143.39 kB │ gzip: 46.11 kB

vite: ✓ built in 509ms

✓ vite: executed successfully!
✅ All commands executed successfully!
```

[npm-image]: https://img.shields.io/npm/v/run-in-parallel.svg
[npm-url]: https://npmjs.org/package/run-in-parallel
