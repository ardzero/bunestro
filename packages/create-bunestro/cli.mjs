#!/usr/bin/env node
import { execa } from "execa";
import prompts from "prompts";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import kleur from "kleur";
import ora from "ora";
import { existsSync } from "fs";
import { resolve } from "path";

const REPO_URL = "https://github.com/ardzero/bunestro.git";

// Parse CLI arguments
const argv = yargs(hideBin(process.argv))
	.usage("Usage: $0 [project-name] [options]")
	.example("$0 my-app", "Create a new project with interactive prompts")
	.example("$0 my-app -y", "Create with all defaults (install deps, init git)")
	.example(
		"$0 my-app --cursor --git",
		"Create and open in Cursor with git initialized",
	)
	.example("$0 my-app --no-install", "Create without installing dependencies")
	.option("y", {
		type: "boolean",
		description: "Skip all prompts and use defaults (install deps, init git)",
		default: false,
	})
	.option("git", {
		type: "boolean",
		description: "Initialize git repository",
		default: undefined,
	})
	.option("install", {
		type: "boolean",
		description: "Install dependencies",
		default: undefined,
	})
	.option("cursor", {
		type: "boolean",
		description: "Open project in Cursor after creation",
	})
	.option("vscode", {
		type: "boolean",
		description: "Open project in VS Code after creation",
	})
	.alias("h", "help")
	.alias("v", "version")
	.epilogue("For more information, visit: https://github.com/ardzero/bunestro")
	.parse();

