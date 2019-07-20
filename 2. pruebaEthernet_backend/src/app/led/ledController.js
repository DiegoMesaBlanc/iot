const mysqlConnection = require('./../common/database');
const admin = require('../common/firebase');


const topic = 'floricultivo'




module.exports.getStatusLed = (req, res) => {
  // const ledId = req.params.idLed;

  const { id } = req.params;
  mysqlConnection.query('SELECT * FROM leds WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      return res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
}




module.exports.updateStatusLed = (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const query = `UPDATE leds SET status= ? WHERE id = ?`;
  const query2 = `SELECT * FROM iotassist.leds WHERE id = ?`;


  mysqlConnection.query(query, [status, id], (err, rows, fields) => {
    if (!err) {
      
      mysqlConnection.query(query2, [id], (err, result) => {
        if (!err){
          res.json({ status: result[0].status, temp: result[0].temperatura });
        } else {
          console.log(err);
        }
      });

    } else {
      console.log(err);
    }
  });
}


module.exports.subscribeToTopic = (req, res) => {
  const token = req.body.token;

  admin.messaging().subscribeToTopic(token, topic)
  .then(function(response) {
    console.log("Successfully subscribed to topic:", response);
  })
  .catch(function(error) {
    console.log("Error subscribing to topic:", error);
  });
}



module.exports.temp = (req, res) => {
  const { id } = req.params;
  const query = `SELECT temperatura FROM iotassist.leds WHERE id = ?`;

  mysqlConnection.query(query, [id], (err, result) => {
    if (!err) {
      res.json({ temperatura: result[0].temperatura });
    } else {
      console.log(err);
    }
  });
}



module.exports.tempRefresh = (req, res) => {
  const { temp } = req.body;
  const { id } = req.params;
  const query = `UPDATE leds SET temperatura= ? WHERE id = ?`;

  console.log('TEMP:', req.body);

  mysqlConnection.query(query, [temp, id], (err, result) => {
    if (!err) {
      console.log('Temperatura actualizada');
      res.json({ temperatura: 'Actualizada' });
    } else {
      console.log(err);
    }
  });
}



module.exports.notification = (req, res) => {

  var payload = {
    notification: { 
      title: 'Alerta Temperatura', 
      body: 'Los niveles de temperatura han sobrepasado el máximo de 30°.'
    }
  };

  return admin.messaging().sendToTopic(topic, payload)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  }).catch((error) => {
    console.log('Error sending message:', error);
  });
}


