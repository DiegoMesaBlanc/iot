const admin = require('firebase-admin');
const serviceAccount = require('../../../serviceAccountKey.json');



/*Conexión Firebase notificaciones push*/
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iotnotifications-c6d28.firebaseio.com"
});


module.exports = admin;