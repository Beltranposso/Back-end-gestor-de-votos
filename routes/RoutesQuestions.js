const express = require('express');
const { createQuestion, getAllQuestions, getQuestions,getQuestionID,hasQuestions,getCronometro,closeQuestion } = require('../controllers/ControllersQuestions.js');
const router = require('./routes.js');

const router_3 = express.Router();

router_3.get('/', getAllQuestions);
router_3.get('/:id_card', getQuestions);
router_3.post('/', createQuestion);
router_3.post('/q/:id_card', getQuestionID);
router_3.get('/q/get-questions/:id',hasQuestions);
router_3.get('/Cronometro/:id',getCronometro);
router_3.put('/Finalized/question/:id',closeQuestion);
// router_3.delete('/:id', "funcion paraborrar preguntas");

module.exports = router_3;
