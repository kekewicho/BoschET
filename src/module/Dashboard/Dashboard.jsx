import React, { useEffect, useState, useSyncExternalStore } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.js";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getDefaultDate, sum, mean, dropDuplicates, wmape } from "../../utils";
import { Modal } from "../../components/Modal";
import { KpiCard } from "../../components/KpiCard/KpiCard";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';

import { Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


import styles from "./Dashboard.module.css"

import { NavBar } from "../../components/NavBar";

export const Dashboard = () => {
    document.title = `BOSCH | Dashboard`;
    const { today, pastDate } = getDefaultDate();


    const [ot, setOt] = useState();
    const [mat, setMat] = useState();
    const [pla, setPla] = useState();
    const [granularidad, setGranularidad] = useState('dia')
    const [searchArgs, setSearchArgs] = useState({
        'fechaInicial': pastDate,
        'fechaFinal': today
    });
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Personal Asignado',
                data: [],
            },
            {
                label: 'Personal Forecast',
                data: [],
            },
        ],
    });



    const groupedData = ot?.reduce((acc, order) => {
        const period = granularidad == 'dia' ? order.inicio.slice(0, 10) : order.inicio.slice(0, 7);
        if (!acc[period]) {
            acc[period] = {
                personalAsignado: 0,
                personalForecast: 0,
            };
        }
        acc[period].personalAsignado += order.personalAsignado;
        acc[period].personalForecast += order.personalForecast;
        return acc;
    }, {});

    useEffect(() => {
        const queryString = new URLSearchParams(searchArgs).toString();
        fetch(`/api/ordenes/?${queryString}&details=0`)
            .then(r => r.json())
            .then(data => setOt(data))
            .catch(error => console.error("Fetch error:", error));

        fetch('/api/materiales/')
            .then(r => r.json())
            .then(data => setMat(data))
            .catch(error => console.error("Fetch error:", error));

    }, []);


    function updateRangosFecha({ from, to }) {
        setSearchArgs({
            ...searchArgs,
            fechaInicial: from && `${String(from.year).padStart(2, "0")}-${String(from.month).padStart(2, "0")}-${String(from.day).padStart(2, "0")}`,
            fechaFinal: to && `${String(to.year).padStart(2, "0")}-${String(to.month).padStart(2, "0")}-${String(to.day).padStart(2, "0")}`
        })
    }

    useEffect(() => {
        const queryString = new URLSearchParams(searchArgs).toString();

        fetch(`/api/ordenes/?${queryString}&details=0`)
            .then(res => res.json())
            .then(res => {
                setOt(res);
            })

    }, [searchArgs])

    const sorted = groupedData && Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b))

    return (
        <>
            <NavBar />
            <br />
            <iframe style={{ width:'100%', height:'90vh' }} title="Dashboard" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiNmZmMGY1ZGMtMjhlYS00MWY0LWE2MzQtNmIyZTJiZDI0YTBkIiwidCI6ImY5NGJmNGQ5LTgwOTctNDc5NC1hZGY2LWE1NDY2Y2EyODU2MyIsImMiOjR9" frameborder="0" allowFullScreen="true"></iframe>
            <div className="container">
                {/* <div className="row">
                    <div className="col-4">
                        <h3>Visualizar tendencias de fabricación</h3>
                    </div>
                    <div className="col-sm-3">
                        <select name="" id="" className="form-select" onChange={(e) => { setSearchArgs({ ...searchArgs, material: e.target.value }) }}>
                            <option value="">Todos los materiales</option>
                            {
                                mat && mat.map(m => {
                                    return (
                                        <option value={m._id}>{m.descripcion}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="col-sm-5 d-flex justify-content-end">
                        <button
                            style={{ marginRight: '15px' }}
                            className="btn bi bi-calendar-range-fill cardBtn"
                            data-bs-toggle="modal"
                            data-bs-target="#fechaModal">
                            &nbsp;&nbsp;{searchArgs.fechaInicial?.slice(0, 10) || '*'} - {searchArgs.fechaFinal?.slice(0, 10) || '*'}
                        </button>
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <button type="button" value="dia" onClick={(e) => setGranularidad(e.target.value)} class={`btn ${granularidad == 'dia' ? 'btn-success' : 'cardBtn'}`}>Datos / Día</button>
                            <button type="button" value="mes" onClick={(e) => setGranularidad(e.target.value)} class={`btn ${granularidad == 'mes' ? 'btn-success' : 'cardBtn'}`}>Datos / Mes</button>
                        </div>
                    </div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="col-9" style={{ height:'500px' }}>
                        {ot && <Line data={{
                            labels: sorted,
                            datasets: [
                                {
                                    label: 'Personal Asignado',
                                    data: sorted.map(label => groupedData[label].personalAsignado),
                                    borderColor: 'rgba(75,192,192,1)',
                                    fill: false,
                                },
                                {
                                    label: 'Personal Forecast',
                                    data: sorted.map(label => groupedData[label].personalForecast),
                                    borderColor: 'rgba(255,99,132,1)',
                                    fill: false,
                                },
                            ],
                        }} />}
                    </div>
                        <div className="col-sm-3" style={{ overflowY:'auto', height:'500px' }}>
                            {ot &&
                                <>
                                    <KpiCard
                                        bootstrapIcon=""
                                        value={sum(ot, 'cantidad')}
                                        valuePrefix=""
                                        caption={"Piezas fabricadas"}
                                        comparisson={
                                            mean(ot, 'cantidad')
                                        }
                                        comparissonCaption={"pz. promedio / OT"} />
    
                                    <KpiCard
                                        bootstrapIcon=""
                                        value={ot.length || 0}
                                        valueInt
                                        valuePrefix=""
                                        caption={"Órdenes de trabajo"}
                                        />
    
                                    <KpiCard
                                        bootstrapIcon=""
                                        value={dropDuplicates(ot, ['producto']).length}
                                        valuePrefix=""
                                        valueInt
                                        caption={"Materiales producidos"}
                                        />
    
                                    <KpiCard
                                        bootstrapIcon=""
                                        value={wmape(ot, 'personalAsignado','personalForecast')}
                                        valuePrefix=""
                                        valueSufix="%"
                                        caption={"WMAPE Forecast vs Real"}/>
    
                                </>}
                        </div>
                </div> */}
            </div>
            {/* <Modal
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
            </Modal> */}
        </>
    );
}
