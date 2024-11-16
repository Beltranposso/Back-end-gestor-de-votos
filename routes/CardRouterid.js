const express = require('express');
const { getVotingByAsamblea } = require('../controllers/VotosbyAsambleas.js');

const router_5 = express.Router();

router_5.get('/:id', getVotingByAsamblea);

module.exports = router_5;
