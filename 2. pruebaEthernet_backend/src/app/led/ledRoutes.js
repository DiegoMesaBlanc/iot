const express = require("express");
const ledController = require("./ledController");

const router = express.Router();

router.get('/led/:id', ledController.getStatusLed);
router.put('/led/:id', ledController.updateStatusLed);

// Suscribirse a topic = 'floricultivo'
router.post('/subscribeToTopic', ledController.subscribeToTopic);


// Temperatura
router.get('/temperatura/:id', ledController.temp);
router.put('/temperatura/:id', ledController.tempRefresh);

// Notificacion
router.post('/notificacion', ledController.notification);



module.exports = router;