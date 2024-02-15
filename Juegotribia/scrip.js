let preguntas = []
let misRespuesta = Array.from({ length: 10 })

document.addEventListener("DOMContentLoaded", function () {
    let token = sessionStorage.getItem('token')

    if (token) {
        console.log('Token encontrado', token)
    } else {
        crearToken()
    }
})
const desorden = () => {
    return Math.random() - 0.5
}
const crearToken = () => {
    fetch('https://opentdb.com/api_token.php?command=request')
        .then(respueta => { return respueta.json() })
        .then(datos => {
            if (datos.token) {
                sessionStorage.setItem('token', datos.token)
            }
        })
        .catch(error => {
            console.error('Hubo un error generando el token: ', error);
        })
}

const reunirPreguntas = () => {
    let token = sessionStorage.getItem('token')
    if (token) {
        const categoria = document.getElementById('select1').value
        const dificultad = document.getElementById('select2').value
        const tipo = document.getElementById('select3').value

        if (categoria === "" || dificultad === "" || tipo === "") {
            alert('Debes seleccionar todos lasa campos')
        } else {
            let url = `https://opentdb.com/api.php?amount=10&category=${categoria}&difficulty=${dificultad}&type=${tipo}`
            fetch(url)
                .then(respuesta => respuesta.json())
                .then(datos => {
                    if (datos.results.length > 0) {
                        datos.results.map(preguntaAPI => {
                            preguntas.push(
                                {
                                    pregunta: preguntaAPI.question,
                                    repuestaCorrecta: preguntaAPI.correct_answer,
                                    respuestaIncorrecta: preguntaAPI.incorrect_answers,
                                    respuestasAleatorias: [preguntaAPI.correct_answer, ...preguntaAPI.incorrect_answers].sort(desorden)
                                }
                            )
                        })


                        preguntas.map((pregunta, indice) => {
                            const preguntaHTML = document.createElement('div')
                            preguntaHTML.innerHTML = `
                            <h3>${pregunta.pregunta}</h3>
                            <ul>
                                ${pregunta.respuestasAleatorias.map(respuesta => `<li class = "respuesta" onclick = "agregarRespuesta('${respuesta}', '${indice}')">${respuesta}</li>`).join('')}
                            </ul>
                            `
                            document.getElementById('Pregunta').appendChild(preguntaHTML)
                        })
                        document.getElementById('Cuestionario').hidden = false
                        document.getElementById('form').hidden = true
                    } else {
                        document.getElementById('Cuestionario').hidden = true

                        alert('No encuentran los criterios')


                    }
                })
                .catch(error => console.error('Hubo un error generando las preguntas: ', error))
        }
    } else {
        crearToken()

    }
}
const reset = () => {
    document.getElementById('Cuestionario').hidden = true
    document.getElementById('form').hidden = false
}

const agregarRespuesta = (respuesta, indice) => {
    misRespuesta[indice] = respuesta
    actualizarEstilos(indice)
}
const arrayListo = () => {
    return misRespuesta.every(elemento => {
        return elemento !== undefined && elemento !== null
    })
}
const revisar = () => {
    let puntaje = 0
    if (arrayListo()) {
        misRespuesta.map((respuesta, indice) => {
            if (respuesta === preguntas[indice].repuestaCorrecta) {
                puntaje = puntaje + 100
            }
        })
        document.getElementById('puntaje').textContent = 'Tu puntaje es: ' + puntaje
        document.getElementById('puntajeG').hidden = false
    } else {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        document.getElementById('alert').hidden = false
    }
}
function actualizarEstilos(indice) {
    const lista = document.getElementById('Pregunta').children[indice].querySelector('ul')
    const respuestasHTML = lista.children

    for (let i = 0; i < respuestasHTML.length; i++) {
        respuestasHTML[i].classList.remove('seleccionada')

    }
    const respuestaSeleccionada = misRespuesta[indice]
    const elementoSeleccionado = Array.from(lista.children).find(elemento => elemento.innerText === respuestaSeleccionada)
    if (elementoSeleccionado) {
        elementoSeleccionado.classList.add('seleccionada')
    }
}