const chalk = require('chalk');

class ColorPicker {
    static showColorGrid() {
        console.log('\n🎨 Available Colors:');
        const colors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
        
        colors.forEach(color => {
            const colorFn = chalk[color] || chalk.white;
            const bgFn = chalk[`bg${color.charAt(0).toUpperCase() + color.slice(1)}`] || chalk.bgBlack;
            console.log(`  ${bgFn('    ')} ${colorFn(color)}`);
        });
        
        console.log('');
    }
}

module.exports = ColorPicker;