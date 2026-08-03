const VALOR_DIA = 35000;

const generarIdCliente = () => {
    return "CLI-" + Date.now();
};

const mostrarInicio = (req, res) => {
    res.render("index");
};

const redondear = (valor) => {
    return Math.round(valor * 100) / 100;
};

const calcularFactura = (req, res) => {

    let {
        cantidadEquipos,
        diasIniciales,
        diasAdicionales,
        tipoAlquiler
    } = req.body;

    cantidadEquipos = Number(cantidadEquipos);
    diasIniciales = Number(diasIniciales);
    diasAdicionales = Number(diasAdicionales);

    if (!cantidadEquipos || cantidadEquipos < 2) {
        return res.send("Debe alquilar mínimo 2 equipos.");
    }

    if (!diasIniciales || diasIniciales < 1) {
        return res.send("Debe indicar al menos 1 día inicial de alquiler.");
    }

    if (diasAdicionales < 0) {
        diasAdicionales = 0;
    }

    // --- Valor base (alquiler inicial) ---
    const subtotal = cantidadEquipos * diasIniciales * VALOR_DIA;

    let total = subtotal;
    let mensaje = "Sin descuentos ni incrementos.";
    let incremento = 0;
    let descuento = 0;

    // --- Opción de alquiler ---
    if (tipoAlquiler === "fuera") {
        incremento = subtotal * 0.05;
        total += incremento;
        mensaje = "Incremento del 5% por servicio fuera de la ciudad.";
    }

    if (tipoAlquiler === "establecimiento") {
        descuento = subtotal * 0.05;
        total -= descuento;
        mensaje = "Descuento del 5% por alquiler dentro del establecimiento.";
    }

    // --- Días adicionales ---
    // Regla mejorada para que la empresa no quiebre:
    // El descuento por día adicional es 2% SOLO sobre el valor de los días adicionales,
    // comienza desde el segundo día adicional y queda limitado a un máximo de 5%.
    // Esto evita que los descuentos acumulados superen el margen de ganancia.
    let descuentoDias = 0;
    let valorDiasExtra = 0;
    let porcentajeDias = 0;

    if (diasAdicionales > 0) {
        valorDiasExtra = cantidadEquipos * diasAdicionales * VALOR_DIA;

        // Porcentaje de descuento por día adicional (2% a partir del 2º día)
        const diasConDescuento = Math.max(0, diasAdicionales - 1);
        porcentajeDias = diasConDescuento * 0.02;

        // Tope máximo del 5% sobre los días adicionales para no perder ganancia
        if (porcentajeDias > 0.05) {
            porcentajeDias = 0.05;
        }

        descuentoDias = valorDiasExtra * porcentajeDias;

        total += valorDiasExtra;
        total -= descuentoDias;
    }

    // Redondeo final
    total = redondear(total);
    incremento = redondear(incremento);
    descuento = redondear(descuento);
    descuentoDias = redondear(descuentoDias);

    const idCliente = generarIdCliente();

    res.render("resultado", {
        idCliente,
        cantidadEquipos,
        diasIniciales,
        diasAdicionales,
        tipoAlquiler,
        subtotal,
        valorDiasExtra,
        incremento,
        descuento,
        descuentoDias,
        porcentajeDias,
        mensaje,
        total
    });
};

export default {
    mostrarInicio,
    calcularFactura
};
