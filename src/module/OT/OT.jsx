import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.js";
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from "./OT.module.css"

import { NavBar } from "../../components/NavBar";
import { CardButton } from "../../components/CardButton";


export const OT = () => {
    document.title = `BOSCH | Órdenes`;

    const [ot, setOt] = useState([])

    useEffect(() => {
        fetch('/api/ordenes/')
            .then(r => {
                return r.json();
            })
            .then(data => {
                setOt(data);
            })
            .catch(error => console.error("Fetch error:", error));
    }, []);


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
                            style={{ width: '100%' }}
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
                                    <td style={{ textAlign: "center" }}>Status</td>
                                    <td>Fecha de producción</td>
                                    <td>Material</td>
                                    <td style={{ textAlign: "center" }}>Personal asignado</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ot && ot.map(o => {
                                        return (
                                            <tr key={o._id}>
                                                <td style={{ textAlign: "center" }}>
                                                    <i value={o.status} className={`bi ${o.status == 0 ? "bi-clock-history"
                                                        : o.status == 1 ? "bi-gear-wide-connected"
                                                            : "bi-check-circle-fill"
                                                        } ${styles.statusicon}`}></i>
                                                </td>
                                                <td>{o.inicio} - {o.final}</td>
                                                <td>{o.descripcion}</td>
                                                <td style={{ textAlign: "center" }}>{o.personalAsignado.length}</td>
                                                <td>
                                                    <button className="btn bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></button>
                                                    <ul class="dropdown-menu">
                                                        <li><btn class="btn dropdown-item" data-bs-toggle="modal" data-bs-target="#detallesModal">Ver detalles</btn></li>
                                                        <li><btn class="btn dropdown-item text-danger">Eliminar</btn></li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="modal" tabIndex="-1" id="detallesModal">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Detalles de OT</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div id="updateForm" className="modal-body" style={{ paddingInline: "35px", height: '60vh', overflowY: "scroll" }} >
                            <div className="container">
                                <div className="row">
                                    <div className="col-4 text-end">
                                        <h6>Producto a fabricar</h6>
                                    </div>
                                    <div className="col-8">
                                        <input type="text" className="form-control" />
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-4 text-end">
                                        <h6>Fecha de fabricación</h6>
                                    </div>
                                    <div className="col-4">
                                        <input type="text" className="form-control" />
                                    </div>
                                    -
                                    <div className="col">
                                        <input type="text" className="form-control" />
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-4 text-end">
                                        <h6>Cantidad fabricada</h6>
                                    </div>
                                    <div className="col-4">
                                        <input type="text" className="form-control" />
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-4 text-end">
                                        <h6>Personal previsto en forecast</h6>
                                    </div>
                                    <div className="col-8">
                                        <h6><span className="text-danger">6</span> colaboradores requeridos para completar esta OT</h6>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-4 text-end">
                                        <h6>Personal asignado</h6>
                                    </div>
                                    <div className="col-8">
                                        <div class="accordion accordion-flush" id="accordionFlushExample">
                                            <div class="accordion-item">
                                                <button class="btn collapsed text-start" style={{ marginTop: "-10px", fontWeight:'500', paddingLeft:'0px' }} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                                    <span className="text-danger">7</span> colaboradores asignados a esta órden de trabajo&nbsp;&nbsp;<i class="bi bi-caret-down-fill"></i><br />
                                                </button>
                                                <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                                    <div class="accordion-body">
                                                        <ul></ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}