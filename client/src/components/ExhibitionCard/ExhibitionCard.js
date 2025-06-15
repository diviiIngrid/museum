import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';
import './ExhibitionCard.css';

const ExhibitionCard = ({ exhibition }) => {
  const { id, title, short_description, image_url, start_date, end_date, ticket_price } = exhibition;
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  return (
    <div className="exhibition-card">
      <div className="exhibition-card-image">
        <img src={`${process.env.REACT_APP_API_URL.replace('/api', '')}/${image_url}`} alt={title} />
      </div>
      <div className="exhibition-card-content">
        <h3>{title}</h3>
        <p className="exhibition-dates">
          <FaCalendarAlt />
          <span>{formatDate(start_date)} - {formatDate(end_date)}</span>
        </p>
        <p className="exhibition-price">
          <FaTicketAlt />
          <span>₽{ticket_price}</span>
        </p>
        <p className="exhibition-description">{short_description}</p>
        <Link to={`/exhibitions/${id}`} className="btn btn-primary">Больше деталей</Link>
      </div>
    </div>
  );
};

export default ExhibitionCard;
  