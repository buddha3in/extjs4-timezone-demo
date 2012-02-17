// Enclose overrides in closure to avoid conflicts with global variables.
(function() {

    if (!Date.prototype._timezone) {
        // Since getTimezoneOffeset() returns value with inverted sign,
        // multiply by -1 to normalize offset value.
        Date.prototype._timezone = (new Date()).getTimezoneOffset() * -1;
    }

    var TIME_ZONES = {
        UTC:  0,
        EST: -5,
        EDT: -4,
        PST: -8,
        PDT: -7
    };

    var toTimezone = function(date, targetOffset) {
        var sourceOffset = date._timezone,
            targetOffset = targetOffset * 60; // 60 - minutes in an hour

        // Convert and persist information about new timezone.
        date.setMinutes(date.getMinutes() + targetOffset - sourceOffset);
        date._timezone = targetOffset;

        return date;
    };

    var extractDateFieldNames = function(record) {
        var dateFields = [];

        record.fields.each(function(field) {
            if (field.type.type === 'date') {
                dateFields.push(field.name);
            }
        });
        return dateFields;
    }

    var convertTimezoneForRecords = function(records, timezone) {
        var dateFields = extractDateFieldNames(records[0]);

        // For each instance of the Model convert timezone.
        Ext.each(records, function(record) {
            Ext.each(dateFields, function(field) {
                if (record.get(field) !== null) {
                    record.set(field, toTimezone(record.get(field), timezone));
                }
            });
        });
    };

    // Ensure that Reader and Writer are available.
    Ext.require([
        'Ext.data.reader.Reader',
        'Ext.data.writer.Writer'],

        function() {

            Ext.override(Ext.data.reader.Reader, {

                // The 'read' method is the perfect candidate for converting
                // timezones, because its output already represents instances
                // of Model class, not just plain JavaScript objects. And at
                // the same time the data is not in the store yet.
                read: function() {
                    var resultSet = this.callOverridden(arguments),
                        records   = resultSet.records;

                    if (resultSet.total > 0) {
                        convertTimezoneForRecords(records, TIME_ZONES.EST);
                    }
                    return resultSet;
                }
            });

            Ext.override(Ext.data.writer.Writer, {

                // The 'write' method is the entry point for any writer,
                // so it's the most appropriate place to convert timezones back.
                write: function(request) {
                    var records = request.records || [],
                        len     = records.length;

                    if (len > 0) {
                        convertTimezoneForRecords(records, TIME_ZONES.UTC);
                    }
                    return this.callOverridden(arguments);
                }
            });
        }
    );
})();
