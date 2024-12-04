const express = require('express');
const { RegisterVote, getAllVotos, getVotosByid, getvoto } = require('../controllers/ControllersVotos.js');
const router = require('./routes.js');

const router_5 = express.Router();

router_5.get('/', getAllVotos);
router_5.get('/:id_Option', getVotosByid);
router_5.post('/', RegisterVote);
router_5.get('/v/:id_card',getvoto);

// router_3.delete('/:id', "funcion paraborrar preguntas");

module.exports = router_5;
