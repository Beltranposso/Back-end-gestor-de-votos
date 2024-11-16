const express = require('express');
const { createQuestion, getAllQuestions, getQuestions } = require('../controllers/ControllersQuestions.js');

const router_3 = express.Router();

router_3.get('/', getAllQuestions);
router_3.get('/:id_card', getQuestions);
router_3.post('/', createQuestion);
// router_3.delete('/:id', "funcion paraborrar preguntas");

module.exports = router_3;
