const express = require('express');
const { createUser, DeleteUser, getAllUsers, getUser, updateUser,getVotosByCardIdAndEstado,getAllUsersCounter,SetAsistencia,verifyUserByCedula,checkVotingStatusByIdCard ,debugToken,checkVotingStatusFromToken,getAsistencia,calcularQuorumTotal} = require('../controllers/UsuariosControllers.js');
const router = require('./routes.js');


const router_9 = express.Router();

router_9.get('/', getAllUsers);
router_9.get('/N/',getAllUsersCounter);
router_9.get('/:id_card', getUser);
router_9.post('/', createUser);
router_9.post('/verify-user/:id_card',verifyUserByCedula)
router_9.put('/:Cedula', updateUser);
router_9.delete('/:Cedula', DeleteUser);
router_9.get('/c/:id_card', getVotosByCardIdAndEstado);
router_9.put ('/A/:Cedula', SetAsistencia);
router_9.post('/check-voting/:id_card', checkVotingStatusByIdCard);
router_9.post('/check/token', checkVotingStatusFromToken);
router_9.get('/token/debug',debugToken);
router_9.get('/A/get-asistencia',getAsistencia);
router_9.get('/q/quorum/:idCard',calcularQuorumTotal);

module.exports = router_9; 
  