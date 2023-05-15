const express = require('express');
const computerSetController = require('../routes/ComputerSetController');

const router = express.Router();

router.get('/compatibility', computerSetController.compatibility);
router.get('/getComputerSets', computerSetController.getComputerSets);
router.get('/checkComputerSetDuplication', computerSetController.checkComputerSetDuplication);
router.get('/getComputerSet', computerSetController.getComputerSet);
router.get('/generateComputer', computerSetController.generateComputer);
router.get('/generateToComputerSetForm', computerSetController.generateToComputerSetForm);
router.post('/addComputerSet', computerSetController.addComputerSet);
router.post('/updateComputerSet', computerSetController.updateComputerSet);
router.delete('/unlinkPartFromBuild', computerSetController.unlinkPartFromBuild);
router.delete('/deleteComputerSet', computerSetController.deleteComputerSet);
router.delete('/removeComputerSetPart', computerSetController.removeComputerSetPart);

module.exports = router;
