import React from "react";

export const CardButton = ({ children }) => {
    return (
        <button className="btn bi" style={{ backgroundColor:'gray' }}>
            {children}
        </button>
    )
}