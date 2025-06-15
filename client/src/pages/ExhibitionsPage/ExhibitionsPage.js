import React, { useEffect, useState } from 'react';
import { fetchExhibitions } from '../../http/exhibitionAPI';
import ExhibitionCard from '../../components/ExhibitionCard/ExhibitionCard';
import './ExhibitionsPage.css';

const ExhibitionsPage = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 9;

  useEffect(() => {
    const getExhibitions = async () => {
      try {
        setLoading(true);
        const data = await fetchExhibitions(page, limit);
        setExhibitions(data.rows);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / limit));
      } catch (error) {
        console.error('Ошибка получения выставок:', error);
      } finally {
        setLoading(false);
      }
      window.scrollTo(0, 0);
    };
    getExhibitions();
  }, [page]);

  const handlePageChange = (newPage) => {
    window.scrollTo(0, 0);
    setPage(newPage);
  };

  return (
    <div className="exhibitions-page">
      <div className="exhibitions-header">
        <div className="container">
          <h1>Выставки</h1>
          <p>Ознакомьтесь с нашими текущими и предстоящими выставками.</p>
        </div>
      </div>

      <div className="exhibitions-content section">
        <div className="container">
          {loading ? (
            <div className="loading">Загрузка выставок...</div>
          ) : exhibitions.length === 0 ? (
            <div className="no-exhibitions">
              <p>На данный момент выставок нет.</p>
            </div>
          ) : (
            <>
              <div className="exhibitions-grid">
                {exhibitions.map(exhibition => (
                  <div key={exhibition.id} className="exhibition-item">
                    <ExhibitionCard exhibition={exhibition} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Предыдущий
                  </button>
                  
                  <div className="pagination-pages">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        className={`pagination-page ${page === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    className="pagination-btn"
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Следующий
                  </button>
                </div>
              )}
              
              <div className="exhibitions-count">
                 {totalCount} выставок
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExhibitionsPage;
  