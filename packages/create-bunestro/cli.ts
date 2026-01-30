#!/usr/bin/env node
import { execa } from "execa";
import * as p from "@clack/prompts";
import color from "picocolors";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { existsSync, readFileSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const REPO_URL = "https://github.com/ardzero/bunestro.git";

// Get package version
function getVersion(): string {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const packageJsonPath = join(__dirname, "../package.json");
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
        return packageJson.version;
    } catch {
        return "0.1.0";
    }
}

interface CliArguments {
    _: (string | number)[];
    y: boolean;
    git?: boolean;
    install?: boolean;
    cursor?: boolean;
    vscode?: boolean;
    h?: boolean;
    v?: boolean;
}

type PackageManager = "bun" | "pnpm" | "yarn" | "npm";
type EditorChoice = "cursor" | "vscode" | "skip" | null;

function validateProjectName(name: string): string | undefined {
    if (!name) return "Project name is required";
    if (name === ".") return; // Allow current directory
    if (!/^\.\/[a-zA-Z0-9-]+$/.test(name) && !/^[a-zA-Z0-9-]+$/.test(name)) {
        return "Project name must contain only letters, numbers, and hyphens";
    }
    const dirName = name.startsWith("./") ? name.slice(2) : name;
    if (existsSync(resolve(process.cwd(), dirName))) {
        return `Directory "${dirName}" already exists`;
    }
}

async function promptForProjectName(): Promise<string> {
    const response = await p.text({
        message: "Where should we create your new project?",
        placeholder: "./subsequent-star",
        validate: validateProjectName,
    });

    if (p.isCancel(response)) {
        p.cancel("Operation cancelled");
        process.exit(0);
    }

    return response as string;
}

function showHelp(): void {
    console.clear();
    p.intro(color.bgCyan(color.black(" create-bunestro ")));

    console.log(color.bold("\nUsage:"));
    console.log(`  ${color.cyan("bun create bunestro")} ${color.dim("[project-name] [options]")}`);

    p.note(
        `${color.cyan("bun create bunestro my-app")}\n  Create a new project with interactive prompts\n\n` +
        `${color.cyan("bun create bunestro my-app -y")}\n  Create with all defaults (install deps, init git)\n\n` +
        `${color.cyan("bun create bunestro my-app --cursor --git")}\n  Create and open in Cursor with git initialized\n\n` +
        `${color.cyan("bun create bunestro my-app --no-install")}\n  Create without installing dependencies`,
        "Examples"
    );

    console.log(color.bold("\nOptions:"));
    console.log(`  ${color.cyan("-y, --yes")}              Skip all prompts and use defaults`);
    console.log(`  ${color.cyan("--git")}                  Initialize git repository`);
    console.log(`  ${color.cyan("--no-git")}               Skip git initialization`);
    console.log(`  ${color.cyan("--install")}              Install dependencies`);
    console.log(`  ${color.cyan("--no-install")}           Skip dependency installation`);
    console.log(`  ${color.cyan("--cursor")}               Open project in Cursor after creation`);
    console.log(`  ${color.cyan("--vscode")}               Open project in VS Code after creation`);
    console.log(`  ${color.cyan("-h, --help")}             Show this help message`);
    console.log(`  ${color.cyan("-v, --version")}          Show version number`);

    p.outro(`For more info: ${color.underline(color.cyan("https://github.com/ardzero/bunestro"))}`);
}

// Parse CLI arguments
const argv = yargs(hideBin(process.argv))
    .help(false)
    .version(false)
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
    .option("h", {
        alias: "help",
        type: "boolean",
        description: "Show help",
    })
    .option("v", {
        alias: "version",
        type: "boolean",
        description: "Show version",
    })
    .parse() as CliArguments;

// Handle help flag
if (argv.h) {
    showHelp();
    process.exit(0);
}

// Handle version flag
if (argv.v) {
    console.clear();
    p.intro(color.bgCyan(color.black(" create-bunestro ")));
    console.log(`\n  ${color.bold("Version:")} ${color.cyan(getVersion())}`);
    p.outro(color.dim("https://github.com/ardzero/bunestro"));
    process.exit(0);
}

