Ext.define('TimeZone.controller.Flights', {
    extend: 'Ext.app.Controller',

    stores: ['Flights'],
    models: ['Flight'],

    init: function() {
        this.getFlightsStore().on({
            load: function(store) {
                var print = function(flight) {
                    console.log(Ext.String.format('name: {0}; departure: {1}; arrival: {2}',
                        flight.get('name'),
                        flight.get('departure'),
                        flight.get('arrival'))
                    );
                };

                store.each(print);
            }
        });
    }
});
