const express = require('express');
const computerSet = require('../routes/CompusetSetController')

const router = express.Router();

router.get('/compatibility', computerSet.compatibility);

module.exports = router;