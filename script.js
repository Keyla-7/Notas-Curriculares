const materiasPorAnio = {
    "1° Año": [
        "Problemática Socio / Cultural",
        "Talleres de Comunicación",
        "Morfología Dinámica",
        "Bases Físico / Químicas",
        "Salud Pública, Estado y Sociedad",
        "Aspectos Psico/Socio/Culturales del Desarrollo",
        "Fundamentos de Enfermería",
        "Enfermería Comunitaria",
        "Práctica Profesionalizante I"
    ],
    "2° Año": [
        "Inglés Técnico",
        "Metodología de la Investigación",
        "Epidemiología y Bioestadística",
        "Microbiología, Parasitología e Inmunología",
        "Farmacología",
        "Nutrición y Dietoterapia",
        "Psicología Social e Institucional",
        "Educación para la Salud",
        "Enfermería del Adulto",
        "Práctica Profesionalizante II",
        "Práctica Profesionalmente ?"
    ],
    "3° Año": [
        "Ética y Legislación Profesional",
        "Gestión y Autogestión de Enfermería",
        "Enfermería Materno / Infantil",
        "Enfermería Infanto / Juvenil",
        "Enfermería de Salud Mental y Psiquiátrica",
        "Cuidados Críticos y Emergentología",
        "Práctica Profesionalizante III"
    ]
};

const contenedor = document.getElementById("contenedor-materias");

Object.entries(materiasPorAnio).forEach(([anio, materias]) => {
    const bloque = document.createElement("div");
    bloque.className = "año";
    bloque.innerHTML = `<h2>🎓 ${anio}</h2>`;

    materias.forEach((nombre) => {
        const id = `${anio}-${nombre}`.replace(/\s+/g, "-");

        const materia = document.createElement("div");
        materia.className = "materia";
        materia.innerHTML = `
            <h3>📌 ${nombre}</h3>
            <div class="notas">
                <div class="notas-row">
                    <label>Parcial 1: <input type="number" min="0" max="100" data-type="parcial1" data-id="${id}"></label>
                    <label>Parcial 2: <input type="number" min="0" max="100" data-type="parcial2" data-id="${id}"></label>
                    <label>Final: 
                        <input type="number" min="0" max="100" data-type="final" data-id="${id}" id="final-${id}">
                    </label>
                    <label class="select-promociona">Promociona:
                        <select data-type="promociona" data-id="${id}" id="promo-${id}" onchange="marcarPromocion('${id}')">
                            <option value="">-</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </label>
                </div>
                <strong>Trabajos Prácticos:</strong>
                <div class="tp-grid" id="tp-grid-${id}"></div>
                <button onclick="agregarTP('${id}')">➕ Agregar TP</button>
                <p class="promedio-tp">Promedio TP: <span id="promedio-${id}">-</span></p>
            </div>
        `;

        bloque.appendChild(materia);
    });

    contenedor.appendChild(bloque);
});

function agregarTP(id, valorInicial = "") {
    const grid = document.getElementById(`tp-grid-${id}`);
    const contenedorTP = document.createElement("div");
    contenedorTP.className = "tp-item";
    contenedorTP.style.display = "flex";
    contenedorTP.style.alignItems = "center";

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "100";
    input.value = valorInicial;
    input.addEventListener("input", () => {
        guardarNotas();
        calcularPromedioTP(id);
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "🗑️";
    btnEliminar.style.marginLeft = "5px";
    btnEliminar.style.background = "transparent";
    btnEliminar.style.border = "none";
    btnEliminar.style.cursor = "pointer";
    btnEliminar.addEventListener("click", () => {
        contenedorTP.remove();
        guardarNotas();
        calcularPromedioTP(id);
    });

    contenedorTP.appendChild(input);
    contenedorTP.appendChild(btnEliminar);
    grid.appendChild(contenedorTP);
    guardarNotas();
}

function marcarPromocion(id) {
    const select = document.getElementById(`promo-${id}`);
    const inputFinal = document.getElementById(`final-${id}`);
    if (select.value === "si") {
        inputFinal.style.textDecoration = "line-through";
        inputFinal.disabled = true;
    } else {
        inputFinal.style.textDecoration = "none";
        inputFinal.disabled = false;
    }
    guardarNotas();
}

function calcularPromedioTP(id) {
    const grid = document.getElementById(`tp-grid-${id}`);
    const inputs = grid.querySelectorAll("input");
    const valores = Array.from(inputs).map(i => parseFloat(i.value)).filter(v => !isNaN(v));
    const promedio = valores.length ? (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1) : "-";
    document.getElementById(`promedio-${id}`).textContent = promedio;
}

function guardarNotas() {
    const datos = {};

    // Guardar inputs
    document.querySelectorAll("input").forEach(input => {
        datos[input.dataset.id + "-" + input.dataset.type] = input.value;
    });

    // Guardar selects
    document.querySelectorAll("select").forEach(select => {
        datos[select.dataset.id + "-" + select.dataset.type] = select.value;
    });

    // Guardar TPs
    document.querySelectorAll(".tp-grid").forEach(grid => {
        const id = grid.id.replace("tp-grid-", "");
        datos[id + "-tp"] = Array.from(grid.querySelectorAll("input")).map(i => i.value);
    });

    localStorage.setItem("notasEnfermeria", JSON.stringify(datos));
}

function cargarNotas() {
    const datos = JSON.parse(localStorage.getItem("notasEnfermeria") || "{}");

    // Cargar inputs
    document.querySelectorAll("input").forEach(input => {
        const valor = datos[input.dataset.id + "-" + input.dataset.type];
        if (valor !== undefined) input.value = valor;
    });

    // Cargar selects (como "promociona")
    document.querySelectorAll("select").forEach(select => {
        const valor = datos[select.dataset.id + "-" + select.dataset.type];
        if (valor !== undefined) {
            select.value = valor;
            if (select.dataset.type === "promociona") {
                marcarPromocion(select.dataset.id);
            }
        }
    });

    // Cargar trabajos prácticos
    Object.keys(datos).forEach(key => {
        if (key.endsWith("-tp")) {
            const id = key.replace("-tp", "");
            datos[key].forEach(valor => {
                agregarTP(id, valor);
            });
        }
    });
}

window.addEventListener("load", cargarNotas);
                                       
