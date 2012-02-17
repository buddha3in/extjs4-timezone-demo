### Timezone Demo

Illustrates how automatic timezone conversion can be handled within
[Ext.data.reader.Reader](http://docs.sencha.com/ext-js/4-0/#!/api/Ext.data.reader.Reader) and
[Ext.data.writer.Writer](http://docs.sencha.com/ext-js/4-0/#!/api/Ext.data.writer.Writer).
This demo is hosted right out of GitHub repository on JSFiddle, you can play with it online
[here](http://jsfiddle.net/gh/get/extjs/4.0.7/antonmoiseev/farata/tree/master/flex2ext/TimeZoneDemo/).

What happens here:

  1. `overrides.js` plugs in to Reader and Writer classes and substitutes implementation of `read`
     and `write` methods respectively. Internally both overrides call original method implementations,
     but in case of Reader it adds post-processing of `read` result records, and in case of Writer it
     adds pre-processing of request object. In practice it smoothly integrates into Ext JS data package
     architecture and guaranties that date fields of all Models will represent single timezone
     specified in `overrides.js` file.

  2. Ext JS MVC application starts and automatically loads data about flights time table. Each flight
     entry contains name of the flight and departure/arrival information. Departure information is
     given in the timezone of the departure point, arrival - in the timezone of the destination point.
     By default after instantiating `Date` object all dates are converted to the timezone of your current location.
     But our Reader plugin forces `Date` objects to be represented in the timezone whatever you specified.
     All dates are treated in a safe way - you'll never lose information about timezone that a `Date` object
     currently represents. So now you can work with time table and see dates in the timezone whatever you need.

  3. When you decide to save date and call `sync` method of the store, all dates will be automatically converted
     to UTC timezone before sending to the server (you can specify any timezone, UTC is by default).

*Note*: to see conversion results you need open up JavaScript console of your browser.