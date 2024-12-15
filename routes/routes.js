const express = require('express');
const { createUser, DeleteUser, getAllUsers, getUser, updateUser,getUserCordinador,getUserOperador,SetAsistencia,getColumnByCedula,verifyUserByToken,getCargo} = require('../controllers/Controllers.js');
const  {getUsersByAsamblea} = require('../controllers/getUserByasamblea.js')
const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id_card', getUser);
router.get('/c/:id_card', getUserCordinador);
router.get('/o/:id_card', getUserOperador);
router.post('/', createUser);
router.put('/:Cedula', updateUser);
router.put('/A/:Cedula',SetAsistencia );
router.get('/api/get-column', getColumnByCedula);
router.get('/get-user-asamblea/:id_card',verifyUserByToken);
router.get('/C/getCargo',getCargo);
router.delete('/:Cedula', DeleteUser);

module.exports = router;
 