// Enclose overrides in closure to avoid conflicts with global variables.
(function() {
    var TIME_ZONES = {
        UTC:  0,
        EST: -5,
        EDT: -4,
        PST: -8,
        PDT: -7
    };

    var toTimeZone = function(date, targetOffset) {
        var sourceOffset = date.getTimezoneOffset() / 60; // 60 - minutes in an hour
        date.setHours(date.getHours() + sourceOffset + targetOffset);
        return date;
    };

    var toUTC = function(date) {
        return toTimeZone(date, TIME_ZONES.UTC);
    };

    // Ensure that Reader is availabe.
    Ext.require('Ext.data.reader.Reader', function() {

        // Override required methods.
        Ext.override(Ext.data.reader.Reader, {
            readRecords: function() {
                var resultSet = this.callOverridden(arguments),
                    records = resultSet.records,
                    dateFields = [];

                if (records && records.length > 0) {
                    // Collect all date fields for the model.
                    records[0].fields.each(function(field) {
                        if (field.type.type === 'date') {
                            dateFields.push(field.name);
                        }
                    });

                    // For each instance of the model convert time zone.
                    Ext.each(records, function(record) {
                        Ext.each(dateFields, function(field) {
                            if (record.get(field) !== null) {
                                record.set(field, toTimeZone(
                                    record.get(field),
                                    TIME_ZONES.EST));
                            }
                        });
                    });
                }

                return resultSet;
            }
        });
    });
})();
