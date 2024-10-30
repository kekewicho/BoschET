import React from "react";

export const Modal = ({ title, children, idRef, styles }) => {
    return (
        <div className="modal" tabIndex="-1" id={ idRef }>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div id="updateForm" className="modal-body" style={{ paddingInline: "35px", height: '60vh', overflowY: "scroll" }} >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}