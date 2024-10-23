import express from 'express'
import {RegisterVote, getAllVotos, getVotosByid} from '../controllers/ControllersVotos.js'
const router_5 = express.Router()



router_5.get('/',getAllVotos) 
router_5.get('/:id_Option',getVotosByid)
router_5.post('/',RegisterVote)
/* router_3.delete('/:id',"funcion paraborrar preguntas") */
 


export default router_5   