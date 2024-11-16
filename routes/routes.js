const express = require('express');
const { createUser, DeleteUser, getAllUsers, getUser, updateUser } = require('../controllers/Controllers.js');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:Cedula', updateUser);
router.delete('/:Cedula', DeleteUser);

module.exports = router;
