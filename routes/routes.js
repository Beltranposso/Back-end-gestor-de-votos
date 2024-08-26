import express from 'express'
import { createUser, DeleteUser, getAllUsers, getUser, updateUser} from '../controllers/Controllers.js'



const router  = express.Router()    


router.get('/',getAllUsers)
router.get('/:id',getUser)
router.post('/',createUser)
router.put('/:id', updateUser)
router.delete('/:id',DeleteUser)




export default router   