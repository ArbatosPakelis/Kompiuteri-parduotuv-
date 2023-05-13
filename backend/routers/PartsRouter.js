const express = require('express');
const parts = require('../routes/PartsController')

const router = express.Router();

router.get('/getAllParts', parts.getAllParts);
router.get('/getPart/:id', parts.getPart);
router.get('/getPartSpec/:tipas/:id', parts.getPartSpec);
router.get('/checkDuplication', parts.duplicationCheck);
router.get('/getRecommendations', parts.getRecommendations);
router.get('/getReviews/:id', parts.getReviews);
router.get('/recommendParts', parts.recommendParts);
router.delete('/removePart/:id', parts.removePart);
router.delete('/removeSpecPart/:tipas/:id', parts.removeSpecPart);
router.post('/addPart', parts.addPart);
router.post('/addSpecPart', parts.addSpecPart);
router.put('/setPart', parts.setPart);
router.put('/setSpecPart', parts.setSpecPart);
router.put('/applyRecommendation', parts.applyRecommendationLevel);

module.exports = router;