const express = require('express');
const {
    getReadings,
    createReadings
} = require('../controllers/Readings');

const router = express.Router();

router
    .route('/')
    .get(getReadings)
    .post(createReadings);

module.exports = router;