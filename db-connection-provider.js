'use strict';

const debug = require('debug')('openHAMS-data');

const Influx = require('influx');

const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'sensors',
    schema: [{
        measurement: 'pressure',
        fields: {
            value: Influx.FieldType.FLOAT
        },
        tags: [
            'room'
        ]
    },
    {
        measurement: 'temperature',
        fields: {
            value: Influx.FieldType.FLOAT
        },
        tags: [
            'room'
        ]
    },
    {
        measurement: 'rgbled',
        fields: {
            value: Influx.FieldType.STRING
        },
        tags: [
            'room'
        ]
    }]
});


async function createDatabase() {
    return influx.createDatabase('sensors')
        .then();
}


exports.getConnection = function () {
    influx.getDatabaseNames()
        .then(names => {
            if (!names.includes('sensors')) {
                return createDatabase();
            }
        })
        .catch(err => {
            debug(`Error creating Influx database!`);
            debug(err);
        });
    return influx;
};
