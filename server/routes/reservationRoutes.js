const Router = require('express');
const router = new Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', reservationController.create);
router.get('/', authMiddleware, reservationController.getUserReservations);
router.get('/admin', checkRoleMiddleware('ADMIN'), reservationController.getAllReservations);
router.put('/:id/status', checkRoleMiddleware('ADMIN'), reservationController.updateStatus);
router.delete('/:id', authMiddleware, reservationController.cancel);

module.exports = router;
  