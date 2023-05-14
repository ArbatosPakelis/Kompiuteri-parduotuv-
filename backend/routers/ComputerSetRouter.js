const express = require('express');
const computerSet = require('../routes/CompusetSetController')

const router = express.Router();

router.get('/compatibility', computerSet.compatibility);
router.get('/getComputerSets', computerSet.getComputerSets);
router.get('/checkComputerSetDuplication', computerSet.checkComputerSetDuplication);
router.get('/getComputerSet', computerSet.getComputerSet);
router.post('/addComputerSet', computerSet.addComputerSet);
router.post('/updateComputerSet', computerSet.updateComputerSet);
router.delete('/unlinkPartFromBuild', computerSet.unlinkPartFromBuild);
router.delete('/deleteComputerSet', computerSet.deleteComputerSet);
router.delete('/removeComputerSetPart', computerSet.removeComputerSetPart);
module.exports = router;