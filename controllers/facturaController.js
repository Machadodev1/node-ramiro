const VALOR_DIA = 35000;
const TIPOS_ALQUILER = new Set(["ciudad", "fuera", "establecimiento"]);

const generarIdCliente = () => {
    return "CLI-" + Date.now();
};

const mostrarInicio = (req, res) => {
    res.render("index", {
        error: null,
        formData: {}
    });
};

const redondear = (valor) => {
    return Math.round(valor * 100) / 100;
};

const normalizarNumero = (valor) => {
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : NaN;
};

const calcularFactura = (req, res) => {
    const formData = { ...req.body };

    let {
        cantidadEquipos,
        diasIniciales,
        diasAdicionales,
        tipoAlquiler,
        nombreCliente,
        correoCliente
    } = req.body;

    cantidadEquipos = normalizarNumero(cantidadEquipos);
    diasIniciales = normalizarNumero(diasIniciales);
    diasAdicionales = normalizarNumero(diasAdicionales);

    const nombreLimpio = String(nombreCliente || "").trim();
    const correoLimpio = String(correoCliente || "").trim();

    if (!nombreLimpio) {
        return res.render("index", {
            error: "Debe ingresar el nombre del cliente.",
            formData
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoLimpio || !emailRegex.test(correoLimpio)) {
        return res.render("index", {
            error: "Debe ingresar un correo electrónico válido para cargar la factura.",
            formData
        });
    }

    if (!Number.isInteger(cantidadEquipos) || cantidadEquipos < 2) {
        return res.render("index", {
            error: "Debe alquilar mínimo 2 equipos.",
            formData
        });
    }

    if (!Number.isInteger(diasIniciales) || diasIniciales < 1) {
        return res.render("index", {
            error: "Debe indicar al menos 1 día inicial de alquiler.",
            formData
        });
    }

    if (!Number.isInteger(diasAdicionales) || diasAdicionales < 0) {
        return res.render("index", {
            error: "Los días adicionales deben ser un número entero igual o mayor a 0.",
            formData
        });
    }

    if (diasAdicionales > diasIniciales) {
        return res.render("index", {
            error: "Los días adicionales no pueden superar los días iniciales de alquiler.",
            formData
        });
    }

    if (!TIPOS_ALQUILER.has(tipoAlquiler)) {
        return res.render("index", {
            error: "Debe seleccionar una opción de alquiler válida.",
            formData
        });
    }

    const subtotal = cantidadEquipos * diasIniciales * VALOR_DIA;

    let total = subtotal;
    let mensaje = "Sin descuentos ni incrementos.";
    let incremento = 0;
    let descuento = 0;

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

    let descuentoDias = 0;
    let valorDiasExtra = 0;
    let porcentajeDias = 0;

    if (diasAdicionales > 0) {
        valorDiasExtra = cantidadEquipos * diasAdicionales * VALOR_DIA;
        porcentajeDias = 0.02;
        descuentoDias = valorDiasExtra * porcentajeDias;

        total += valorDiasExtra;
        total -= descuentoDias;
    }

    total = redondear(total);
    incremento = redondear(incremento);
    descuento = redondear(descuento);
    descuentoDias = redondear(descuentoDias);

    const idCliente = generarIdCliente();

    res.render("resultado", {
        idCliente,
        nombreCliente: nombreLimpio,
        correoCliente: correoLimpio,
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
