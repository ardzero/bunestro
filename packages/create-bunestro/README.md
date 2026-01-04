[![Bunestro](https://bunestro.ardastroid.com/ogImage.webp)](https://bunestro.ardastroid.com/)

# Bunestro

An Astro app with Tailwind CSS, React, Shadcn, and Tailwind-motion setup along with built-in utilities. [Live deployment](https://bunestro.ardastroid.com/)
Repo: [Github Repo](https://github.com/ardzero/bunestro)

## Getting Started

Create a new project using:

```bash
bunx @ardly/bunestro my-app
```

### CLI Options

The CLI provides several options for customizing your setup:

```bash
# Interactive mode (recommended for first-time users)
bunx @ardly/bunestro my-app

# Quick setup with defaults (-y flag: auto-install deps, init git)
bunx @ardly/bunestro my-app -y

# Open in your favorite editor after creation
bunx @ardly/bunestro my-app --cursor
bunx @ardly/bunestro my-app --vscode

# Skip dependency installation
bunx @ardly/bunestro my-app --no-install

# Skip git initialization
bunx @ardly/bunestro my-app --no-git

# Combine options
bunx @ardly/bunestro my-app -y --cursor
```

#### Available Flags

| Flag                         | Description                                                |
| :--------------------------- | :--------------------------------------------------------- |
| `-y`                         | Skip all prompts and use defaults (install deps, init git) |
| `--install` / `--no-install` | Install or skip installing dependencies                    |
| `--git` / `--no-git`         | Initialize or skip git repository                          |
| `--cursor`                   | Open project in Cursor after creation                      |
| `--vscode`                   | Open project in VS Code after creation                     |
| `-h, --help`                 | Show help message with examples                            |
| `-v, --version`              | Show version number                                        |

### Interactive Prompts

When you run the CLI without flags, it will interactively ask you:

1. **Project name** (if not provided)
2. **Install dependencies?** (yes/no)
3. **Initialize git repository?** (yes/no)
4. **Open in editor?** (Cursor / VS Code / Skip)

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

### Template Features

- **Astro 5** - Latest version with cutting-edge features
- **Tailwind CSS** - Utility-first CSS framework
- **React Integration** - Full React support with Astro
- **[Shadcn UI](https://ui.shadcn.com/)** - Beautiful, accessible components
- **Custom utility components** - Pre-built components for common use cases
- **Theme support** - Dark and light mode out of the box
- **[Tailwind Motion](https://docs.rombo.co/tailwind)** - Smooth CSS animations
- **SEO optimized** - SEO component included
- **[Prettier](https://prettier.io/)** - Code formatting with Tailwind plugin
- **Responsive images** - Optimized image loader component
- **Share modal** - Social sharing functionality
- **Utilities** - QR code gen, string shortener, unique code gen, image placeholder, email validation, hashing, etc.

### CLI Features

- 🎨 **Beautiful UI** - Colored output with spinners and progress indicators
- 🚀 **Smart detection** - Auto-detects your package manager (bun, npm, pnpm, yarn)
- 💬 **Interactive prompts** - Guided setup with helpful questions
- ⚡ **Fast mode** - Use `-y` flag to skip all prompts
- 🛡️ **Graceful error handling** - Helpful error messages and recovery options
- 🌐 **Cross-platform** - Works on Windows, macOS, and Linux
- 🎯 **Editor integration** - Auto-open in Cursor or VS Code
- 📦 **Flexible** - Control every aspect with CLI flags

## Config

- Configure colors in `src/styles/globals.css`
- Base styles (scrollbar style, selection highlighting etc) in `src/styles/customGlobals.css`
- Site default metadata in `astro.config.mjs`
- Component configurations in `src/lib/data/siteData.ts`
- Astro configurations in `astro.config.mjs`

## Troubleshooting

### Network Issues

If you encounter network errors during installation:

```bash
# Create without installing dependencies
bunx @ardly/bunestro my-app --no-install

# Then install manually later
cd my-app
bun install  # or npm install
```

### Git Issues

If git initialization fails:

```bash
# Configure git if not already done
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Or skip git initialization
bunx @ardly/bunestro my-app --no-git
```

### Editor Not Opening

If `--cursor` or `--vscode` doesn't work, make sure the CLI is installed:

- **VS Code**: Install "code" command via Command Palette → "Shell Command: Install 'code' command in PATH"
- **Cursor**: Install "cursor" command via Settings → Install CLI

## Roadmap

- [x] Add theme support
- [x] Add basic Shadcn components
- [x] Add sample responsive components
- [x] Professional CLI with interactive prompts
- [x] Smart package manager detection
- [x] Graceful error handling
- [ ] Add more documentation
- [ ] Add state management examples
- [ ] Add template variants (minimal, full-featured, etc.)

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
