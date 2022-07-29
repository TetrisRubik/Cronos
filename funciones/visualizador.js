import { actualizar_barra_h, desunizar, longitud_visualizador, posición_actual } from "./desplazamiento.js";

// ¿Añadir división por campos en una misma línea temporal?
const mostrador_periodos = document.getElementById("periodos");
const mostrador_eventos = document.getElementById("eventos");

const propiedades = {
	proporción: 100,
	máximo: null,
	mínimo: null,
	posición: 0
};

const aumentar = document.getElementById("aumentar");
const disminuir = document.getElementById("disminuir");

aumentar.addEventListener("click", () => {
	if (propiedades.proporción > 10) {
		propiedades.proporción -= 10;
		actualizar_barra_h(propiedades.proporción);
		actualizar_longitud_periodos();
	}
});

disminuir.addEventListener("click", () => {
	if (propiedades.proporción < 100) {
		propiedades.proporción += 10;
		actualizar_barra_h(propiedades.proporción);
		actualizar_longitud_periodos();
		actualizar_posición();
	}
});

export function cargar_visualizador(línea_temporal) {
	limpiar_mostrador();

	añadir_periodos(línea_temporal.contenido.periodos);
	añadir_eventos(línea_temporal.contenido.eventos);

	actualizar_visualizador();
}

export function actualizar_visualizador() {
	actualizar_barra_h(propiedades.proporción);
	actualizar_posición();
	definir_longitud();
	actualizar_longitud_periodos();
}

function actualizar_posición() {
	const periodos = mostrador_periodos.childNodes;
	for (let i = 0; i < periodos.length; i++) {
		const periodo = periodos[i];
		const desplazador = posición_actual();
		const dif_max_min = propiedades.máximo - propiedades.mínimo;
		const dif_min_per = periodo.getAttribute("inicio") - propiedades.mínimo;
		const distancia = desplazador / dif_max_min * dif_min_per;
		periodo.setAttribute("pos_x", distancia);
	}
}

function actualizar_longitud_periodos() {
	const periodos = mostrador_periodos.childNodes;
	for (let i = 0; i < periodos.length; i++) {
		const periodo = periodos[i];
		const ancho_relativo = desunizar(periodo.getAttribute("ancho"));
		const ancho_escalado = ancho_relativo / propiedades.proporción * 100;
		const ancho_pantalla = longitud_visualizador();
		const ancho_absoluto = ancho_escalado / 100 * ancho_pantalla;
		periodo.style.width = ancho_absoluto + "px";
	}
}

function definir_longitud() {
	const periodos = mostrador_periodos.childNodes;
	for (let i = 0; i < periodos.length; i++) {
		const periodo = periodos[i];
		const inicio = periodo.getAttribute("inicio");
		const fin = periodo.getAttribute("fin");
		const dif_fecha_periodo = fin - inicio;
		const dif_fecha_total = propiedades.máximo - propiedades.mínimo;
		const ancho = 100 / dif_fecha_total * dif_fecha_periodo;
		periodo.setAttribute("ancho", ancho);
	}
}

function crear_periodo(periodo) {
	const nodo = document.createElement("div");
	nodo.textContent = periodo.nombre;
	nodo.title = periodo.comentario;
	nodo.setAttribute("class", "periodo");
	nodo.setAttribute("inicio", periodo.fecha.inicio);
	nodo.setAttribute("fin", periodo.fecha.fin);
	nodo.style.bottom = 0;
	return nodo;
}

function crear_evento(evento) {
	const nodo = document.createElement("div");
	nodo.title = evento.comentario;
	nodo.setAttribute("class", "evento");
	nodo.setAttribute("fecha", evento.fecha);
	return nodo;
}

function añadir_periodos(periodos) {
	const fragmento = document.createDocumentFragment();
	periodos.forEach(periodo => {
		const nodo_periodo = crear_periodo(periodo);
		fragmento.appendChild(nodo_periodo);
		actualizar_límites(periodo);
	});
	mostrador_periodos.appendChild(fragmento);
}

function añadir_eventos(eventos) {
	const fragmento = document.createDocumentFragment();
	eventos.forEach(evento => {
		const nodo_evento = crear_evento(evento);
		fragmento.appendChild(nodo_evento);
		actualizar_límites(evento);
	});
	mostrador_eventos.appendChild(fragmento);
}

function actualizar_límites(objeto) {
	actualizar_mínimos(objeto.fecha);
	actualizar_máximos(objeto.fecha);
}

function actualizar_mínimos(fecha) {
	let valor;
	if (fecha.inicio) {
		valor = fecha.inicio;
	} else {
		valor = fecha;
	}
	if (!propiedades.mínimo) {
		propiedades.mínimo = valor;
	} else if (propiedades.mínimo > valor) {
		propiedades.mínimo = valor;
	}
}

function actualizar_máximos(fecha) {
	let valor;
	if (fecha.fin) {
		valor = fecha.fin;
	} else {
		valor = fecha;
	}
	if (!propiedades.máximo) {
		propiedades.máximo = valor;
	} else if (propiedades.máximo < valor) {
		propiedades.máximo = valor;
	}
}

function limpiar_mostrador() {
	while (mostrador_periodos.firstChild) {
		mostrador_periodos.firstChild.remove();
	}
	while (mostrador_eventos.firstChild) {
		mostrador_eventos.firstChild.remove();
	}
}

// Para pruebas.
cargar_visualizador(
	{
		contenido: {
			periodos: [{
				nombre: "Nombre del Periodo 1",
				comentario: "Comentario del periodo que voy a hacer largo para que se vea claramente si funciona.",
				fecha: {
					inicio: 10,
					fin: 30
				}
			}, {
				nombre: "¡Periodo 2!",
				comentario: "Comentario del periodo que voy a hacer largo para que se vea claramente si funciona.",
				fecha: {
					inicio: 32,
					fin: 58
				}
			}],
			eventos: [{
				nombre: "Nombre del Evento",
				comentario: "Comentario del evento que voy a hacer largo para que se vea claramente si funciona.",
				fecha: 20
			}]
		}
	});