const preguntasPorRonda = 5;
const totalPreguntas = 25;
let preguntas = [];
let rondaActual = 0;
let correctasTotales = 0;
let incorrectasTotales = 0;

const preguntasContainer = document.getElementById('preguntas');
const enviarBtn = document.getElementById('enviar-btn');
const siguienteRondaBtn = document.getElementById('siguiente-ronda-btn');

function cargarPreguntas() {
    fetch('http://localhost:3033/preguntas')
        .then(response => response.json())
        .then(data => {
            preguntas = data;
            mostrarPreguntas();
        })
        .catch(error => console.error('Error al cargar preguntas:', error));
}

function mostrarPreguntas() {
    if (rondaActual * preguntasPorRonda >= totalPreguntas) {
        mostrarResultadoFinal();
        return;
    }

    const inicio = rondaActual * preguntasPorRonda;
    const fin = inicio + preguntasPorRonda;
    const preguntasActuales = preguntas.slice(inicio, fin);

    preguntasContainer.innerHTML = '';

    preguntasActuales.forEach((pregunta, index) => {
        const fieldset = document.createElement('fieldset');
        fieldset.innerHTML = `
            <legend>${pregunta.pregunta}</legend>
            ${pregunta.respuestas.map((respuesta, i) => `
                <div>
                    <input type="radio" id="respuesta-${inicio + index}-${i}" name="pregunta-${inicio + index}" data-correcta="${respuesta.correcta}">
                    <label for="respuesta-${inicio + index}-${i}">${respuesta.texto}</label>
                </div>
            `).join('')}
        `;
        preguntasContainer.appendChild(fieldset);
    });

    // Habilitar el botón "Evaluar" solo si se han contestado las 5 preguntas
    const inputs = document.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
        input.addEventListener('change', habilitarBotonEvaluar);
    });

    enviarBtn.disabled = false; // Asegurarse de que el botón esté habilitado al iniciar la ronda
}

function habilitarBotonEvaluar() {
    const inputs = document.querySelectorAll('input[type="radio"]:checked');
    enviarBtn.disabled = inputs.length < preguntasPorRonda;
}

enviarBtn.onclick = function(event) {
    event.preventDefault();

    const inputs = document.querySelectorAll('input[type="radio"]:checked');
    let correctas = 0;
    let incorrectas = 0;

    inputs.forEach(input => {
        const esCorrecta = input.dataset.correcta === 'true';
        const label = document.querySelector(`label[for="${input.id}"]`);
        
        if (esCorrecta) {
            label.style.color = 'green';
            correctas++;
        } else {
            label.style.color = 'red';
            incorrectas++;

            // Mostrar la respuesta correcta
            const parent = input.closest('fieldset');
            const correctLabel = parent.querySelector('input[data-correcta="true"] + label');
            correctLabel.style.color = 'green';
        }
    });

    correctasTotales += correctas;
    incorrectasTotales += incorrectas;

    // Actualizar contadores
    document.getElementById('contador-correctas').textContent = `Correctas: ${correctasTotales}`;
    document.getElementById('contador-incorrectas').textContent = `Incorrectas: ${incorrectasTotales}`;

    if (rondaActual < totalPreguntas / preguntasPorRonda - 1) {
        siguienteRondaBtn.style.display = 'inline-block';
    } else {
        mostrarResultadoFinal();
    }
    
    enviarBtn.disabled = true; // Deshabilitar el botón después de enviar respuestas
};

siguienteRondaBtn.onclick = function() {
    rondaActual++;
    siguienteRondaBtn.style.display = 'none'; // Ocultar el botón para la siguiente ronda
    mostrarPreguntas();
};

function mostrarResultadoFinal() {
    const porcentaje = (correctasTotales / totalPreguntas) * 100;
    const resultadoTexto = document.getElementById('resultado-final');
    
    resultadoTexto.textContent = `Ánimo, tu porcentaje de aciertos es: ${porcentaje.toFixed(2)}%`;
    resultadoTexto.style.color = porcentaje > 50 ? 'green' : 'red';
    resultadoTexto.style.fontWeight = 'bold';
    resultadoTexto.style.animation = 'parpadeo 1s infinite';
}

document.addEventListener('DOMContentLoaded', cargarPreguntas);
