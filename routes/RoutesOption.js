import express from 'express'
import { createoption, GetallOptions} from '../controllers/ControllersOptions.js'
const router_4 = express.Router()

router_4.get('/',GetallOptions)
router_4.post('/',createoption)


export default router_4     