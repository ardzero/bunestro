[![Bunestro](https://bunestro.ardastroid.com/ogImage.webp)](https://bunestro.ardastroid.com/)

# Bunestro

An Astro app with Tailwind CSS, React, Shadcn, and Tailwind-motion setup along with built-in utilities. [Live deployment](https://bunestro.ardastroid.com/)
Repo: [Github Repo](https://github.com/ardzero/bunestro)

## Getting Started

Create a new project using:

```bash
bunx @ardly/bunestro project-name
```

You can specify `-vs` or `--cursor` flags to auto open the project in VSCode or Cursor respectively after installation.

## Usage (run locally)

> Requires `bun` or `nodejs` installed and up to date

Go to the `root` folder where `package.json` exists.

> skip this if you're using the bunx @ardly/bunestro project-name command, it auto installs the deps

```bash
# Using bun
bun install

# Using npm
npm install
```

### Then

```bash
# or
bun run dev

# Using npm
npm run dev
```

> bun is not officially supported by astro, so if you ran into any problems, try using `npm` to see if it works before creating an github issue.

#### Command list

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun run dev`             | Starts local dev server at `localhost:4321`      |
| `bun run build`           | Build your production site to `./dist/`          |
| `bun run preview`         | Preview your build locally, before deploying     |
| `bun run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun run astro -- --help` | Get help using the Astro CLI                     |

> just replace `bun` with `npm` if you're using npm

## Features

- Astro 5.2
- Tailwind CSS v4
- React Integration
- [Shadcn](https://ui.shadcn.com/) components
- Custom utility components
- Theme support (dark and light mode)
- Tailwind CSS animations using [tailwindcss-motion](https://docs.rombo.co/tailwind)
- SEO optimized (SEO component provided)
- Responsive optimized img loader component
- Share modal
- Utilities like `qrCode gen, string shortner, uniqueCode gen, img placeholder, email validation, hashing etc`

## Config

- Configure colors in `src/styles/globals.css`
- Site default metadata in `astro.config.mjs`
- Component configurations in `src/lib/data/siteData.ts`
- Astro configurations in `astro.config.mjs`

## Roadmap

- [x] Add theme support
- [x] Add basic Shadcn components
- [x] Add static img optimization component
- [ ] Add sample responsive components
- [ ] Add more documentation
- [ ] Add state management examples

## Socials

- Website: [ardastroid.com](https://ardastroid.com)
- Email: [hello@ardastroid.com](mailto:hello@ardastroid.com)
- GitHub: [@ardzero](https://github.com/ardzero)

## License

MIT License

Copyright (c) 2024 Ard Astroid / Farhan Ashhab Nur

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