async function main() {
	console.log(kleur.bold().cyan("\n🚀 Create Bunestro App\n"));

	let projectName = argv._[0];

	// Prompt for project name if not provided
	if (!projectName) {
		const response = await prompts({
			type: "text",
			name: "projectName",
			message: "What is your project named?",
			initial: "my-bunestro-app",
			validate: (value) => {
				if (!value) return "Project name is required";
				if (!/^[a-z0-9-]+$/.test(value)) {
					return "Project name must contain only lowercase letters, numbers, and hyphens";
				}
				if (existsSync(resolve(process.cwd(), value))) {
					return `Directory "${value}" already exists`;
				}
				return true;
			},
		});

		if (!response.projectName) {
			console.log(kleur.red("\n✖ Operation cancelled"));
			process.exit(0);
		}

		projectName = response.projectName;
	}

	// Validate project name
	if (!/^[a-z0-9-]+$/.test(projectName)) {
		console.error(
			kleur.red(
				"✖ Project name must contain only lowercase letters, numbers, and hyphens",
			),
		);
		process.exit(1);
	}

	if (existsSync(resolve(process.cwd(), projectName))) {
		console.error(kleur.red(`✖ Directory "${projectName}" already exists`));
		process.exit(1);
	}

	// Clone template
	const cloneSpinner = ora("Cloning template...").start();
	try {
		await execa("git", ["clone", "--depth", "1", REPO_URL, projectName]);
		cloneSpinner.succeed(kleur.green("Template cloned"));
	} catch (error) {
		cloneSpinner.fail(kleur.red("Failed to clone template"));

		// Provide helpful error messages based on error type
		if (
			error.message.includes("Could not resolve host") ||
			error.message.includes("unable to access") ||
			error.message.includes("Failed to connect")
		) {
			console.error(kleur.yellow("\n⚠ Network error: Unable to reach GitHub"));
			console.error(
				kleur.dim("Please check your internet connection and try again."),
			);
		} else if (error.message.includes("Repository not found")) {
			console.error(kleur.yellow("\n⚠ Repository not found"));
			console.error(
				kleur.dim(`The template repository at ${REPO_URL} could not be found.`),
			);
		} else if (error.message.includes("already exists")) {
			console.error(
				kleur.yellow(`\n⚠ Directory "${projectName}" already exists`),
			);
			console.error(
				kleur.dim(
					"Please choose a different project name or remove the existing directory.",
				),
			);
		} else {
			console.error(kleur.red("\n✖ Error details:"));
			console.error(kleur.dim(error.message));
		}

		process.exit(1);
	}

	// Remove .git directory and CLI-related folders
	const cleanSpinner = ora("Cleaning up...").start();
	try {
		const isWindows = process.platform === "win32";

		// Remove .git directory
		if (isWindows) {
			await execa("cmd", ["/c", "rmdir", "/s", "/q", `${projectName}\\.git`], {
				shell: true,
			});
		} else {
			await execa("rm", ["-rf", `${projectName}/.git`], { shell: true });
		}

		// Remove CLI-related folders if they exist
		const foldersToRemove = [
			"create-bunestro",
			"packages",
			".github/workflows", // Optional: remove CI/CD workflows
		];

		for (const folder of foldersToRemove) {
			const folderPath = resolve(process.cwd(), projectName, folder);
			if (existsSync(folderPath)) {
				if (isWindows) {
					await execa("cmd", ["/c", "rmdir", "/s", "/q", folderPath], {
						shell: true,
					});
				} else {
					await execa("rm", ["-rf", folderPath], { shell: true });
				}
			}
		}

		cleanSpinner.succeed(kleur.green("Cleaned up"));
	} catch (error) {
		cleanSpinner.fail(kleur.red("Failed to clean up"));
		console.error(kleur.yellow("\n⚠ Could not remove some directories"));
		console.error(kleur.dim("You can manually delete them later."));
		// Don't exit - this is not critical
	}

	// Detect package manager
	const packageManager = detectPackageManager();
	console.log(
		kleur.dim(`\nDetected package manager: ${kleur.bold(packageManager)}`),
	);

	// Install dependencies
	let shouldInstall = argv.install;

	if (argv.y) {
		shouldInstall = true;
	} else if (shouldInstall === undefined) {
		const installResponse = await prompts({
			type: "confirm",
			name: "install",
			message: "Install dependencies?",
			initial: true,
		});
		shouldInstall = installResponse.install;
	}

	if (shouldInstall) {
		const installSpinner = ora("Installing dependencies...").start();
		try {
			await execa(packageManager, ["install"], {
				cwd: resolve(process.cwd(), projectName),
				stdio: "pipe",
			});
			installSpinner.succeed(kleur.green("Dependencies installed"));
		} catch (error) {
			installSpinner.fail(kleur.red("Failed to install dependencies"));

			if (
				error.message.includes("ENOTFOUND") ||
				error.message.includes("network") ||
				error.message.includes("timeout")
			) {
				console.error(kleur.yellow("\n⚠ Network error during installation"));
				console.error(
					kleur.dim(`You can install dependencies later by running:`),
				);
				console.error(
					kleur.dim(`  cd ${projectName} && ${packageManager} install`),
				);
			} else if (
				error.message.includes("EACCES") ||
				error.message.includes("permission denied")
			) {
				console.error(kleur.yellow("\n⚠ Permission error"));
				console.error(
					kleur.dim("Try running the command with appropriate permissions."),
				);
			} else {
				console.error(kleur.red("\n✖ Installation error:"));
				console.error(kleur.dim(error.message));
				console.error(kleur.dim(`\nYou can try installing manually:`));
				console.error(
					kleur.dim(`  cd ${projectName} && ${packageManager} install`),
				);
			}

			// Ask if user wants to continue anyway
			const continueResponse = await prompts({
				type: "confirm",
				name: "continue",
				message: "Continue without installing dependencies?",
				initial: true,
			});

			if (!continueResponse.continue) {
				process.exit(1);
			}

			shouldInstall = false; // Update flag for success message
		}
	}

	// Git initialization
	let shouldInitGit = argv.git;

	if (argv.y) {
		shouldInitGit = true;
	} else if (shouldInitGit === undefined) {
		const gitResponse = await prompts({
			type: "confirm",
			name: "git",
			message: "Initialize a new git repository?",
			initial: true,
		});
		shouldInitGit = gitResponse.git;
	}

	if (shouldInitGit) {
		const gitSpinner = ora("Initializing git repository...").start();
		try {
			await execa("git", ["init"], {
				cwd: resolve(process.cwd(), projectName),
			});
			await execa("git", ["add", "."], {
				cwd: resolve(process.cwd(), projectName),
			});
			await execa("git", ["commit", "-m", "Initial commit"], {
				cwd: resolve(process.cwd(), projectName),
			});
			gitSpinner.succeed(kleur.green("Git repository initialized"));
		} catch (error) {
			gitSpinner.warn(kleur.yellow("Git initialization skipped"));

			if (
				error.message.includes("not found") ||
				error.message.includes("command not found")
			) {
				console.error(kleur.dim("Git is not installed or not in PATH."));
			} else if (
				error.message.includes("user.name") ||
				error.message.includes("user.email")
			) {
				console.error(kleur.dim("Git user configuration is missing."));
				console.error(
					kleur.dim('Run: git config --global user.name "Your Name"'),
				);
				console.error(
					kleur.dim('     git config --global user.email "you@example.com"'),
				);
			}
			// Continue anyway - git init is optional
		}
	}

	// Open in editor
	let editorChoice = null;

	if (argv.cursor) {
		editorChoice = "cursor";
	} else if (argv.vscode) {
		editorChoice = "vscode";
	} else if (!argv.y) {
		const editorResponse = await prompts({
			type: "select",
			name: "editor",
			message: "Open project in editor?",
			choices: [
				{ title: "Cursor", value: "cursor" },
				{ title: "VS Code", value: "vscode" },
				{ title: "Skip", value: "skip" },
			],
			initial: 0,
		});
		editorChoice = editorResponse.editor;
	}

	if (editorChoice && editorChoice !== "skip") {
		const editor = editorChoice === "vscode" ? "code" : "cursor";
		const editorName = editorChoice === "vscode" ? "VS Code" : "Cursor";

		try {
			await execa(editor, ["."], {
				cwd: resolve(process.cwd(), projectName),
			});
			console.log(kleur.green(`\n✓ Opened in ${editorName}`));
		} catch (error) {
			console.log(kleur.yellow(`\n⚠ Could not open ${editorName}`));

			if (
				error.message.includes("not found") ||
				error.message.includes("command not found")
			) {
				console.log(
					kleur.dim(`${editorName} CLI is not installed or not in PATH.`),
				);
				console.log(
					kleur.dim(`You can open the project manually: cd ${projectName}`),
				);
			}
		}
	}

	// Success message
	console.log(kleur.bold().green("\n✓ All done! 🎉\n"));
	console.log(kleur.bold("Next steps:"));
	console.log(kleur.dim(`  cd ${projectName}`));
	if (!shouldInstall) {
		console.log(kleur.dim(`  ${packageManager} install`));
	}
	console.log(kleur.dim(`  ${packageManager} run dev`));
	console.log();
}

function detectPackageManager() {
	// Check if Bun is available and being used
	if (typeof Bun !== "undefined") return "bun";
	if (process.env.npm_execpath?.includes("bun")) return "bun";
	if (process.argv[1]?.includes("bunx")) return "bun";

	// Check for other package managers
	if (process.env.npm_execpath?.includes("pnpm")) return "pnpm";
	if (process.env.npm_execpath?.includes("yarn")) return "yarn";

	return "npm";
}

main().catch((error) => {
	console.error(kleur.red("\n✖ An unexpected error occurred:"));

	if (error.isCanceled) {
		console.log(kleur.yellow("\n⚠ Operation cancelled by user"));
		process.exit(0);
	}

	console.error(kleur.dim(error.message || error));
	console.error(kleur.dim("\nIf this issue persists, please report it at:"));
	console.error(kleur.dim("https://github.com/ardzero/bunestro/issues"));
	process.exit(1);
});
