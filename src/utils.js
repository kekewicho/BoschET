export const calcularHoras = (iniciox, finalx) => {
    const inicio = new Date(iniciox);
    const final = new Date(finalx);

    const diferenciaMilisegundos = final - inicio;
    const horas = diferenciaMilisegundos / (1000 * 60 * 60);

    return horas >= 0 ? horas : 0;
};


export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};


export function getDefaultDate() {
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const today = new Date();
    today.setDate(today.getDate() + 1);
    const todayFormatted = formatDate(today) + " 23:59";

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 2);
    const pastDateFormatted = formatDate(pastDate) + " 00:00";

    return {
        today: todayFormatted,
        pastDate: pastDateFormatted
    };
}


export const sum = (data, key) => {
    return data ? data.reduce((sumatoria, d) => sumatoria + d[key], 0) : 0;
}

export const mean = (data, key) => {
    const suma = sum(data, key)

    return suma / data.length
}


export const dropDuplicates = (data, keys) => {
    return data
        .map(item =>
            keys.reduce((acc, key) => {
                acc[key] = item[key];
                return acc;
            }, {})
        )
        .filter((value, index, self) =>
            index === self.findIndex(v =>
                keys.every(key => v[key] === value[key])
            )
        );
}


export function wmape(data, real, pred) {
    if (!data.length) return 0;

    const { absErrorSum, realSum } = data.reduce((acc, item) => {
        acc.absErrorSum += Math.abs(item[real] - item[pred]);
        acc.realSum += Math.abs(item[real]);
        return acc;
    }, { absErrorSum: 0, realSum: 0 });

    return realSum === 0 ? 0 : (absErrorSum / realSum) * 100;
}
