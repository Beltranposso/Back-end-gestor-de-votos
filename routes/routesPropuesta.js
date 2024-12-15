const express = require('express');
const { createPropuesta,getPropuestaID,getPropuesta,createProposal } = require('../controllers/controllersPropuesta.js');

const router_9 = express.Router();

router_9.get('/:id_card',getPropuesta);
router_9.post('/api/', createProposal);



module.exports = router_9;
  