const express = require('express');
const { createoption, GetallOptions } = require('../controllers/ControllersOptions.js');

const router_4 = express.Router();

router_4.get('/', GetallOptions);
router_4.post('/', createoption);

module.exports = router_4;
 