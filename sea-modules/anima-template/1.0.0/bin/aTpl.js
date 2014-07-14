#!/usr/bin/env node

// dependencies
var atpl = require('../src/preCompile.js'),
    path = require('path'),
    nopt = require('nopt'),
    mkderp = require('mkdirp'),
    fs = require('fs');


// locals
var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'],
    specialsRegExp = new RegExp('(\\' + specials.join('|\\') + ')', 'g'),
    options = {
        'namespace': String,
        'outputdir': path,
        'variable': String,
        'version': true,
        'help': true
    }, shortHand = {
        'n': ['--namespace'],
        'o': ['--outputdir'],
        'v': ['--variable'],
        'h': ['--help'],
        'v': ['--version']
    }, templates;


// options
options = nopt(options, shortHand);


// escape special regexp characters
function esc(text) {
    return text.replace(specialsRegExp, '\\$1');
}


// cyan function for rob
function cyan(text) {
    return '\033[36m' + text + '\033[39m';
}

// check for dirs and correct ext (<3 for windows)
function extractFiles(args) {
    var usage = '\n' +
        cyan('USAGE:') + '   atpl [--outputdir outputdir] [--namespace namespace] [--variable variable] FILES\n\n' +
        cyan('OPTIONS:') +
        '         [-o, --outputdir] :: outputs the templates as individual files to a directory\n\n' +
        '         [-n, --namespace] :: prepend string to template names\n\n' +
        '         [-v, --variable]  :: variable name for non-amd wrapper\n\n' +
        cyan('EXAMPLE:') + ' atpl ./templates/*.mustache\n\n' +
        cyan('NOTE:') + '    atpl supports the "*" wildcard and allows you to target specific extensions too\n',
        files = [];

    if (options.version) {
        console.log(require('../package.json').version);
        process.exit(0);
    }

    if (!args.length || options.help) {
        console.log(usage);
        process.exit(0);
    }

    args.forEach(function(arg) {

        if (/\*/.test(arg)) {
            arg = arg.split('*');
            return files = files.concat(
                fs.readdirSync(arg[0] || '.')
                .map(function(f) {
                    var file = path.join(arg[0], f);
                    return new RegExp(esc(arg[1]) + '$').test(f) && fs.statSync(file).isFile() && file;
                })
                .filter(function(f) {
                    return f;
                })
            );
        }

        if (fs.statSync(arg).isFile()) files.push(arg);

    })

    return files;
}


// remove utf-8 byte order mark, http://en.wikipedia.org/wiki/Byte_order_mark
function removeByteOrderMark(text) {
    if (text.charCodeAt(0) === 0xfeff) {
        return text.substring(1);
    }
    return text;
}


// wrap templates
function wrap(file, name, openedFile) {
    return (options.variable || 'templates') + '["' + name + '"] =  animaTemplate.compile(' + atpl(openedFile) + ');module.exports = ' + (options.variable || 'templates') + ';';
}


// write the directory
if (options.outputdir) {
    mkderp.sync(options.outputdir);
}


// Prepend namespace to template name
function namespace(name) {
    return (options.namespace || '') + name;
}


// write a template foreach file that matches template extension
templates = extractFiles(options.argv.remain)
    .map(function(file) {
        var openedFile = fs.readFileSync(file, 'utf-8'),
            name;
        if (!openedFile) return;
        name = namespace(path.basename(file).replace(/\..*$/, ''));
        openedFile = removeByteOrderMark(openedFile.trim());
        openedFile = wrap(file, name, openedFile);
        if (!options.outputdir) return openedFile;
        var vn = options.variable || 'templates';
        fs.writeFileSync(path.join(options.outputdir, name + '.js'), 'if (!!!' + vn + ') var ' + vn + ' = {};\nvar animaTemplate = require("anima-template");' + openedFile);
    })
    .filter(function(t) {
        return t;
    });


// output templates
if (!templates.length || options.outputdir) process.exit(0);
if (!options.wrapper) {
    var vn = options.variable || 'templates';
    console.log('if (!!!' + vn + ') var ' + vn + ' = {};');
}
console.log(templates.join('\n'));
