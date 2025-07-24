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
        const id = `${anio}-${nombre}`.replace(/\\s+/g, "-");

        const materia = document.createElement("div");
        materia.className = "materia";
        materia.innerHTML = `
            <h3>📌 ${nombre}</h3>
            <div class="notas">
                <label>Parcial 1: <input type="number" min="0" max="100" data-type="parcial1" data-id="${id}"></label>
                <label>Parcial 2: <input type="number" min="0" max="100" data-type="parcial2" data-id="${id}"></label>
                <label>Final: <input type="number" min="0" max="100" data-type="final" data-id="${id}"></label>
                <br>
                <strong>Trabajos Prácticos:</strong>
                <div class="tp-grid" id="tp-grid-${id}"></div>
                <button onclick="agregarTP('${id}')">➕ Agregar TP</button>
                <p>Promedio TP: <span id="promedio-${id}">-</span></p>
            </div>
        `;

        bloque.appendChild(materia);
    });

    contenedor.appendChild(bloque);
});

function agregarTP(id) {
    const grid = document.getElementById(`tp-grid-${id}`);
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "100";
    input.addEventListener("input", () => {
        guardarNotas();
        calcularPromedioTP(id);
    });
    grid.appendChild(input);
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
    document.querySelectorAll("input").forEach(input => {
        datos[input.dataset.id + "-" + input.dataset.type] = input.value;
    });
    document.querySelectorAll(".tp-grid").forEach(grid => {
        const id = grid.id.replace("tp-grid-", "");
        datos[id + "-tp"] = Array.from(grid.querySelectorAll("input")).map(i => i.value);
    });
    localStorage.setItem("notasEnfermeria", JSON.stringify(datos));
}

function cargarNotas() {
    const datos = JSON.parse(localStorage.getItem("notasEnfermeria") || "{}");
    document.querySelectorAll("input").forEach(input => {
        const valor = datos[input.dataset.id + "-" + input.dataset.type];
        if (valor !== undefined) input.value = valor;
    });
    Object.keys(datos).forEach(key => {
        if (key.endsWith("-tp")) {
            const id = key.replace("-tp", "");
            const grid = document.getElementById(`tp-grid-${id}`);
            datos[key].forEach(valor => {
                const input = document.createElement("input");
                input.type = "number";
                input.min = "0";
                input.max = "100";
                input.value = valor;
                input.addEventListener("input", () => {
                    guardarNotas();
                    calcularPromedioTP(id);
                });
                grid.appendChild(input);
            });
            calcularPromedioTP(id);
        }
    });
}

window.addEventListener("load", cargarNotas);
          
