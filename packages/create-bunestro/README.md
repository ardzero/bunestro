[![Bunestro](https://bunestro.ardastroid.com/ogImage.webp)](https://bunestro.ardastroid.com/)

# @ardly/bunestro

A CLI tool to scaffold Astro projects with Tailwind CSS, React, Shadcn UI, and more pre-configured utilities.

## Quick Start

```bash
bunx @ardly/bunestro my-app
```

## CLI Usage

### Interactive Mode

Run without flags for a guided setup:

```bash
bunx @ardly/bunestro my-app
```

The CLI will ask you:

1. **Install dependencies?** (yes/no)
2. **Initialize git repository?** (yes/no)
3. **Open in editor?** (Cursor / VS Code / Skip)

### Quick Setup

```bash
# Use defaults (install deps, init git)
bunx @ardly/bunestro my-app -y

# Open in editor after creation
bunx @ardly/bunestro my-app --cursor
bunx @ardly/bunestro my-app --vscode

# Skip steps
bunx @ardly/bunestro my-app --no-install
bunx @ardly/bunestro my-app --no-git

# Combine options
bunx @ardly/bunestro my-app -y --cursor
```

### Available Flags

| Flag                         | Description                                                |
| :--------------------------- | :--------------------------------------------------------- |
| `-y`                         | Skip all prompts and use defaults (install deps, init git) |
| `--install` / `--no-install` | Install or skip installing dependencies                    |
| `--git` / `--no-git`         | Initialize or skip git repository                          |
| `--cursor`                   | Open project in Cursor after creation                      |
| `--vscode`                   | Open project in VS Code after creation                     |
| `-h, --help`                 | Show help message with examples                            |
| `-v, --version`              | Show version number                                        |

## CLI Features

- 🎨 **Beautiful UI** - Colored output with spinners and progress indicators
- 🚀 **Smart detection** - Auto-detects your package manager (bun, npm, pnpm, yarn)
- 💬 **Interactive prompts** - Guided setup with helpful questions
- ⚡ **Fast mode** - Use `-y` flag to skip all prompts
- 🛡️ **Graceful error handling** - Helpful error messages and recovery options
- 🌐 **Cross-platform** - Works on Windows, macOS, and Linux
- 🎯 **Editor integration** - Auto-open in Cursor or VS Code
- 📦 **Flexible** - Control every aspect with CLI flags

## Troubleshooting

### Network Issues

```bash
# Create without installing dependencies
bunx @ardly/bunestro my-app --no-install

# Then install manually later
cd my-app
bun install  # or npm install
```

### Git Issues

```bash
# Configure git if not already done
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Or skip git initialization
bunx @ardly/bunestro my-app --no-git
```

### Editor Not Opening

Make sure the CLI is installed:

- **VS Code**: Install "code" command via Command Palette → "Shell Command: Install 'code' command in PATH"
- **Cursor**: Install "cursor" command via Settings → Install CLI

## What's Included

The template comes with:

- **Astro 5** with React integration
- **Tailwind CSS** + **Shadcn UI** components
- **Tailwind Motion** for smooth animations
- **Theme support** (dark/light mode)
- **Custom utilities** - QR code gen, string shortener, image optimization, etc.
- **SEO optimized** with meta components
- **Prettier** configured with Tailwind plugin

For full template documentation, visit: [bunestro.ardastroid.com](https://bunestro.ardastroid.com/)

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
