Ext.define('TimeZone.model.Flight', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'name', type: 'string' },
        { name: 'departure', type: 'date' },
        { name: 'arrival', type: 'date' }
    ]
});
