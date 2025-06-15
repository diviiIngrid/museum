import { $host, $authHost } from './index';
import { jwtDecode as jwt_decode } from 'jwt-decode';
// регистрация нового пользователя
export const registration = async (name, email, password) => {
  const { data } = await $host.post('user/registration', { name, email, password });
  localStorage.setItem('token', data.token);
  return jwt_decode(data.token);
};
// вход пользователя
export const login = async (email, password) => {
  const { data } = await $host.post('user/login', { email, password });
  localStorage.setItem('token', data.token);
  return jwt_decode(data.token);
};
// проверка действительности токена
export const check = async () => {
  const { data } = await $authHost.get('user/auth');
  localStorage.setItem('token', data.token);
  return jwt_decode(data.token);
};
// получение информации о текущем пользователе
export const getProfile = async () => {
  const { data } = await $authHost.get('user/profile');
  return data;
};
// обновления профиля пользователя
export const updateProfile = async (profile) => {
  const { data } = await $authHost.put('user/profile', profile);
  return data;
};
  