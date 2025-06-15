const db = require('../db');
const { ApiError } = require('../middleware/errorHandlingMiddleware');

class ReservationController {
  // создание бронирования
  async create(req, res, next) {
    try {
      const { exhibition_id, reservation_date, visitor_count, visitor_name, visitor_email, visitor_phone, user_id = null } = req.body;
      
      if (!exhibition_id || !reservation_date || !visitor_count || !visitor_name || !visitor_email || !visitor_phone) {
        return next(ApiError.badRequest('All fields are required'));
      }
      // проверка существавания выставки 
      const exhibition = await db.query(
        'SELECT * FROM exhibitions WHERE id = $1',
        [exhibition_id]
      );
      
      if (exhibition.rows.length === 0) {
        return next(ApiError.notFound('Exhibition not found'));
      }
      // добавление бронирования
      const reservation = await db.query(
        `INSERT INTO reservations 
         (user_id, exhibition_id, reservation_date, visitor_count, visitor_name, visitor_email, visitor_phone, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [user_id, exhibition_id, reservation_date, visitor_count, visitor_name, visitor_email, visitor_phone, 'PENDING']
      );
      
      return res.json(reservation.rows[0]);
    } catch (e) {
      next(ApiError.internal('Failed to create reservation'));
    }
  }

  async getUserReservations(req, res, next) {
    try {
      const { id } = req.user; // получение всех бронирований пользователя
      
      const reservations = await db.query(
        `SELECT r.*, e.title as exhibition_title, e.image_url, e.ticket_price 
         FROM reservations r
         JOIN exhibitions e ON r.exhibition_id = e.id
         WHERE r.user_id = $1
         ORDER BY r.created_at DESC`,
        [id]
      );
      
      return res.json(reservations.rows);
    } catch (e) {
      next(ApiError.internal('Failed to get reservations'));
    }
  }
// для админа
  async getAllReservations(req, res, next) {
    try {
      const reservations = await db.query(
        `SELECT r.*, e.title as exhibition_title, u.email as user_email
         FROM reservations r
         JOIN exhibitions e ON r.exhibition_id = e.id
         LEFT JOIN users u ON r.user_id = u.id
         ORDER BY r.created_at DESC`
      );
      
      return res.json(reservations.rows);
    } catch (e) {
      next(ApiError.internal('Failed to get reservations'));
    }
  }
// обновление статуса бронирований
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
        return next(ApiError.badRequest('Invalid status'));
      }
      
      const reservation = await db.query(
        'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );
      
      if (reservation.rows.length === 0) {
        return next(ApiError.notFound('Reservation not found'));
      }
      
      return res.json(reservation.rows[0]);
    } catch (e) {
      next(ApiError.internal('Failed to update reservation status'));
    }
  }
// отмена бронирования самим пользователем
  async cancel(req, res, next) {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      
      const reservation = await db.query(
        'SELECT * FROM reservations WHERE id = $1',
        [id]
      );
      
      if (reservation.rows.length === 0) {
        return next(ApiError.notFound('Reservation not found'));
      }
      
      if (reservation.rows[0].user_id !== userId) {
        return next(ApiError.forbidden('Not authorized to cancel this reservation'));
      }
      
      await db.query(
        'UPDATE reservations SET status = $1 WHERE id = $2',
        ['CANCELLED', id]
      );
      
      return res.json({ message: 'Reservation cancelled successfully' });
    } catch (e) {
      next(ApiError.internal('Failed to cancel reservation'));
    }
  }
}

module.exports = new ReservationController();
  