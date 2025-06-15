const uuid = require('uuid'); // уникальные имена для загруженных изображений
const path = require('path');
const db = require('../db');
const { ApiError } = require('../middleware/errorHandlingMiddleware');

class ExhibitionController { // создается новая выставка
  async create(req, res, next) {
    try {
      let { title, short_description, full_description, start_date, end_date, ticket_price } = req.body;
      
      if (!title || !short_description || !full_description || !start_date || !end_date || !ticket_price) {
        return next(ApiError.badRequest('All fields are required'));
      }
      
      let filename = null;
      if (req.files?.image) {
        const { image } = req.files;
        const ext = path.extname(image.name); 
        filename = uuid.v4() + ext;
        const uploadPath = path.resolve(__dirname, '..', 'static', filename);
        await image.mv(uploadPath);
      }
      // возвращает выставку
      const exhibition = await db.query(
        `INSERT INTO exhibitions 
         (title, short_description, full_description, image_url, start_date, end_date, ticket_price) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, short_description, full_description, filename, start_date, end_date, ticket_price]
      );
      
      return res.json(exhibition.rows[0]);
    } catch (e) {
      next(ApiError.internal('Failed to create exhibition'));
    }
  }
// все выставки
  async getAll(req, res, next) {
    try {
      let { limit = 9, page = 1 } = req.query;
      limit = parseInt(limit);
      page = parseInt(page);
      const offset = (page - 1) * limit;
      
      const exhibitions = await db.query(
        `SELECT * FROM exhibitions ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      
      const total = await db.query('SELECT COUNT(*) FROM exhibitions');
      
      return res.json({
        count: parseInt(total.rows[0].count),
        rows: exhibitions.rows
      });
    } catch (e) {
      next(ApiError.internal('Failed to get exhibitions'));
    }
  }
// одна выставка по id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      
      const exhibition = await db.query(
        'SELECT * FROM exhibitions WHERE id = $1',
        [id]
      );
      
      if (exhibition.rows.length === 0) {
        return next(ApiError.notFound('Exhibition not found'));
      }
      
      return res.json(exhibition.rows[0]);
    } catch (e) {
      next(ApiError.internal('Failed to get exhibition'));
    }
  }
// обновление по id
  async update(req, res, next) {
    try {
      const { id } = req.params;
      let { title, short_description, full_description, start_date, end_date, ticket_price } = req.body;
      
      const exhibition = await db.query(
        'SELECT * FROM exhibitions WHERE id = $1',
        [id]
      );
      
      if (exhibition.rows.length === 0) {
        return next(ApiError.notFound('Exhibition not found'));
      }
      
      let filename = exhibition.rows[0].image_url;
      if (req.files && req.files.image) {
        const { image } = req.files;
        filename = uuid.v4() + '.jpg';
        image.mv(path.resolve(__dirname, '..', 'static', filename));
      }
      
      const updatedExhibition = await db.query(
        `UPDATE exhibitions 
         SET title = $1, short_description = $2, full_description = $3, 
         image_url = $4, start_date = $5, end_date = $6, ticket_price = $7 
         WHERE id = $8 RETURNING *`,
        [title, short_description, full_description, filename, start_date, end_date, ticket_price, id]
      );
      
      return res.json(updatedExhibition.rows[0]);
    } catch (e) {
      next(ApiError.internal('Failed to update exhibition'));
    }
  }
// удаление по id
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      const exhibition = await db.query(
        'SELECT * FROM exhibitions WHERE id = $1',
        [id]
      );
      
      if (exhibition.rows.length === 0) {
        return next(ApiError.notFound('Exhibition not found'));
      }
      
      await db.query('DELETE FROM exhibitions WHERE id = $1', [id]);
      
      return res.json({ message: 'Exhibition deleted successfully' });
    } catch (e) {
      next(ApiError.internal('Failed to delete exhibition'));
    }
  }
}

module.exports = new ExhibitionController();
  