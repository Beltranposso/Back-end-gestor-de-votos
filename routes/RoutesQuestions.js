import express from 'express'
import {createQuestion,getQuestions} from '../controllers/ControllersQuestions.js'
const router_3 = express.Router()

/* router_3.get('/', "funcion para traer todas las pregunytas ") */
router_3.get('/:id',getQuestions)
router_3.post('/',createQuestion)
/* router_3.delete('/:id',"funcion paraborrar preguntas") */
 


export default router_3    