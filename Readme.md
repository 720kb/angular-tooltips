Angular Tooltips
==================

[![Join the chat at https://gitter.im/720kb/angular-tooltips](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/720kb/angular-tooltips?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


Angular Tooltips is an angularjs directive that generates a tooltip on your element.


The angular tooltips is developed by [720kb](http://720kb.net).

##Requirements


AngularJS v1.2+

##Screen
![Angular tooltips](http://i.imgur.com/2rOwAbQ.png)

###Browser support


![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
 ✔ | ✔ | IE10 + | ✔ | ✔ |


## Load

To use the directive, include the angular tooltips's javascript and css files in your web page:

```html
<!DOCTYPE HTML>
<html>
<head>
  <link href="src/css/angular-tooltips.css" rel="stylesheet" type="text/css" />
</head>
<body ng-app="app">
  //.....
  <script src="src/js/angular-tooltips.js"></script>
</body>
</html>
```

##Installation

####Bower

```
$ bower install angular-tooltips --save
```

####Npm

```
$ npm install angular-tooltips --save
```

_then load the js files in your html_

####Add module dependency

Add the 720kb.tooltips module dependency

```js
angular.module('app', [
  '720kb.tooltips'
 ]);
```


Call the directive wherever you want in your html page

```html

<a href="#" tooltips title="tooltip">Tooltip me</a>

```

##Doc

Option | Type | Default | Description
------------- | ------------- | ------------- | -------------
tooltip-side="" | String('left','right','top','bottom') | 'top' | Set your tooltip to show on `left` or `right` or `top` or `bottom` position
tooltip-size="" | String('medium','small','large') | 'medium' | Set your tooltip size
tooltip-speed="" | String('fast','medium','slow', Int(ms)) | 'medium' | Set your tooltip transition speed
tooltip-delay="" | Int(ms)) | 0 | Set your tooltip transition delay
tooltip-title="" | String() | false | Set your tooltip title
tooltip-content="" | String() | false | Set your tooltip content
tooltip-html="" | String() | false | Set your tooltip HTML content
tooltip-view="" | String() | false | Set your tooltip view PATH
tooltip-view-model="" | String() | false | Set your tooltip view model
tooltip-view-ctrl="" | String() | false | Set your tooltip view controller
tooltip-try="" | String(Boolean) | false | Set your tooltip to automatically search for an alternative position
tooltip-lazy="" | String(Boolean) | true | Re-init the tooltip position everytime is shown
tooltip-show-trigger="" | String('event1 event2') | 'mouseover' | Show the tooltip on specific event/events
tooltip-hide-trigger="" | String('event1 event2') | 'mouseleave' | Hide the tooltip on specific event/events
tooltip-hide-trigger-target="" | String('element', 'tooltip') | 'element' | Hide the tooltip on specific target event/events
tooltip-close-button="" | String(HTML) | false | Set the tooltip HTML close button
tooltip-class="" | String() | false | Set the tooltip custom CSS class/classes
tooltip-scroll="" | String(Boolean) | false | Set the tooltip to follow the element on scroll/move
tooltip-parent="" | String('#id') | '<body>' | Set the tooltip DOM parent by ID


##Options
Angular tooltips allows you to use some options via `attribute` data

####Globals
Application wide defaults for most of the options can be set using the `tooltipConfigProvider`:

```js
angular
  .module('app')
  .config(function(tooltipsConfigProvider) {
    tooltipsConfigProvider.options({
      lazy: false,
      size: 'large'
    })
  });
```
Options that are not specified are kept unchanged.
Option names are the same as attribute names without the "tooltip-" prefix: `scroll`, `showTrigger`, `hideTrigger`,
`hideTarget`, `side`, `size`, `try`, `class`, `speed`, `delay`, `lazy`, `closeButton`

Of course specific tooltips can still overwrite any default using attributes.

Calling `options` method without arguments returns the complete options object.

## Example

###[Live demo](https://720kb.github.io/angular-tooltips)

##Theming
You can edit the default Css file `angular-tooltips.css` if you want to make a new theme for the tooltips.

##Contributing

We will be much grateful if you help us making this project to grow up.
Feel free to contribute by forking, opening issues, pull requests etc.

## License

The MIT License (MIT)

Copyright (c) 2014 Filippo Oretti, Dario Andrei

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
