const express = require('express');
const { getCard, getAllCards, createCard, DeleteCard, getCardsByCedula ,updateEstado} = require('../controllers/controllersCard.js');

const router_2 = express.Router();

router_2.get('/', getAllCards);
router_2.get('/', getCardsByCedula);
router_2.get('/id/:id', getCard);
router_2.post('/', createCard);
router_2.put('/E/:id',updateEstado);
router_2.delete('/:id', DeleteCard);


module.exports = router_2;
