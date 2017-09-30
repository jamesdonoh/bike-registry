const apn = require('apn');

const apnOptions = {
    token: {
        key: '-----BEGIN PRIVATE KEY-----\n' + process.env.APN_KEY + '\n-----END PRIVATE KEY-----',
        keyId: process.env.APN_KEYID,
        teamId: process.env.APN_TEAMID
    },
    production: process.env.APN_PRODUCTION == 'true'
};
const apnProvider = new apn.Provider(apnOptions);

const sighting = this;
console.log(`Received new sighting for bike ${sighting.bikeId}`);

dpd.bikes.get(sighting.bikeId)
    .then((bike) => {
        console.log(bike);
        const deviceToken = bike.deviceToken;

        if (!deviceToken) {
            throw('No device token for bike');
        }

        const notification = new apn.Notification();
        notification.topic = 'io.github.jamesdonoh.FindMyBike';
        notification.alert = `Your ${bike.make} ${bike.model} has been found`;
        notification.payload = {
            'bikeDescription': bike.make + ' ' + bike.model,
            'longitude': sighting.longitude,
            'latitude': sighting.latitude
        };

        console.log(`Sending notification: ${notification.compile()} to ${deviceToken} via ${apnOptions.production ? 'production' : 'development'} APNs`);

        apnProvider.send(notification, deviceToken).then((result) => {
            console.log(`sent: ${result.sent.length}, failed: ${result.failed.length}`);
            if (result.failed.length) {
                console.log(result.failed);
            }

            apnProvider.shutdown();
        });
    })
    .catch((err) => {
        console.log(err);
    });
