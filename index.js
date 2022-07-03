const exec = require('child_process').exec;
const open = require('opn');
const fs = require('fs');
const path = require('path');
const { writeStats } = require('./lib/statsUtils');
const { bold } = require('chalk');

const pluginName = 'BacktrackImportsPlugin'


class BacktrackImportsPlugin {
    constructor(opts = {}) {
        this.opts = {
            openHTMLFile: true,
            ...opts
        };
    }

    apply(compiler) {
        this.compiler = compiler;
        if (compiler.options.name === 'client') {
            //tap into done hook of the compiler object. Use the stats argument to generate a JSON file. Build the plugin, and open the HTML file built in a browser.
            compiler.hooks.done.tapAsync(pluginName, (stats, callback) => {
                callback = callback || (() => { });
                const relative_path = __dirname.replace(process.cwd(), '.');
                const actions = [];
                actions.push(() => this.generateStatsFile(stats.toJson()));
                actions.push(() => this.buildAndRenderPlugin(relative_path, this.opts.openHTMLFile));

                if (actions.length) {
                    setImmediate(async () => {
                        try {
                            for (const action of actions) {
                                await action();
                            }
                            callback();
                        } catch (e) {
                            callback(e);
                        }
                    });
                } else {
                    callback();
                }
            })
        }
    }

    //function to render the HTML file built on running yarn build on the plugin.
    async buildAndRenderPlugin(relative_path, openHTMLFile) {
        let startTime = performance.now();
        exec(`cd ${relative_path} && yarn build`, (err, stdout, stderr) => {
            if (err)
                console.log(err);
            else {
                let endTime = performance.now();
                console.log(`Backtrack imports plugin build took ${(endTime - startTime) / 1000} seconds`);
                const HTMLfilePath = __dirname + '/build/index.html';
                console.log(`${bold('Backtrack Imports Plugin')} saved HTML file to ${bold(HTMLfilePath)}`);
                if (openHTMLFile)
                    open(HTMLfilePath);
            }
        });
    }

    //function to write and save the JSON file at a particular path.
    async generateStatsFile(stats) {
        const statsFileFolder = __dirname + '/lib';
        const statsFilename = 'stats-backtrack-imports.json'
        const statsFilepath = path.resolve(statsFileFolder, statsFilename);
        await fs.promises.mkdir(path.dirname(statsFilepath), {
            recursive: true
        });

        try {
            await writeStats(stats, statsFilepath);
            console.log(`${bold('Backtrack Imports Plugin')} saved stats file to ${bold(statsFilepath)}`);
        } catch (error) {
            console.log(`${('Backtrack Imports Plugin')} error saving stats file to ${bold(statsFilepath)}: ${error}`);
        }
    }
}


module.exports = {
    BacktrackImportsPlugin
};