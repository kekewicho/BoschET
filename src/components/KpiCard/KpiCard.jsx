import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.js";

import styles from "./KpiCard.module.css"


export const KpiCard = ({ ...props }) => {
    const formattedNumber = (number) => {
        return number.toLocaleString('en', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2

        })
    }


    return (
        <div className={`${styles.kpiCard} bi ${props.bootstrapIcon}`}>
            <div>
                <h3>{props.valuePrefix ?? ''} {props.valueInt ? props.value : formattedNumber(props.value)} {props.valueSufix}</h3>
                <p>{props.caption}</p>
                {props.comparisson && <p
                    style={{ color: props.comparisson >= 0 ? 'green' : 'red' }}
                    >&nbsp;{formattedNumber(props.comparisson)} {props.comparissonPercent? '%':'' } {props.comparissonCaption}</p>}
            </div>
        </div>
    )
}