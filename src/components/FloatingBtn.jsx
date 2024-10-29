import React, { useState } from "react";

export const FloatingBtn = ({ innerTxt, classes, action, modal }) => {

  const styles = {
    borderRadius: '10px',
    height: '40px',
    width: 'fit-content',
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    color: 'white',
    border: 'none',
    textAlign: 'center',
  };

  return (
    <button
        className={classes}
        style={styles}
        onClick={action}
        data-bs-toggle="modal"
        data-bs-target={modal}
    >
      &nbsp;{innerTxt}
    </button>
  );
};