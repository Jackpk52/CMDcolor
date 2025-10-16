const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const { exec, spawn } = require('child_process');
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');

class InteractiveCustomizer {
    constructor() {
        this.themesDir = path.join(__dirname, '../themes');
        this.configDir = path.join(require('os').homedir(), '.cmdchameleon');
    }

    async init() {
        // Show awesome banner
        this.showBanner();
        
        // Check if dependencies are installed
        await this.checkDependencies();
        
        // Start main menu
        await this.mainMenu();
    }

    showBanner() {
        console.log(
            boxen(
                chalk.cyan(
                    figlet.textSync('CMDChameleon', { horizontalLayout: 'full' })
                ) + '\n' +
                chalk.yellow('🎨  Windows Command Prompt Customizer\n') +
                chalk.gray('    Polyglot Power: C + Python + JS + Batch'),
                { 
                    padding: 1,
                    borderColor: 'cyan',
                    borderStyle: 'round'
                }
            )
        );
    }

    async checkDependencies() {
        console.log(chalk.blue('🔍 Checking dependencies...\n'));
        
        // Check if C components are built
        const cComponents = [
            '../bin/color_controller.exe',
            '../bin/registry_manager.exe'
        ];
        
        for (const component of cComponents) {
            if (await fs.pathExists(path.join(__dirname, component))) {
                console.log(chalk.green('✅ ') + chalk.white('C components found'));
            } else {
                console.log(chalk.yellow('⚠️ ') + chalk.white('C components not built. Run: ') + chalk.cyan('cmdchameleon build'));
            }
        }

        // Check Python
        try {
            await this.executeCommand('python --version');
            console.log(chalk.green('✅ ') + chalk.white('Python found'));
        } catch {
            console.log(chalk.red('❌ ') + chalk.white('Python not found'));
        }
    }

