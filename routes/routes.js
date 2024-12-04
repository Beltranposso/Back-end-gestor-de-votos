const express = require('express');
const { createUser, DeleteUser, getAllUsers, getUser, updateUser,getUserCordinador,getUserOperador } = require('../controllers/Controllers.js');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id_card', getUser);
router.get('/c/:id_card', getUserCordinador);
router.get('/o/:id_card', getUserOperador);
router.post('/', createUser);
router.put('/:Cedula', updateUser);
router.delete('/:Cedula', DeleteUser);

module.exports = router;
