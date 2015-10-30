"use strict";

var DataURI = require('datauri'),
    hogan   = require('hogan.js'),
    path    = require('path'),
    fs      = require('fs');

DataURI.prototype.templateAdapter = function (templateContent, param, engine) {
    engine = engine || hogan;

    if (!param || typeof param !== 'function') {
        var template = engine.compile(templateContent);

        return template.render.bind(template);
    }

    return param.bind(param, templateContent);
};

DataURI.prototype.template = function () {
    var data           = (arguments.length > 2) ? arguments[2] : arguments[1],
        templateEngine = this.templateAdapter(
            fs.readFileSync(arguments[0], 'utf-8'),
            arguments[1],
            (arguments.length > 2) && arguments[1]
        );

    data                 = data || {};
    data.dataURISchema   = this.content;
    data.classNameSuffix = path.basename(this.fileName, path.extname(this.fileName));

    return templateEngine(data);
};

module.exports = DataURI;
