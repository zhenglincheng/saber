#!/usr/bin/env node --harmony

const prompt = require('co-prompt');
const co = require('co');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const fs = require('fs');
const YAML = require('yamljs');

exports.list = function (templates) {
    templates.forEach(function (template) {
        console.log(chalk.green(`${template.name} : ${template.description}`));
    })
};

exports.matchTemplate = function (templates, templateName) {
    let tpl = undefined;
    templates.forEach(function (template) {
        if (template.name === templateName) {
            tpl = template;
        }
    });
    return tpl;
};

exports.parseParams = function* (params) {
    let data = {};
    for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const _label = param.label;
        const _prompt = param.prompt;
        let _length = param.length;
        switch (param.type) {
            case 'String':
                data[_label] = yield prompt(_prompt);
                break;
            case 'Number':
                data[_label] = yield prompt(_prompt);
                break;
            case 'Boolean':
                const input = yield prompt(_prompt);
                if(input === 'false' || input === 'False'){
                    data[_label] = false;
                }else {
                    data[_label] = true;
                }
                break;
            case 'Array':
                if (_length === undefined) {
                    _length = yield prompt(`Enter [${_label}] length: `)
                }
                data[_label] = [];
                for (let i = 0; i < _length; i++) {
                    console.log(chalk.blue(`Enter Array [${_label}] Times [${i}]...`));
                    const value  = yield this.parseParams(param.params);
                    data[_label].push(value);
                }
                break;
            case 'Set':
                if (_length === undefined) {
                    _length = yield prompt(`Enter [${_label}] length: `)
                }
                data[_label] = [];
                for (let i = 0; i < _length; i++) {
                    console.log(chalk.blue(`Enter Set [${_label}] Times [${i}]...`));
                    const value  = yield prompt(_prompt);
                    data[_label].push(value);
                }
                break;
            case 'Object':
                data[_label]  = yield this.parseParams(param.params);
                break;
            default:
                console.log(chalk.red(`The Type [${param.type}] not supported`));
                process.exit(1);
        }
    }
    return data;
};

exports.makeDir = function (dir) {
    console.log(chalk.blue(`makeDir: ${dir}`))
    mkdirp(dir, function (err) {
            if (err) console.error(chalk.red(err));
        }
    );
};
exports.loadTemplate = function (path, code) {
    console.log(chalk.blue(`Loading Template file [${path}] ...`));
    let data = undefined;
    fs.existsSync(path, function (exist) {
        if (!exist) {
            console.log(chalk.red(`Template file [${path}] not exist!`));
            process.exit(1);
        }
    });
    data = fs.readFileSync(path, code);
    return data;
};
exports.outputFile = function (target, data) {
    console.log(chalk.blue(`Output file [${target}] ...`));
    fs.writeFileSync(target, data);
};
exports.loadYamlConfig = function (configDir) {
    return YAML.load(configDir);
}

