Ext.define('TimeZone.store.Flights', {
    extend: 'Ext.data.Store',

    model: 'TimeZone.model.Flight',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'data/flights.js'
    }
});
