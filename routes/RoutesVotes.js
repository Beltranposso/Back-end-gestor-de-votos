const express = require('express');
const { RegisterVote, getAllVotos, getVotosByid, getvoto, checkVoter,obtenerResultadosPorCard,getOpcionesConQuorumByPregunta } = require('../controllers/ControllersVotos.js');
const router = require('./routes.js');

const router_5 = express.Router();

router_5.get('/', getAllVotos);
router_5.get('/:id_Option', getVotosByid);
router_5.post('/', RegisterVote);
router_5.get('/v/:id_card',getvoto);
router_5.get('/check-voto',checkVoter)
router_5.get('/Votes/:idCard',obtenerResultadosPorCard)
 router_5.get('/q/get-questions/:id',getOpcionesConQuorumByPregunta);

// router_3.delete('/:id', "funcion paraborrar preguntas");

module.exports = router_5;
 