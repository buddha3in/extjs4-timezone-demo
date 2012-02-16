Ext.define('TimeZone.controller.Flights', {
    extend: 'Ext.app.Controller',

    stores: ['Flights'],
    models: ['Flight'],

    init: function() {
        this.getFlightsStore().on({
            load: function(store) {
                store.each(function(flight) {
                    console.log(Ext.String.format('name: {0}; departure: {1}',
                        flight.get('name'), flight.get('departure')));
                });
            }
        });
    }
});
