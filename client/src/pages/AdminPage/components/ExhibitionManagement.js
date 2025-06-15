import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  fetchExhibitions,
  createExhibition,
  updateExhibition,
  deleteExhibition
} from '../../../http/exhibitionAPI';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ExhibitionManagement = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [formOperation, setFormOperation] = useState('create');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchExhibitionData();
  }, []);

  const fetchExhibitionData = async () => {
    try {
      setLoading(true);
      const data = await fetchExhibitions(1, 100); 
      setExhibitions(data.rows);
    } catch (error) {
      console.error('Ошибка при вводе выставок:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedExhibition(null);
    setFormOperation('create');
    setModalIsOpen(true);
  };

  const openEditModal = (exhibition) => {
    setSelectedExhibition(exhibition);
    setFormOperation('edit');
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSubmitError('');
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Требуется название'),
    short_description: Yup.string().required('Требуется краткое описание'),
    full_description: Yup.string().required('Требуется полное описание'),
    start_date: Yup.date().required('Требуется дата начала выставки'),
    end_date: Yup.date()
      .required('Требуется дата окончания выставки')
      .min(Yup.ref('start_date'), 'Дата окончания должна быть после даты начала'),
    ticket_price: Yup.number()
      .required('Требуется стоимость билета')
      .positive('Стоимость билета должна быть положительной')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitError('');
      const formData = new FormData();
      
      Object.keys(values).forEach(key => {
        if (key === 'image' && values[key]) {
          formData.append('image', values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });
      
      if (formOperation === 'create') {
        await createExhibition(formData);
      } else {
        await updateExhibition(selectedExhibition.id, formData);
      }
      
      fetchExhibitionData();
      closeModal();
      resetForm();
    } catch (error) {
      setSubmitError('Не удалось сохранить выставку. Попробуйте еще раз');
      console.error('Ошибка в сохранени выставки:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту выставку?')) {
      try {
        await deleteExhibition(id);
        fetchExhibitionData();
      } catch (error) {
        console.error('Ошибка в удалении выставки:', error);
        alert('Не удалось удалить выставку');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="exhibition-management">
      <div className="panel-header">
        <h2>Управление выставками</h2>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <FaPlus /> добавить выставку
        </button>
      </div>

      {loading ? (
        <div className="loading">загрузка выставок...</div>
      ) : exhibitions.length === 0 ? (
        <div className="no-data">Выставки не найдены.</div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Заголовок</th>
                <th>Даты</th>
                <th>Цена</th>
                <th>Информация</th>
              </tr>
            </thead>
            <tbody>
              {exhibitions.map(exhibition => (
                <tr key={exhibition.id}>
                  <td>{exhibition.title}</td>
                  <td>
                    {new Date(exhibition.start_date).toLocaleDateString()} - 
                    {new Date(exhibition.end_date).toLocaleDateString()}
                  </td>
                  <td>{new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(exhibition.ticket_price)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        onClick={() => openEditModal(exhibition)}
                        title="Изменить"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn-icon delete" 
                        onClick={() => handleDelete(exhibition.id)}
                        title="Удалить"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Форма добавления выставок"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>{formOperation === 'create' ? 'Создание новой выставки' : 'Изменения выставки'}</h2>
          <button className="modal-close" onClick={closeModal}>&times;</button>
        </div>
        
        <Formik
          initialValues={{
            title: selectedExhibition?.title || '',
            short_description: selectedExhibition?.short_description || '',
            full_description: selectedExhibition?.full_description || '',
            start_date: selectedExhibition ? formatDate(selectedExhibition.start_date) : '',
            end_date: selectedExhibition ? formatDate(selectedExhibition.end_date) : '',
            ticket_price: selectedExhibition?.ticket_price || '',
            image: null
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="exhibition-form">
              <div className="form-group">
                <label htmlFor="title">Заголовок</label>
                <Field type="text" id="title" name="title" className="form-control" />
                <ErrorMessage name="title" component="div" className="error-message" />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_date">Дата открытия</label>
                  <Field type="date" id="start_date" name="start_date" className="form-control" />
                  <ErrorMessage name="start_date" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="end_date">Дата окончания</label>
                  <Field type="date" id="end_date" name="end_date" className="form-control" />
                  <ErrorMessage name="end_date" component="div" className="error-message" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="ticket_price">Цена билета</label>
                  <Field type="number" id="ticket_price" name="ticket_price" step="0.01" className="form-control" />
                  <ErrorMessage name="ticket_price" component="div" className="error-message" />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="short_description">Краткое описание</label>
                <Field as="textarea" id="short_description" name="short_description" className="form-control" rows="3" />
                <ErrorMessage name="short_description" component="div" className="error-message" />
              </div>
              
              <div className="form-group">
                <label htmlFor="full_description">Описание</label>
                <Field as="textarea" id="full_description" name="full_description" className="form-control" rows="6" />
                <ErrorMessage name="full_description" component="div" className="error-message" />
              </div>
              
              <div className="form-group">
                <label htmlFor="image">Картинка</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files[0]);
                  }}
                  className="form-control-file"
                />
                <small className="form-text text-muted">
                  {formOperation === 'edit' && !selectedExhibition?.image_url 
                    ? 'В данный момент изображения нет. Загрузите его?' 
                    : formOperation === 'edit' 
                      ? 'Оставьте поле пустым, чтобы сохранить текущее изображение' 
                      : 'Выберите изображение для выставки'}
                </small>
              </div>
              
              {submitError && <div className="form-error">{submitError}</div>}
              
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Закрыть
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting 
                    ? (formOperation === 'create' ? 'Создание...' : 'Обнавление...') 
                    : (formOperation === 'create' ? 'Создание выставки' : 'Обнавление выставки')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default ExhibitionManagement;
