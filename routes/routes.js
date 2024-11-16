import express from 'express'
import { createUser, DeleteUser, getAllUsers, getUser, updateUser} from '../controllers/Controllers.js'



const router  = express.Router()    


router.get('/',getAllUsers)
router.get('/:id',getUser)
router.post('/',createUser)
router.put('/:Cedula', updateUser)
router.delete('/:Cedula',DeleteUser)




export default router   