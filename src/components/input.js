import React from 'react';

const InputBox = ({ name, type, id, value, placeholder, icon }) => {
  return (
    <div className="position-relative mx-auto w-50 mb-4">
      <div className="input-group">
      <div className="input-group-prepend">
          <span className="input-group-text input-icon">{icon}</span>
        </div>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={value}
          id={id}
          className="form-control border-1 rounded shadow-none input-box"
        />
        
      </div>
    </div>
  );
};

export default InputBox;
