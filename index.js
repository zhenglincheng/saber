#!/usr/bin/env node --harmony

const program = require('commander');
const prompt = require('co-prompt');
const co = require('co');
const chalk = require('chalk');
const handlebars = require('handlebars');
const actions = require('./src/actions');

const constants = require('./constants');

const templates = actions.loadYamlConfig(constants.templatesConfigFile).templates;

let commands = [
    {
        name: 'list',
        alias: 'ls',
        description: 'list all template files',
        action: function () {
            actions.list(templates);
        }
    },
    {
        name: 'generate',
        alias: 'gen',
        description: 'generate a file based on the template',
        action: function () {
            co(function* () {
                const templateName = yield prompt('Enter the template file name: ');
                const tpl = actions.matchTemplate(templates, templateName)
                if (tpl === undefined) {
                    console.error(chalk.red('Template undefined..'));
                    process.exit(1);
                }
                let targetDir = yield prompt(`Default target file path [${tpl.target}] (yes): `);
                if (targetDir === ''|| targetDir === 'yes' || targetDir === 'YES') {
                    targetDir = `${tpl.target}`;
                }
                const dir = process.cwd() + constants.fileSeparator + targetDir;
                actions.makeDir(dir);
                let targetFileName = yield prompt('Target file name : ');
                targetFileName += tpl.suffix;
                const source = actions.loadTemplate(tpl.path, tpl.decode);
                console.log(chalk.blue('Enter Parameters...'));
                const tplhadle = handlebars.compile(source);
                const data = yield actions.parseParams(tpl.params);
                actions.outputFile(targetDir + constants.fileSeparator + targetFileName, tplhadle(data));
                process.exit(0);
            })
        }
    }
];
program.version(constants.version)
commands.forEach((command) => {
    program.command(command.name)
        .alias(command.alias)
        .description(command.description)
        .action(command.action)
});

program.parse(process.argv);