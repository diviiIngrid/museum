const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { ApiError } = require('../middleware/errorHandlingMiddleware');
//создание токена, 24 часа
const generateJwt = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  );
};
// регистрация нового пользователя
class UserController {
  async registration(req, res, next) {
    try {
      const { name, email, password, role = 'USER' } = req.body;
      
      if (!email || !password) {
        return next(ApiError.badRequest('Email and password are required'));
      }
      
      const candidate = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      if (candidate.rows.length > 0) {
        return next(ApiError.badRequest('User with this email already exists'));
      }
      
      const hashPassword = await bcrypt.hash(password, 5);
      
      const newUser = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
        [name, email, hashPassword, role]
      );
      
      const user = newUser.rows[0];
      const token = generateJwt(user.id, user.email, user.role);
      
      return res.json({ token });
    } catch (e) {
      next(ApiError.internal('Registration error'));
    }
  }
// вход 
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const user = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      if (user.rows.length === 0) {
        return next(ApiError.badRequest('User not found'));
      }
      
      const comparePassword = bcrypt.compareSync(password, user.rows[0].password);
      
      if (!comparePassword) {
        return next(ApiError.badRequest('Incorrect password'));
      }
      
      const token = generateJwt(user.rows[0].id, user.rows[0].email, user.rows[0].role);
      
      return res.json({ token });
    } catch (e) {
      next(ApiError.internal('Login error'));
    }
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  }
// получение профиля текущего пользователя 
  async getProfile(req, res, next) {
    try {
      const user = await db.query(
        'SELECT id, name, email, role FROM users WHERE id = $1',
        [req.user.id]
      );
      
      if (user.rows.length === 0) {
        return next(ApiError.notFound('User not found'));
      }
      
      return res.json(user.rows[0]);
    } catch (e) {
      next(ApiError.internal('Get profile error'));
    }
  }
// редактирование обновления профиля
  async updateProfile(req, res, next) {
    try {
      const { name, email } = req.body;
      
      const user = await db.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role',
        [name, email, req.user.id]
      );
      
      if (user.rows.length === 0) {
        return next(ApiError.notFound('User not found'));
      }
      
      return res.json(user.rows[0]);
    } catch (e) {
      next(ApiError.internal('Update profile error'));
    }
  }
}

module.exports = new UserController();
  