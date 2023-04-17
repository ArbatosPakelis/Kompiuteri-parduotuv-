const express = require('express');
const parts = require('../routes/parts')

const router = express.Router();

router.get('/getAllParts', parts.getAllParts);
router.get('/getPart/:id', parts.getPart);
router.get('/getPartSpec/:tipas/:id', parts.getPartSpec);
router.delete('/removePart/:id', parts.removePart);
router.delete('/removeSpecPart/:tipas/:id', parts.removeSpecPart);
router.post('/addPart', parts.addPart);
router.post('/addSpecPart', parts.addSpecPart);
router.put('/setPart', parts.setPart);
router.put('/setSpecPart', parts.setSpecPart);

module.exports = router;