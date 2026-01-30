const express = require('express');
const router = express.Router();
const nonWorkingDaysController = require('../controllers/non-working-days.controller');

router.get('/', nonWorkingDaysController.getNonWorkingDays);
router.post('/', nonWorkingDaysController.addNonWorkingDay);
router.delete('/:fecha', nonWorkingDaysController.removeNonWorkingDay);

module.exports = router;