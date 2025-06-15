const Router = require('express');
const router = new Router();
const userRouter = require('./userRoutes');
const exhibitionRouter = require('./exhibitionRoutes');
const reservationRouter = require('./reservationRoutes');

router.use('/user', userRouter);
router.use('/exhibition', exhibitionRouter);
router.use('/reservation', reservationRouter);

module.exports = router;
  