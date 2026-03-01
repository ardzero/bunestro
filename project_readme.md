[![?{project-name}](?{repo-link}/blob/main/public/ogImage.webp)](https://bunestro.ardastroid.com/)

# ?{porject-name}

An astro website built on top of the [bunestro](https://bunestro.ardastroid.com/) starter kit.

### Project Repo: [?{project-name}]([?{repo-link}])

## Running locally

> Requires `bun` or `nodejs` installed and up to date

Go to the `root` folder where `package.json` exists.

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

#### Command list

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun run dev`             | Starts local dev server at `localhost:4321`      |
| `bun run build`           | Build your production site to `./dist/`          |
| `bun run preview`         | Preview your build locally, before deploying     |
| `bun run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun run astro -- --help` | Get help using the Astro CLI                     |

> just replace `bun` with `npm` if you're using npm

## Tech Stack

- [Astro 5.2](https://astro.build/)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Shadcn](https://ui.shadcn.com/) components
- Tailwind CSS animations using [tailwindcss-motion](https://docs.rombo.co/tailwind)
- [Prettier](https://prettier.io/) for formating with [tailwind plugin](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) configure

## Config

- Data `src/lib/data/*`
- Metadata config `src/lib/data/siteData.ts`
- Types `src/types/*`

## Socials

- Website: [ardastroid.com](https://ardastroid.com)
- Email: [hello@ardastroid.com](mailto:hello@ardastroid.com)
- GitHub: [@ardzero](https://github.com/ardzero)

## License

MIT License

Copyright (c) 2026 Ard Astroid / Farhan Ashhab Nur

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
