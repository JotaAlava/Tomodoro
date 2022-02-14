import React from "react";
import PropTypes from "prop-types";

const ContextCreateButton = ({ onClick }) => {
  return (
    <button className="btn btn-primary" onClick={() => onClick()}>
      New Context
    </button>
  );
};

ContextCreateButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ContextCreateButton;
