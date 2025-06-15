const Router = require('express').Router;
const router = new Router();
const exhibitionController = require('../controllers/exhibitionController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', checkRoleMiddleware('ADMIN'), exhibitionController.create);
router.get('/', exhibitionController.getAll);
router.get('/:id', exhibitionController.getOne);
router.put('/:id', checkRoleMiddleware('ADMIN'), exhibitionController.update);
router.delete('/:id', checkRoleMiddleware('ADMIN'), exhibitionController.delete);

module.exports = router;
  