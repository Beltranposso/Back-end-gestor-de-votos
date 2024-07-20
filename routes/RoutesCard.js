import { getCard,getAllCards, createCard} from '../controllers/controllersCard.js'
import express from 'express'

const router_2  = express.Router()    

router_2.get('/',getAllCards)
router_2.get('/:id',getCard)
router_2.post('/',createCard)


export default router_2  