import express from 'express'
import {createQuestion,getAllQuestions,getQuestions} from '../controllers/ControllersQuestions.js'
const router_3 = express.Router()

router_3.get('/',getAllQuestions ) 
router_3.get('/:id_card',getQuestions)

router_3.post('/',createQuestion)
/* router_3.delete('/:id',"funcion paraborrar preguntas") */
 


export default router_3    