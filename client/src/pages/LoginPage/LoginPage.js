import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from '../../http/userAPI';
import { AuthContext } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const { setUser, setIsAuth } = useContext(AuthContext);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const validationSchema = Yup.object({
    email: Yup.string().email('Неверный адрес эл.почта').required('Требуется эл.почты'),
    password: Yup.string().required('Требуется пароль')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoginError('');
      const user = await login(values.email, values.password);
      setUser(user);
      setIsAuth(true);
      navigate(from, { replace: true });
    } catch (error) {
      setLoginError('неверный адрес эл.почты или пароля');
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
          window.scrollTo(0, 0);
        }, []);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Авторизация</h1>
          <p className="auth-subtitle">Добро пожаловат, пожалуйста введите данные от свое аккаунта</p>
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Эл.почта</label>
                  <Field type="email" id="email" name="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="error-message" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Пароль</label>
                  <Field type="password" id="password" name="password" className="form-control" />
                  <ErrorMessage name="password" component="div" className="error-message" />
                </div>
                
                {loginError && <div className="form-error">{loginError}</div>}
                
                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                  {isSubmitting ? 'Вход...' : 'Войти'}
                </button>
              </Form>
            )}
          </Formik>
          
          <div className="auth-footer">
            <p>Еще нет аккаунта?<Link to="/register">Зарегистрироваться</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
  