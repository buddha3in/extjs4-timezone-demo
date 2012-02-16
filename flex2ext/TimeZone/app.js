Ext.Loader.setConfig({
    enabled: true,
    paths: {
        TimeZone: 'app'
    }
});

Ext.application({
    name: 'TimeZone',

    controllers: [
        'Flights'
    ]
});
