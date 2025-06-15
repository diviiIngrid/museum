import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { registration } from '../../http/userAPI';
import { AuthContext } from '../../context/AuthContext';
import './RegisterPage.css';

const RegisterPage = () => {
  const { setUser, setIsAuth } = useContext(AuthContext);
  const [registerError, setRegisterError] = useState('');
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required('Требуется имя пользователя'),
    email: Yup.string().email('Неверный адрес эл.почты').required('Требуется эл.почта'),
    password: Yup.string()
      .min(6, 'Пароль должен содержать не менее 6 символов')
      .required('Требуется пароль'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
      .required('Требуется подтвердить пароль')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setRegisterError('');
      const user = await registration(values.name, values.email, values.password);
      setUser(user);
      setIsAuth(true);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        setRegisterError(error.response.data.message || 'Ошибка регистрации');
      } else {
        setRegisterError('ошибка регистрации. Повторите еще раз');
      }
      console.error('Registration error:', error);
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
          <h1>Создай аккаунт</h1>
          <p className="auth-subtitle"></p>
          
          <Formik
            initialValues={{ 
              name: '', 
              email: '', 
              password: '', 
              confirmPassword: '' 
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="auth-form">
                <div className="form-group">
                  <label htmlFor="name">Имя</label>
                  <Field type="text" id="name" name="name" className="form-control" />
                  <ErrorMessage name="name" component="div" className="error-message" />
                </div>
                
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
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Подтвердите пароль</label>
                  <Field type="password" id="confirmPassword" name="confirmPassword" className="form-control" />
                  <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                </div>
                
                {registerError && <div className="form-error">{registerError}</div>}
                
                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                  {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
              </Form>
            )}
          </Formik>
          
          <div className="auth-footer">
            <p>уже есть аккаунт? <Link to="/login">Авторизоваться</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
  