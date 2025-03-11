const express = require('express');
const { createUser, DeleteUser, getAllUsers, getUser, updateUser,getVotosByCardIdAndEstado,getAllUsersCounter,SetAsistencia,verifyUserByCedula,checkVotingStatusByIdCard ,debugToken,checkVotingStatusFromToken,getAsistencia,calcularQuorumTotal,getUsuariosPresentesByPDF,getUsersAndVotesByExcel,getAllUsersOperaddor,updateUserQuorumAndAsistencia,createUserApoderado,decodeToken,getUserPull,} = require('../controllers/UsuariosControllers.js');
const router = require('./routes.js');


const router_9 = express.Router();

router_9.get('/', getAllUsers);
router_9.get('/N/:id_card',getAllUsersCounter);
router_9.get('/:id_card', getUser);
router_9.post('/', createUser);
router_9.post('/verify-user/:id_card',verifyUserByCedula)
router_9.put('/update/:id', updateUser);
router_9.delete('/:Cedula', DeleteUser);
router_9.get('/c/:id_card', getVotosByCardIdAndEstado);
router_9.put ('/A/:Cedula', SetAsistencia); 
router_9.post('/check-voting/:id_card', checkVotingStatusByIdCard);
router_9.post('/check/token', checkVotingStatusFromToken);
router_9.get('/token/debug',debugToken); 
router_9.get('/A/get-asistencia',getAsistencia);
router_9.get('/q/quorum/:idCard',calcularQuorumTotal); 
router_9.get('/pdf/:id_card',getUsuariosPresentesByPDF);
router_9.get('/Excel/:id_card',getUsersAndVotesByExcel);
router_9.get('/OPE/getAll/:id_card',getAllUsersOperaddor)
router_9.post('/Quorum/setquorum/',updateUserQuorumAndAsistencia)
router_9.post('/CreateUser/Apoderado/',createUserApoderado);
router_9.get('/Token/decoded/', decodeToken);
router_9.get('/ShareUserOne/:id', getUserPull);
 


 
module.exports = router_9; 
  