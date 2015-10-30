datauri.template [![Build Status](http://img.shields.io/travis/heldr/datauri.template/master.svg?style=flat)](http://travis-ci.org/heldr/datauri.template) [![NPM version](http://img.shields.io/npm/dm/datauri.template.svg?style=flat)](https://www.npmjs.org/package/datauri.template)
=======

Wraps [datauri module][datauri] with template support.

`npm install --save datauri.template`

GET STARTED
-----------
This template method runs on top of Hogan(Mustache) by default, but you can change to any engine of your choice.

### Hello World

We are going to start creating a template file, this can be CSS, HTML or JS. Make sure to add the variables **classNameSuffix** and **dataURISchema**. Both are reserved at this time, but custom variable names will be available soon.

```css
/* foobar.css */
.image-{{classNameSuffix}} {
    background: url("{{dataURISchema}}");
}
```

Now we can create a JS file to preprocess the respective template. Remember that you do not necessarily need to instance DataURI like the example bellow. More examples using Callbacks and Events are available in the [main doc][datauri].

```js
var DataURI = require('datauri.template'),
    data    = new DataURI('test/myfile.png');

var content = data.template('template/foobar.css');

// result
console.log(content); // =>> .image-myfile {\n...
```

### Write file + Extra variables

```css
/* variables.css */
.image-{{classNameSuffix}} {
    background: url("{{dataURISchema}}");
    margin: {{defaultMargin}};
}
```

```js
var fs      = require('fs'),
    DataURI = require('datauri.template'),
    data    = new DataURI('test/flag.gif'),
    content = data.template('template/variables.css', {
        defaultMargin: '.1rem'
    });

fs.writeFile('variables.compiled.css');
```

```css
/* variables.compiled.css */
.image-flag {
    background: url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
    margin: .1rem;
}
```

### Custom template engine

Consider nunjucks as example. If your favorite template engine does support a compile + render shorthand, you just need to point the handler after a given template path, otherwise you will need to create a template adapter.

```css
/* nunjucks.css */
.image-{{ classNameSuffix }} {
    background: url("{{ dataURISchema }}");
    border-radius: {{ borderRadius }};
}
```

```js
var fs          = require('fs'),
    DataURI     = require('datauri.template'),
    nunjucks    = require('nunjucks'),
    data        = new DataURI('test/flag.gif');
    content     = data.template('template/nunjucks.css', nunjucks, {
        borderRadius: '2px'
    });

fs.writeFile('nunjucks.css');
```

```css
/* nunjucks.css */
.image-flag {
    background: url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
    border-radius: 2px;
}
```

### Create a template adapter

Some template engines does not have a shorthand to compile + render at the same call. In this specific cases we can create a template wrapper as the example bellow:

```js
var DataURI    = require('datauri.template'),
    handlebars = require('handlebars'),
    data       = new DataURI('test/flag.gif');

data.templateAdapter = function (templateContent) {
    var tpl = handlebars.compile(templateContent);

    // bind is used to ensure scope
    return tpl.bind(handlebars);
};

var content = data.template('template/foobar.css');

// result
console.log(content); // =>> .image-flag {\n...
```

DEVELOPING
----------

```CLI
$ make install
$ make test
```

If you'd like to test the full process including npm installer, just run:

```CLI
$ make fulltest
```

## Release notes

* 0.1 - First release

## License

MIT License
(c) [Helder Santana](http://git.io/heldr)

[datauri]: https://github.com/heldr/datauri
