import React from 'react';

export default function Modal({ title, onClose, onSave, saveLabel = 'Сохранить', children, wide }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={wide ? { width: 680 } : {}}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn btn-icon" onClick={onClose}>✕</button>
        </div>
        {children}
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Отмена</button>
          <button className="btn btn-primary" onClick={onSave}>{saveLabel}</button>
        </div>
      </div>
    </div>
  );
}
