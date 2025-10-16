const { exec } = require('child_process');
const chalk = require('chalk');

class GitIntegration {
    static async getGitBranch() {
        return new Promise((resolve) => {
            exec('git branch --show-current 2>nul', (error, stdout) => {
                if (error || !stdout.trim()) {
                    resolve(null);
                } else {
                    resolve(stdout.trim());
                }
            });
        });
    }

    static async createGitPrompt() {
        const branch = await this.getGitBranch();
        if (branch) {
            return `[$P ${chalk.green(`git:${branch}`)}]$G `;
        }
        return null;
    }
}

module.exports = GitIntegration;