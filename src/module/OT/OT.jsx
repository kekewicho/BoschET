import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.js";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FloatingBtn } from "../../components/FloatingBtn";
import { formatDate, calcularHoras, getDefaultDate } from "../../utils";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import { Modal } from "../../components/Modal";
import styles from "./OT.module.css"

import { NavBar } from "../../components/NavBar";

export const OT = () => {
    document.title = `BOSCH | Órdenes`;
    const { today, pastDate } = getDefaultDate();

    
    
    const [ot, setOt] = useState([]);
    const [mat, setMat] = useState([]);
    const [pla, setPla] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOT, setSelectedOT] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchArgs, setSearchArgs] = useState({
        'fechaInicial': pastDate,
        'fechaFinal': today
    });
    
    const itemsPerPage = 20;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = ot.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(ot.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }


    useEffect(() => {
        setLoading(true);
        const queryString = new URLSearchParams(searchArgs).toString();
        
        fetch(`/api/ordenes/?${queryString}`)
        .then(res => res.json())
        .then(res => {
            setOt(res);
            setLoading(false);
        })
        
    }, [searchArgs])
    
    useEffect(() => {
        const queryString = new URLSearchParams(searchArgs).toString();
        fetch(`/api/ordenes/?${queryString}`)
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


    function updateRangosFecha({ from, to }) {
        setSearchArgs({
            ...searchArgs,
            fechaInicial: from && `${String(from.year).padStart(2, "0")}-${String(from.month).padStart(2, "0")}-${String(from.day).padStart(2, "0")}`,
            fechaFinal: to && `${String(to.year).padStart(2, "0")}-${String(to.month).padStart(2, "0")}-${String(to.day).padStart(2, "0")}`
        })
    }

    const ot_json = () => {
        const personalAsignado = selectedOT.personalAsignado?.map(persona => persona._id) || [];
        const data = {
            producto: selectedOT.producto,
            cantidad: parseInt(selectedOT.cantidad),
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
                id: selectedOT._id
            }
        }


        fetch('/api/ordenes/guardar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(r => {
                window.location.reload();
            })
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const { producto, cantidad, inicio, final } = selectedOT;
        if (producto && cantidad && inicio && final) {

            let data = ot_json();


            fetch('/api/ordenes/previsionForecast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    [name]: value,
                    id: ""
                }),
            })
                .then(r => r.json())
                .then(r => {
                    setSelectedOT((prev) => ({
                        ...prev,
                        [name]: value,
                        personalForecast: r.forecast
                    }));
                })
        } else {
            setSelectedOT((prev) => ({
                ...prev,
                [name]: value,
            }));
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
        setSearchTerm('');
    };


    function eliminarColaborador(id) {
        const newColabs = selectedOT.personalAsignado.filter(ele=> id != ele._id)

        setSelectedOT({
            ...selectedOT,
            personalAsignado:newColabs
        })
    }

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
                            <input type="text" className="form-control" placeholder="Ingresa colaborador o material"
                                onChange={(e) => setSearchArgs({ ...searchArgs, searchString: e.target.value.toUpperCase() })} />
                        </div>
                    </div>
                    <div className="col-md-4">
                        {loading && <div className="spinner-border text-danger" role="status">
                        </div>}
                    </div>
                    <div className="col-md-3 d-flex justify-content-end">
                        <button
                            style={{ width: '100%' }}
                            className="btn bi bi-calendar-range-fill cardBtn"
                            data-bs-toggle="modal"
                            data-bs-target="#fechaModal">
                            &nbsp;&nbsp;{searchArgs.fechaInicial?.slice(0, 10) || '*'} - {searchArgs.fechaFinal?.slice(0, 10) || '*'}
                        </button>
                    </div>
                </div>
                <br /><br />
                <div className="d-flex justify-content-center">
                    <nav>
                        <ul className="pagination">
                            {pageNumbers.map(number => (
                                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                    <button onClick={() => paginate(number)} style={{ marginInline:'5px' }} className="btn actionBtn">
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
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
                                {currentItems && currentItems.map(o => (
                                    <tr key={o._id}>
                                        <td style={{ textAlign: "center" }}>
                                            <i value={o.status} className={`bi ${o.status === -1 ? "bi bi-exclamation-octagon-fill" : o.status === 0 ? "bi-clock-history" : o.status === 1 ? "bi-gear-wide-connected" : "bi-check-circle-fill"} ${styles.statusicon}`}></i>
                                        </td>
                                        <td>{o.inicio} - {o.final}</td>
                                        <td><b style={{ fontSize: '10pt' }}>[{o.cantidad.toLocaleString('en-us')} pz.]&nbsp;&nbsp;</b>{o.descripcion}</td>
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
            <Modal
                title="Detalles de OT"
                idRef="detallesModal">
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
                    {
                        selectedOT.inicio && selectedOT.final &&
                        <div className="row">
                            <div className="col-4"></div>
                            <div className="col-8">
                                <div className="form-text">
                                    Esta OT tomará {calcularHoras(selectedOT.inicio, selectedOT.final).toLocaleString('en-us')} horas para ser completada.
                                </div>
                            </div>
                        </div>
                    }
                    <br />
                    <div className="row">
                        <div className="col-4 text-end">
                            <h6>Cantidad fabricada</h6>
                        </div>
                        <div className="col-4">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Ingresa numeros positivos"
                                name="cantidad"
                                value={selectedOT.cantidad || 0}
                                onInput={(e) => {
                                    const value = Math.floor(e.target.value);
                                    e.target.value = value < 1 ? 1 : value;
                                }}
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
                            <div className="col-4 mb-3" key={p._id}>
                                <div className="card p-2 text-center">
                                    <img src={p.foto} className="card-img-top rounded-circle mx-auto" alt="Foto de colaborador" style={{ width: "80px", height: "80px" }} />
                                    <div className="card-body">
                                        <p className="card-text">{p.nombre}</p>
                                        <button className="btn text-danger" style={{ paddingBlock:'0px', marginTop:'-20px' }}
                                        onClick={()=>{eliminarColaborador(p._id)}}
                                        >Eliminar</button>
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
            </Modal>
            <FloatingBtn
                innerTxt="Nueva OT"
                classes="bi bi-plus-lg actionBtn"
                modal="#detallesModal"
                action={() => { setSelectedOT({}) }}
            />
            <Modal
                title="Seleccionar rango de fechas a consultar"
                idRef="fechaModal"
                styles={{ display: 'flex', justifyContent: 'center', padding: 0 }}>
                <Calendar
                    value={{
                        from: searchArgs.fechaInicial && {
                            year: parseInt(searchArgs.fechaInicial.slice(0, 4)),
                            month: parseInt(searchArgs.fechaInicial.slice(5, 7)),
                            day: parseInt(searchArgs.fechaInicial.slice(8, 10))
                        },
                        to: searchArgs.fechaFinal && {
                            year: parseInt(searchArgs.fechaFinal.slice(0, 4)),
                            month: parseInt(searchArgs.fechaFinal.slice(5, 7)),
                            day: parseInt(searchArgs.fechaFinal.slice(8, 10))
                        }
                    }}
                    onChange={updateRangosFecha}
                    shouldHighlightWeekends
                    calendarClassName={styles.calendar}
                    calendarSelectedDayClassName={styles.calendarSelectedDay}
                />
            </Modal>
        </>
    );
}