async function main(): Promise<void> {
    console.clear();

    p.intro(color.bgCyan(color.black(" create-bunestro ")));

    let projectName: string = argv._[0] as string | undefined || "";
    let useCurrentDir = false;

    // Prompt for project name if not provided or if provided name already exists
    if (!projectName) {
        projectName = await promptForProjectName();
    } else {
        // Validate provided project name
        projectName = projectName.startsWith("./") ? projectName.slice(2) : projectName;

        const validationError = validateProjectName(projectName);
        if (validationError) {
            p.log.error(validationError);
            projectName = await promptForProjectName();
        }
    }

    // Handle current directory
    if (projectName === ".") {
        useCurrentDir = true;

        // Check if current directory is empty
        const { readdirSync } = await import("fs");
        const files = readdirSync(process.cwd());
        const visibleFiles = files.filter(file => !file.startsWith('.'));

        if (visibleFiles.length > 0) {
            p.cancel("Current directory is not empty. Please use an empty directory or specify a new project name.");
            process.exit(1);
        }
    } else {
        // Strip ./ prefix if present (in case it wasn't stripped earlier)
        if (projectName.startsWith("./")) {
            projectName = projectName.slice(2);
        }

        // Final validation
        const validationError = validateProjectName(projectName);
        if (validationError) {
            p.cancel(validationError);
            process.exit(1);
        }
    }

    // Clone template
    const s = p.spinner();
    s.start("Cloning template");
    const tempDir = useCurrentDir ? ".bunestro-temp" : projectName;
    try {
        await execa("git", ["clone", "--depth", "1", REPO_URL, tempDir]);
        s.stop("Template cloned");
    } catch (error: any) {
        s.stop("Failed to clone template");

        // Provide helpful error messages based on error type
        if (
            error.message.includes("Could not resolve host") ||
            error.message.includes("unable to access") ||
            error.message.includes("Failed to connect")
        ) {
            p.log.error("Network error: Unable to reach GitHub");
            p.log.info("Please check your internet connection and try again.");
        } else if (error.message.includes("Repository not found")) {
            p.log.error("Repository not found");
            p.log.info(`The template repository at ${REPO_URL} could not be found.`);
        } else if (error.message.includes("already exists")) {
            p.log.error(`Directory "${tempDir}" already exists`);
            p.log.info("Please choose a different project name or remove the existing directory.");
        } else {
            p.log.error("Error details:");
            p.log.info(error.message);
        }

        process.exit(1);
    }

    // Remove .git directory and CLI-related folders
    s.start("Cleaning up");
    try {
        const isWindows = process.platform === "win32";
        const targetDir = useCurrentDir ? tempDir : projectName;

        // Remove .git directory
        if (isWindows) {
            await execa("cmd", ["/c", "rmdir", "/s", "/q", `${targetDir}\\.git`], {
                shell: true,
            });
        } else {
            await execa("rm", ["-rf", `${targetDir}/.git`], { shell: true });
        }

        // Remove CLI-related folders if they exist
        const foldersToRemove = [
            "create-bunestro",
            "packages",
            ".github/workflows", // Optional: remove CI/CD workflows
        ];

        for (const folder of foldersToRemove) {
            const folderPath = resolve(process.cwd(), targetDir, folder);
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

        // If using current directory, move files from temp to current
        if (useCurrentDir) {
            const { copyFile, mkdir, readdir, stat } = await import("fs/promises");
            const { dirname, relative, join } = await import("path");

            async function copyDir(src: string, dest: string): Promise<void> {
                const entries = await readdir(src, { withFileTypes: true });

                for (const entry of entries) {
                    const srcPath = join(src, entry.name);
                    const destPath = join(dest, entry.name);

                    if (entry.isDirectory()) {
                        await mkdir(destPath, { recursive: true });
                        await copyDir(srcPath, destPath);
                    } else {
                        await mkdir(dirname(destPath), { recursive: true });
                        await copyFile(srcPath, destPath);
                    }
                }
            }

            await copyDir(tempDir, process.cwd());

            // Remove temp directory
            if (isWindows) {
                await execa("cmd", ["/c", "rmdir", "/s", "/q", tempDir], {
                    shell: true,
                });
            } else {
                await execa("rm", ["-rf", tempDir], { shell: true });
            }
        }

        s.stop("Cleaned up");
    } catch (error: any) {
        s.stop("Failed to clean up");
        p.log.warn("Could not remove some directories");
        p.log.info("You can manually delete them later.");
        // Don't exit - this is not critical
    }

    // Detect package manager
    const packageManager = detectPackageManager();
    p.log.info(`Detected package manager: ${packageManager}`);

    // Install dependencies
    let shouldInstall = argv.install;

    if (argv.y) {
        shouldInstall = true;
    } else if (shouldInstall === undefined) {
        const installResponse = await p.confirm({
            message: "Install dependencies?",
            initialValue: true,
        });

        if (p.isCancel(installResponse)) {
            p.cancel("Operation cancelled");
            process.exit(0);
        }

        shouldInstall = installResponse;
    }

    if (shouldInstall) {
        s.start("Installing dependencies");
        try {
            await execa(packageManager, ["install"], {
                cwd: useCurrentDir ? process.cwd() : resolve(process.cwd(), projectName),
                stdio: "pipe",
            });
            s.stop("Dependencies installed");
        } catch (error: any) {
            s.stop("Failed to install dependencies");

            if (
                error.message.includes("ENOTFOUND") ||
                error.message.includes("network") ||
                error.message.includes("timeout")
            ) {
                p.log.error("Network error during installation");
                p.log.info("You can install dependencies later by running:");
                if (!useCurrentDir) {
                    p.log.info(`  cd ${projectName} && ${packageManager} install`);
                } else {
                    p.log.info(`  ${packageManager} install`);
                }
            } else if (
                error.message.includes("EACCES") ||
                error.message.includes("permission denied")
            ) {
                p.log.error("Permission error");
                p.log.info("Try running the command with appropriate permissions.");
            } else {
                p.log.error("Installation error:");
                p.log.info(error.message);
                p.log.info("You can try installing manually:");
                if (!useCurrentDir) {
                    p.log.info(`  cd ${projectName} && ${packageManager} install`);
                } else {
                    p.log.info(`  ${packageManager} install`);
                }
            }

            // Ask if user wants to continue anyway
            const continueResponse = await p.confirm({
                message: "Continue without installing dependencies?",
                initialValue: true,
            });

            if (p.isCancel(continueResponse) || !continueResponse) {
                p.cancel("Operation cancelled");
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
        const gitResponse = await p.confirm({
            message: "Initialize a new git repository?",
            initialValue: true,
        });

        if (p.isCancel(gitResponse)) {
            p.cancel("Operation cancelled");
            process.exit(0);
        }

        shouldInitGit = gitResponse;
    }

    let gitInitialized = false;
    if (shouldInitGit) {
        s.start("Initializing git repository");
        try {
            const gitCwd = useCurrentDir ? process.cwd() : resolve(process.cwd(), projectName);
            await execa("git", ["init"], { cwd: gitCwd });
            await execa("git", ["add", "."], { cwd: gitCwd });
            await execa("git", ["commit", "-m", "Initial commit"], { cwd: gitCwd });
            s.stop("Git repository initialized");
            gitInitialized = true;
        } catch (error: any) {
            s.stop("Git initialization skipped");

            if (
                error.message.includes("not found") ||
                error.message.includes("command not found")
            ) {
                p.log.warn("Git is not installed or not in PATH.");
            } else if (
                error.message.includes("user.name") ||
                error.message.includes("user.email")
            ) {
                p.log.warn("Git user configuration is missing.");
                p.log.info('Run: git config --global user.name "Your Name"');
                p.log.info('     git config --global user.email "you@example.com"');
            }
            // Continue anyway - git init is optional
        }
    }

    // Connect to remote repository
    if (gitInitialized) {
        const connectRemoteResponse = await p.confirm({
            message: "Connect to a remote repository?",
            initialValue: false,
        });

        if (p.isCancel(connectRemoteResponse)) {
            p.log.info("Skipping remote repository setup");
        } else if (connectRemoteResponse) {
            const remoteUrlResponse = await p.text({
                message: "Enter the remote repository URL:",
                placeholder: "https://github.com/username/repo.git",
                validate: (value: string) => {
                    if (!value) return "Remote URL is required";
                    if (
                        !value.startsWith("https://github.com/") &&
                        !value.startsWith("git@github.com:") &&
                        !value.startsWith("https://gitlab.com/") &&
                        !value.startsWith("git@gitlab.com:")
                    ) {
                        return "Please enter a valid Github or Gitlab repository URL";
                    }
                },
            });

            if (p.isCancel(remoteUrlResponse)) {
                p.log.info("Skipping remote repository setup");
            } else {
                const remoteUrl = remoteUrlResponse as string;

                const pushChoice = await p.select({
                    message: "What would you like to do?",
                    options: [
                        { value: "push", label: "Add remote and push code now" },
                        { value: "connect", label: "Just add remote (don't push yet)" },
                    ],
                    initialValue: "push",
                });

                if (p.isCancel(pushChoice)) {
                    p.log.info("Skipping remote repository setup");
                } else {
                    const shouldPush = pushChoice === "push";
                    s.start(shouldPush ? "Connecting and pushing to remote repository" : "Adding remote repository");

                    try {
                        const gitCwd = useCurrentDir ? process.cwd() : resolve(process.cwd(), projectName);
                        await execa("git", ["remote", "add", "origin", remoteUrl], { cwd: gitCwd });
                        await execa("git", ["branch", "-M", "main"], { cwd: gitCwd });

                        if (shouldPush) {
                            await execa("git", ["push", "-u", "origin", "main"], { cwd: gitCwd });
                            s.stop("Connected and pushed to remote repository");
                            p.log.success(`Successfully pushed to ${remoteUrl}`);
                        } else {
                            // Set up auto upstream so `git push` works without -u flag
                            await execa("git", ["config", "push.autoSetupRemote", "true"], { cwd: gitCwd });
                            s.stop("Remote repository added");
                            p.log.success(`Remote added: ${remoteUrl}`);
                            p.log.info("You can push later with: git push (auto-tracking enabled)");
                        }
                    } catch (error: any) {
                        s.stop(shouldPush ? "Failed to connect and push" : "Failed to add remote");

                        if (
                            error.message.includes("Permission denied") ||
                            error.message.includes("authentication failed")
                        ) {
                            p.log.error("Authentication failed");
                            p.log.info("Make sure you have the correct permissions and authentication set up.");
                        } else if (error.message.includes("Repository not found")) {
                            p.log.error("Repository not found");
                            p.log.info("Make sure the repository exists and the URL is correct.");
                        } else if (error.message.includes("already exists")) {
                            p.log.error("Remote 'origin' already exists");
                            p.log.info("You can manually set the remote with:");
                            p.log.info(`  git remote set-url origin ${remoteUrl}`);
                        } else {
                            p.log.error("Error:");
                            p.log.info(error.message);
                            p.log.info("\nYou can manually connect later with:");
                            p.log.info(`  git remote add origin ${remoteUrl}`);
                            p.log.info("  git config push.autoSetupRemote true");
                            p.log.info("  git push");
                        }
                    }
                }
            }
        }
    }

    // Open in editor
    let editorChoice: EditorChoice = null;

    if (argv.cursor) {
        editorChoice = "cursor";
    } else if (argv.vscode) {
        editorChoice = "vscode";
    } else if (!argv.y) {
        const editorResponse = await p.select({
            message: "Open project in editor?",
            options: [
                { value: "cursor", label: "Cursor" },
                { value: "vscode", label: "VS Code" },
                { value: "skip", label: "Skip" },
            ],
            initialValue: "cursor",
        });

        if (p.isCancel(editorResponse)) {
            editorChoice = "skip";
        } else {
            editorChoice = editorResponse as EditorChoice;
        }
    }

    if (editorChoice && editorChoice !== "skip") {
        const editor = editorChoice === "vscode" ? "code" : "cursor";
        const editorName = editorChoice === "vscode" ? "VS Code" : "Cursor";

        try {
            await execa(editor, ["."], {
                cwd: useCurrentDir ? process.cwd() : resolve(process.cwd(), projectName),
            });
            p.log.success(`Opened in ${editorName}`);
        } catch (error: any) {
            p.log.warn(`Could not open ${editorName}`);

            if (
                error.message.includes("not found") ||
                error.message.includes("command not found")
            ) {
                p.log.info(`${editorName} CLI is not installed or not in PATH.`);
                if (!useCurrentDir) {
                    p.log.info(`You can open the project manually: cd ${projectName}`);
                }
            }
        }
    }

    // Success message
    let nextSteps = "";
    if (!useCurrentDir) {
        nextSteps += `cd ${projectName}\n`;
    }
    if (!shouldInstall) {
        nextSteps += `${packageManager} install\n`;
    }
    nextSteps += `${packageManager} run dev`;

    p.note(nextSteps, "Next steps");

    p.outro(color.green("All done! 🎉"));
}

function detectPackageManager(): PackageManager {
    // Check if Bun is available and being used
    if (typeof (globalThis as any).Bun !== "undefined") return "bun";
    if (process.env.npm_execpath?.includes("bun")) return "bun";
    if (process.argv[1]?.includes("bunx")) return "bun";

    // Check for other package managers
    if (process.env.npm_execpath?.includes("pnpm")) return "pnpm";
    if (process.env.npm_execpath?.includes("yarn")) return "yarn";

    return "npm";
}

main().catch((error: any) => {
    if (error.isCanceled) {
        p.cancel("Operation cancelled by user");
        process.exit(0);
    }

    p.log.error("An unexpected error occurred:");
    p.log.info(error.message || error);
    p.log.info("\nIf this issue persists, please report it at:");
    p.log.info("https://github.com/ardzero/bunestro/issues");
    process.exit(1);
});
