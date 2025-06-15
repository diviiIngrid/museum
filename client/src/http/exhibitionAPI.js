import { $host, $authHost } from './index'; // для гостей и авторизованных пользователей

export const createExhibition = async (exhibition) => {
  const { data } = await $authHost.post('exhibition', exhibition);
  return data;
};
// полчение выставок
export const fetchExhibitions = async (page = 1, limit = 9) => {
  const { data } = await $host.get('exhibition', {
    params: { page, limit }
  });
  return data;
};
// получение олной выставки
export const fetchOneExhibition = async (id) => {
  const { data } = await $host.get(`exhibition/${id}`);
  return data;
};
// обновление выставки по id
export const updateExhibition = async (id, exhibition) => {
  const { data } = await $authHost.put(`exhibition/${id}`, exhibition);
  return data;
};
// удаляет выставки по id
export const deleteExhibition = async (id) => {
  const { data } = await $authHost.delete(`exhibition/${id}`);
  return data;
};
  