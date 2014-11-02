describe('Datauri.template', function () {
    'use strict';

    var expect       = require('chai').expect,
        DataURI      = require('datauri'),
        Template     = require('../'),
        fs           = require('fs'),
        path         = require('path'),
        fixturePath  = path.join(__dirname, 'fixture'),
        expectedPath = path.join(__dirname, 'expected'),
        extraPath    = path.join(__dirname, 'extra'),
        fileList     = fs.readdirSync(fixturePath),
        extra        = '',
        datauri, cssContent;

    function runFixtures () {
        fileList.forEach(function (current) {
            it('should run fixture ' + current, function () {
                var fixture  = null,
                    expected = null,
                    datauri  = new Template('test/main.gif'),
                    // first argument is the template path
                    callArgs = [path.join(fixturePath, current)];

                extra = path.join(extraPath, path.basename(current, path.extname(current)) + '.js');

                if (fs.existsSync(extra)) {
                    callArgs = callArgs.concat(require(extra));
                }

                fixture  = datauri.template.apply(datauri, callArgs);
                expected = fs.readFileSync(path.join(expectedPath, current), 'utf-8');

                expect(fixture).to.eql(expected);
            });
        });
    }


    it('Should be a instance of datauri module', function () {
        var datauri  = new Template();

        expect(datauri instanceof DataURI).to.be.ok;
    });

    it('should create a template adapter', function () {
        var fixture    = null,
            expected   = null,
            datauri    = new Template('test/main.gif'),
            handlebars = require('handlebars');

        datauri.templateAdapter = function (templateContent) {
            expect(templateContent).to.eql(fs.readFileSync(path.join(fixturePath, 'simple.css'), 'utf-8'));

            return handlebars.compile(templateContent).bind(handlebars);
        };

        fixture  = datauri.template(path.join(fixturePath, 'simple.css'));
        expected = fs.readFileSync(path.join(expectedPath, 'simple.css'), 'utf-8');

        expect(fixture).to.eql(expected);
    });

    it('should create a template adapter and send extra variables', function () {
        var fixture    = null,
            expected   = null,
            datauri    = new Template('test/main.gif'),
            handlebars = require('handlebars');

        datauri.templateAdapter = function (templateContent) {
            expect(templateContent).to.eql(fs.readFileSync(path.join(fixturePath, 'variable.css'), 'utf-8'));

            return handlebars.compile(templateContent).bind(handlebars);
        };

        fixture  = datauri.template(path.join(fixturePath, 'variable.css'), {
            defaultMargin: '.1rem'
        });
        expected = fs.readFileSync(path.join(expectedPath, 'variable.css'), 'utf-8');

        expect(fixture).to.eql(expected);
    });

    describe('Test through all fixtures', runFixtures.bind(this));
});
