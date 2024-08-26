import express from 'express'
import { getCard, getAllCards, createCard, DeleteCard,getCardsByCedula} from '../controllers/controllersCard.js'

const router_2 = express.Router()

router_2.get('/', getAllCards)
router_2.get('/:cedula', getCardsByCedula)
router_2.post('/', createCard)
router_2.delete('/:id',DeleteCard)



export default router_2   