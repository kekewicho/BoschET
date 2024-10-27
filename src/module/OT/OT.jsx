import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.js";
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from "./OT.module.css"

import { NavBar } from "../../components/NavBar";
import { CardButton } from "../../components/CardButton";


export const OT = () => {
    document.title = `BOSCH | Órdenes`;

    return (
        <>
            <NavBar />
            <br />
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h5>Producción por órdenes de trabajo</h5>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-5">
                        <div className="input-group">
                            <span className="input-group-text bi bi-search" id="basic-addon1"></span>
                            <input type="text" className="form-control" field="user" placeholder="Ingresa colaborador o material" />
                        </div>
                    </div>
                    <div className="col-md-4"></div>
                    <div className="col-md-3 d-flex justify-content-end">
                        <button
                            style={{ width:'100%' }}
                            className="btn bi bi-calendar-range-fill cardBtn"
                            data-bs-toggle="modal"
                            data-bs-target="#fechaModal">
                            &nbsp;&nbsp;Seleccionar fechas
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button value="false" className="optionBtn">Solo OT terminadas</button>
                    </div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="col-md-12">
                        <table className="table">
                            <thead>
                                <tr>
                                    <td>Fecha de producción</td>
                                    <td>Material</td>
                                    <td>Personal requerido</td>
                                    <td>Status</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}