import { $host, $authHost } from './index';
// создание нового бронирования
export const createReservation = async (reservation) => {
  const { data } = await $host.post('reservation', reservation);
  return data;
};
// бронирования пользователя авторизованного
export const fetchUserReservations = async () => {
  const { data } = await $authHost.get('reservation');
  return data;
};
// для администратора получение всех бронирвоаний
export const fetchAllReservations = async () => {
  const { data } = await $authHost.get('reservation/admin');
  return data;
};
// обновление статуча бронирования
export const updateReservationStatus = async (id, status) => {
  const { data } = await $authHost.put(`reservation/${id}/status`, { status });
  return data;
};
// отмена бронирвоания по id
export const cancelReservation = async (id) => {
  const { data } = await $authHost.delete(`reservation/${id}`);
  return data;
};
  