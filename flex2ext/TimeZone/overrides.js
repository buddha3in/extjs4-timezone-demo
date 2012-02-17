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
        var sourceOffset = date.getTimezoneOffset(),
            targetOffset = targetOffset * 60; // 60 - minutes in an hour

        // We add up both offsets because getTimezoneOffeset() returns value
        // with inverted sign, so as a result we get correct value.
        date.setMinutes(date.getMinutes() + sourceOffset + targetOffset);
        return date;
    };

    // Ensure that Reader is availabe.
    Ext.require('Ext.data.reader.Reader', function() {

        // Override required methods.
        Ext.override(Ext.data.reader.Reader, {

            // The 'read' method is the perfect candidate for converting time zones,
            // because its output already represents instances of Model class, not
            // just plain JavaScript objects. And at the same time the data is still
            // not in the store.
            read: function() {
                var resultSet = this.callOverridden(arguments),
                    records = resultSet.records,
                    dateFields = [];

                if (resultSet.total > 0) {

                    // Collect all date fields of the model.
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
