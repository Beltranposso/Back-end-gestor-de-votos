const express = require('express');
const { createUser, DeleteUser, getAllUsers, getUser, updateUser,getVotosByCardIdAndEstado,getAllUsersCounter,SetAsistencia } = require('../controllers/UsuariosControllers.js');

const router_9 = express.Router();

router_9.get('/', getAllUsers);
router_9.get('/N/',getAllUsersCounter);
router_9.get('/:id_card', getUser);
router_9.post('/', createUser);
router_9.put('/:Cedula', updateUser);
router_9.delete('/:Cedula', DeleteUser);
router_9.get('/c/:id_card', getVotosByCardIdAndEstado);
router_9.put ('/A/:Cedula', SetAsistencia);

module.exports = router_9;
  