    async mainMenu() {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: chalk.cyan('What would you like to do?'),
                choices: [
                    { name: '🎨  Apply a theme', value: 'apply-theme' },
                    { name: '👀  Preview themes', value: 'preview-themes' },
                    { name: '🛠️   Create custom theme', value: 'create-theme' },
                    { name: '⚙️   Manage aliases', value: 'manage-aliases' },
                    { name: '📊  System info', value: 'system-info' },
                    { name: '❌  Exit', value: 'exit' }
                ]
            }
        ]);

        switch (action) {
            case 'apply-theme':
                await this.applyThemeWizard();
                break;
            case 'preview-themes':
                await this.previewThemes();
                break;
            case 'create-theme':
                await this.createCustomTheme();
                break;
            case 'manage-aliases':
                await this.manageAliases();
                break;
            case 'system-info':
                await this.showSystemInfo();
                break;
            case 'exit':
                console.log(chalk.yellow('👋 Goodbye!'));
                process.exit(0);
        }
    }

    async applyThemeWizard() {
        const themes = await this.getAvailableThemes();
        
        const { themeName } = await inquirer.prompt([
            {
                type: 'list',
                name: 'themeName',
                message: chalk.cyan('Choose a theme to apply:'),
                choices: themes.map(theme => ({
                    name: `${theme.emoji}  ${theme.name} - ${theme.description}`,
                    value: theme.name
                }))
            }
        ]);

        // Show preview
        const selectedTheme = themes.find(t => t.name === themeName);
        await this.showThemePreview(selectedTheme);

        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: chalk.yellow(`Apply "${themeName}" theme?`),
                default: true
            }
        ]);

        if (confirm) {
            await this.applyTheme(themeName);
        } else {
            await this.mainMenu();
        }
    }

    async getAvailableThemes() {
        const themes = [];
        const themeFiles = await fs.readdir(this.themesDir);
        
        for (const file of themeFiles) {
            if (file.endsWith('.json')) {
                const themePath = path.join(this.themesDir, file);
                const themeData = await fs.readJson(themePath);
                themes.push({
                    name: themeData.name,
                    description: themeData.description,
                    colors: themeData.colors,
                    emoji: this.getThemeEmoji(themeData.name)
                });
            }
        }
        
        return themes;
    }

    getThemeEmoji(themeName) {
        const emojiMap = {
            'dark': '⚫',
            'light': '⚪',
            'hacker': '💚',
            'blueish': '🔵',
            'solarized': '🟡',
            'powerline': '⚡'
        };
        return emojiMap[themeName] || '🎨';
    }

    async showThemePreview(theme) {
        console.log('\n' + chalk.cyan('🎭 Theme Preview:'));
        console.log(chalk.white('┌────────────────────────────────────┐'));
        console.log(chalk.white('│                                    │'));
        
        // Show color preview
        const fg = this.chalkColor(theme.colors.foreground);
        const bg = this.chalkBgColor(theme.colors.background);
        console.log(`│  ${bg(fg('  COLOR PREVIEW: ${theme.colors.foreground} on ${theme.colors.background}  '))}  │`);
        
        console.log(chalk.white('│                                    │'));
        console.log(chalk.white('│  Prompt: ') + chalk.gray(theme.description));
        console.log(chalk.white('│                                    │'));
        console.log(chalk.white('└────────────────────────────────────┘\n'));
    }

    chalkColor(colorName) {
        const colorMap = {
            'black': chalk.black,
            'blue': chalk.blue,
            'green': chalk.green,
            'cyan': chalk.cyan,
            'red': chalk.red,
            'magenta': chalk.magenta,
            'yellow': chalk.yellow,
            'white': chalk.white
        };
        return colorMap[colorName] || chalk.white;
    }

    chalkBgColor(colorName) {
        const bgMap = {
            'black': chalk.bgBlack,
            'blue': chalk.bgBlue,
            'green': chalk.bgGreen,
            'cyan': chalk.bgCyan,
            'red': chalk.bgRed,
            'magenta': chalk.bgMagenta,
            'yellow': chalk.bgYellow,
            'white': chalk.bgWhite
        };
        return bgMap[colorName] || chalk.bgBlack;
    }

    async applyTheme(themeName) {
        console.log(chalk.blue(`\n🚀 Applying ${themeName} theme...`));
        
        try {
            // Use Python to apply the theme
            const pythonProcess = spawn('python', [
                path.join(__dirname, '../py/main.py'),
                '--theme',
                themeName
            ]);

            pythonProcess.stdout.on('data', (data) => {
                console.log(chalk.gray(data.toString().trim()));
            });

            pythonProcess.stderr.on('data', (data) => {
                console.log(chalk.red('Error: ' + data.toString()));
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    console.log(chalk.green('\n✅ Theme applied successfully!'));
                    console.log(chalk.yellow('💡 Restart your command prompt to see all changes.'));
                } else {
                    console.log(chalk.red('\n❌ Failed to apply theme.'));
                }
                
                this.askToContinue();
            });

        } catch (error) {
            console.log(chalk.red('Error applying theme:'), error);
            this.askToContinue();
        }
    }

    async previewThemes() {
        const themes = await this.getAvailableThemes();
        
        console.log(chalk.cyan('\n🎨 Available Themes:\n'));
        
        for (const theme of themes) {
            const fg = this.chalkColor(theme.colors.foreground);
            const bg = this.chalkBgColor(theme.colors.background);
            
            console.log(
                `${theme.emoji}  ` +
                chalk.bold(theme.name) + 
                ' - ' + 
                theme.description
            );
            console.log(`   ${bg(fg('     '))} ${fg(theme.colors.foreground)} on ${theme.colors.background}\n`);
        }

        this.askToContinue();
    }

    async createCustomTheme() {
        console.log(chalk.cyan('\n🎨 Create Custom Theme\n'));

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Theme name:',
                validate: input => input ? true : 'Name is required'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Theme description:',
                default: 'Custom CMDChameleon theme'
            },
            {
                type: 'list',
                name: 'foreground',
                message: 'Text color:',
                choices: ['black', 'blue', 'green', 'cyan', 'red', 'magenta', 'yellow', 'white']
            },
            {
                type: 'list',
                name: 'background',
                message: 'Background color:',
                choices: ['black', 'blue', 'green', 'cyan', 'red', 'magenta', 'yellow', 'white']
            },
            {
                type: 'input',
                name: 'prompt',
                message: 'Prompt format:',
                default: '$P$G',
                validate: input => input ? true : 'Prompt is required'
            }
        ]);

        const theme = {
            name: answers.name,
            description: answers.description,
            colors: {
                foreground: answers.foreground,
                background: answers.background
            },
            prompt: answers.prompt,
            title: `CMD - ${answers.name}`,
            aliases: {
                ll: 'dir /Q',
                cls: 'cls && echo Custom theme active!'
            }
        };

        const themePath = path.join(this.configDir, 'themes', `${answers.name}.json`);
        await fs.ensureDir(path.dirname(themePath));
        await fs.writeJson(themePath, theme, { spaces: 2 });

        console.log(chalk.green(`\n✅ Theme "${answers.name}" created!`));
        
        const { applyNow } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'applyNow',
                message: 'Apply this theme now?',
                default: true
            }
        ]);

        if (applyNow) {
            await this.applyTheme(answers.name);
        } else {
            this.askToContinue();
        }
    }

    async manageAliases() {
        console.log(chalk.cyan('\n🔧 Alias Management\n'));
        
        // This would interface with your alias management system
        console.log(chalk.yellow('Alias management coming in v2!'));
        console.log(chalk.gray('Will allow you to add, remove, and manage command aliases.'));
        
        this.askToContinue();
    }

    async showSystemInfo() {
        console.log(chalk.cyan('\n📊 System Information\n'));
        
        try {
            // Get CMD version
            const cmdVersion = await this.executeCommand('cmd /c "ver"');
            console.log(chalk.white('CMD Version:'), chalk.green(cmdVersion.trim()));
            
            // Get Windows version
            const winVersion = await this.executeCommand('systeminfo | findstr /B /C:"OS Name"');
            console.log(chalk.white('OS:'), chalk.green(winVersion.split(':')[1]?.trim() || 'Unknown'));
            
        } catch (error) {
            console.log(chalk.red('Could not retrieve system info'));
        }
        
        this.askToContinue();
    }

    executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    async askToContinue() {
        const answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'shouldContinue',
                message: 'Return to main menu?',
                default: true
            }
        ]);

        if (answers.shouldContinue) {
            await this.mainMenu();
        } else {
            console.log(chalk.yellow('👋 Goodbye!'));
            process.exit(0);
        }
    }
}

// Handle command line arguments
const args = process.argv.slice(2);
const customizer = new InteractiveCustomizer();

if (args.includes('--wizard') || args.includes('-w')) {
    customizer.applyThemeWizard();
} else if (args.includes('--theme') || args.includes('-t')) {
    const themeIndex = args.findIndex(arg => arg === '--theme' || arg === '-t');
    const themeName = args[themeIndex + 1];
    if (themeName) {
        customizer.applyTheme(themeName);
    } else {
        console.log(chalk.red('Please specify a theme name'));
        process.exit(1);
    }
} else {
    customizer.init();
}

module.exports = InteractiveCustomizer;