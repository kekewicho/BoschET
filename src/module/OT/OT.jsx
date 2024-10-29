import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.js";
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from "./OT.module.css"
import { FloatingBtn } from "../../components/FloatingBtn";

import { NavBar } from "../../components/NavBar";

export const OT = () => {
    document.title = `BOSCH | Órdenes`;

    const [ot, setOt] = useState([]);
    const [mat, setMat] = useState([]);
    const [pla, setPla] = useState([]);
    const [selectedOT, setSelectedOT] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchParams, setSearchParams] = useState({});

    useEffect(() => {
        fetch('/api/ordenes/')
            .then(r => r.json())
            .then(data => setOt(data))
            .catch(error => console.error("Fetch error:", error));

        fetch('/api/materiales/')
            .then(r => r.json())
            .then(data => setMat(data))
            .catch(error => console.error("Fetch error:", error));

        fetch('/api/plantilla/')
            .then(r => r.json())
            .then(data => {
                const sortedData = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
                setPla(sortedData);
            })
            .catch(error => console.error("Fetch error:", error));

    }, []);

    const ot_json = () => {
        const personalAsignado = selectedOT.personalAsignado?.map(persona => persona._id) || [];
        const data = {
            producto: selectedOT.producto,
            cantidad: selectedOT.cantidad,
            inicio: formatDate(selectedOT.inicio),
            final: formatDate(selectedOT.final),
            personalForecast: selectedOT.personalForecast ?? 0,
            personalAsignado: personalAsignado,
        }

        return data
    }

    function guardar() {

        let data = ot_json();


        if (selectedOT._id) {
            data = {
                ...data,
                _id: selectedOT._id
            }
        }

        console.log(data)

        // fetch('/api/ordenes/guardar', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data)
        // })
        //     .then(r => {
        //         window.location.reload();
        //     })
    }

    const eliminarOrden = (data) => {

        if (confirm(`¿Realmente deseas eliminar la OT de ${data.descripcion}?`)) {

            fetch(`/api/ordenes/${data._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(r => {
                    if (r.status == 200) {
                        alert("¡Orden eliminada con éxito!");
                        window.location.reload();
                    } else {
                        console.log("Error en la eliminacion.")
                    }
                })

        }
    };

    function forecast() {
        console.log(ot_json())
        fetch('/api/ordenes/previsionForecast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ot_json()),
        })
            .then(r => {
                console.log("");
            })
            .catch(error => console.error(error));
    }


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedOT((prev) => ({
            ...prev,
            [name]: value,
        }));

        const { producto, cantidad, inicio, final } = selectedOT;
        if (producto && cantidad && inicio && final) {
            forecast();
        };
    };

    useEffect(() => {
        const results = pla.filter(persona =>
            persona.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !selectedOT.personalAsignado?.some(asignado => asignado._id === persona._id)
        );
        setFilteredResults(results);
    }, [searchTerm, pla, selectedOT]);

    const addColaborador = (persona) => {
        setSelectedOT((prev) => ({
            ...prev,
            personalAsignado: [...(prev.personalAsignado || []), persona],
        }));
        setSearchTerm(''); // Limpiar el término de búsqueda después de agregar
    };


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
                            <input type="text" className="form-control" placeholder="Ingresa colaborador o material" />
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
                                {ot && ot.map(o => (
                                    <tr key={o._id}>
                                        <td style={{ textAlign: "center" }}>
                                            <i value={o.status} className={`bi ${o.status === 0 ? "bi-clock-history" : o.status === 1 ? "bi-gear-wide-connected" : "bi-check-circle-fill"} ${styles.statusicon}`}></i>
                                        </td>
                                        <td>{o.inicio} - {o.final}</td>
                                        <td>{o.descripcion}</td>
                                        <td style={{ textAlign: "center" }}>{o.personalAsignado.length}</td>
                                        <td>
                                            <button className="btn bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false"></button>
                                            <ul className="dropdown-menu">
                                                <li><button className="btn dropdown-item" data-bs-toggle="modal" data-bs-target="#detallesModal" onClick={() => setSelectedOT(o)}>Ver detalles</button></li>
                                                <li><button className="btn dropdown-item text-danger" value={o} onClick={() => eliminarOrden(o)}>Eliminar</button></li>
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
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
                        <div className="modal-body" style={{ paddingInline: "35px", height: '60vh', overflowY: "scroll" }} >
                            <div className="container">
                                <div className="row">
                                    <div className="col-4 text-end">
                                        <h6>Producto a fabricar</h6>
                                    </div>
                                    <div className="col-8">
                                        <select className="form-select" value={selectedOT.producto ?? ''} name="producto" onChange={handleInputChange}>
                                            <option value="" defaultValue>Selecciona un material</option>
                                            {
                                                mat && mat.map(m => {
                                                    return <option key={m._id} value={m._id}>{m.descripcion}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-4 text-end">
                                        <h6>Fecha de fabricación</h6>
                                    </div>
                                    <div className="col-3">
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            name="inicio"
                                            value={selectedOT.inicio || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    -
                                    <div className="col-3">
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            name="final"
                                            value={selectedOT.final || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-4 text-end">
                                        <h6>Cantidad fabricada</h6>
                                    </div>
                                    <div className="col-4">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="cantidad"
                                            value={selectedOT.cantidad || 0}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <br />
                                <div className={styles.separator}>Gestión del personal</div>
                                <div className="row">
                                    <div className="col-6">
                                        <p><b>{selectedOT.personalAsignado?.length || 0}</b> personas asignadas actualmente</p>
                                    </div>
                                    <div className="col-6 text-end">
                                        <p><b className="text-danger">{selectedOT.personalForecast || 0}</b> personas previstas en forecast</p>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Buscar colaborador para asignar"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        {searchTerm && filteredResults.length > 0 && (
                                            <ul className="list-group position-absolute" style={{ zIndex: 1000 }}>
                                                {filteredResults.map(persona => (
                                                    <li
                                                        key={persona._id}
                                                        className="list-group-item list-group-item-action"
                                                        onClick={() => addColaborador(persona)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {persona.nombre}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    {selectedOT && selectedOT.personalAsignado?.map(p => (
                                        <div className="col-4 mb-3" key={p.id}>
                                            <div className="card p-2 text-center">
                                                <img src={p.foto} className="card-img-top rounded-circle mx-auto" alt="Foto de colaborador" style={{ width: "80px", height: "80px" }} />
                                                <div className="card-body">
                                                    <p className="card-text">{p.nombre}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <br />
                                <div className="row">
                                    <button className={`btn actionBtn`} onClick={guardar}>Guardar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FloatingBtn
                innerTxt="Nueva OT"
                classes="bi bi-plus-lg actionBtn"
                modal="#detallesModal"
            />
        </>
    );
}
