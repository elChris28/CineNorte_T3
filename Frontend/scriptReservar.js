window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

let columnas = 0; // Será asignado al inicializar la interfaz
let filas = 10;   // Puedes ajustarlo si tus salas usan otro número de filas

document.addEventListener("DOMContentLoaded", () => {
  const reserva = JSON.parse(localStorage.getItem("reservaSeleccionada"));
  const salas = JSON.parse(localStorage.getItem("salas")) || [];
  const peliculas = JSON.parse(localStorage.getItem("peliculas")) || [];

  if (!reserva) {
    alert("No se encontró la reserva.");
    window.location.href = "horarios.html";
    return;
  }

  const sala = salas.find(
    s => s.peliculaId === reserva.peliculaId && s.nombre.toLowerCase() === reserva.sala.nombre.toLowerCase()
  );

  // ✅ Mostrar las imágenes POV (si existen)
  const pov = sala.pov || {};

  if (pov.topLeft) {
    const img = document.getElementById("povTopLeft");
    img.src = pov.topLeft;
    img.style.display = "block";
  }

  if (pov.topRight) {
    const img = document.getElementById("povTopRight");
    img.src = pov.topRight;
    img.style.display = "block";
  }

  if (pov.bottomLeft) {
    const img = document.getElementById("povBottomLeft");
    img.src = pov.bottomLeft;
    img.style.display = "block";
  }

  if (pov.bottomRight) {
    const img = document.getElementById("povBottomRight");
    img.src = pov.bottomRight;
    img.style.display = "block";
  }

  // ✅ Agrega esto justo después de mostrar los POVs
  function prepararPOVZoom(id) {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("click", () => {
      const modalImage = document.getElementById("modalPOVImage");
      modalImage.src = el.src;
      const modal = new bootstrap.Modal(document.getElementById("modalPOV"));
      modal.show();
    });
  }

  prepararPOVZoom("povTopLeft");
  prepararPOVZoom("povTopRight");
  prepararPOVZoom("povBottomLeft");
  prepararPOVZoom("povBottomRight");

  // Continúa con:
  if (!sala) {
    alert("Sala no encontrada.");
    return;
  }

  const pelicula = peliculas[reserva.peliculaId];

  // 🧩 Rellenar los datos en el HTML existente
  document.getElementById("poster").src = pelicula.poster;
  document.getElementById("poster").alt = pelicula.titulo;
  document.getElementById("titulo").textContent = pelicula.titulo;
  document.getElementById("idioma").textContent = `${pelicula.idioma}, ${sala.tipo.toUpperCase()}`;
  document.getElementById("fecha").textContent = new Date().toLocaleDateString("es-PE", {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  document.getElementById("hora").textContent = reserva.horario;
  document.getElementById("sala").textContent = sala.nombre;
  document.getElementById("interfazAsientos").innerHTML = sala.interfaz;

  // 🎯 Lógica para manejar selección de asientos
  const asientos = sala.asientos || [];
  columnas = Math.ceil(asientos.length / filas); // 👈 Asignación global
  const divsAsientos = document.querySelectorAll("#interfazAsientos .asiento");
  const seleccionados = new Set();
  const btnConfirmar = document.getElementById("confirmarReserva");

  divsAsientos.forEach((div, i) => {
    if (asientos[i]?.tipo === "ocupado") {
      div.classList.add("ocupada");
      div.style.pointerEvents = "none";
    } else if (asientos[i]?.tipo === "discapacitado") {
      div.classList.add("silla");
      div.style.pointerEvents = "none";
    } else {
      div.classList.add("disponible");
        div.addEventListener("click", () => {
        if (seleccionados.has(i)) {
          seleccionados.delete(i);
          div.classList.remove("seleccionada");
        } else {
          seleccionados.add(i);
          div.classList.add("seleccionada");
        }

        btnConfirmar.disabled = seleccionados.size === 0;
        mostrarResumenAsientos(); // 👈 función que actualiza la vista del pedido
      });
    }
  });

    btnConfirmar.addEventListener("click", () => {
    if (seleccionados.size === 0) {
      alert("Debes seleccionar al menos un asiento.");
      return;
    }

    // Marcar ocupados
    seleccionados.forEach(i => {
      asientos[i].tipo = "ocupado";
    });

    sala.asientos = asientos;
    sala.interfaz = generarHTMLInterfaz(asientos);

    const indexSala = salas.findIndex(
      s => s.nombre.toLowerCase() === sala.nombre.toLowerCase() && s.peliculaId === reserva.peliculaId
    );
    salas[indexSala] = sala;
    localStorage.setItem("salas", JSON.stringify(salas));

    // 🔥 GUARDAMOS asientos seleccionados
    const asientosSeleccionados = Array.from(seleccionados).map(i => obtenerEtiquetaAsiento(i, columnas));
    localStorage.setItem("asientosSeleccionados", JSON.stringify(asientosSeleccionados));

    // Vaciamos el resumen de dulcería para que no se comparta entre salas
    localStorage.removeItem("pedidoDulceria");

    window.location.href = "DulceriaVista2.html";
  });


  cargarResumenDulceria(); //RESUMEN PEDIOD
});

function generarHTMLInterfaz(asientos) {
  const filas = 10;
  const columnas = Math.ceil(asientos.length / filas);
  let html = `<div class="grid" style=" display: grid; grid-template-columns: repeat(${columnas}, 26px); gap: 4px;">`;

  asientos.forEach((a, i) => {
    html += `
      <div class="asiento ${a.tipo}" title="Asiento ${i + 1}">
        <span class="numero-asiento">${i + 1}</span>
      </div>`;
  });

  html += `</div>`;
  return html;
}

function obtenerEtiquetaAsiento(index, columnas) {
  const fila = String.fromCharCode(65 + Math.floor(index / columnas)); // 65 = 'A'
  const columna = (index % columnas) + 1;
  return `${fila}${columna}`;
}

function mostrarResumenAsientos() {
  const resumenEl = document.getElementById("resumenPedido");
  const totalEl = document.getElementById("totalPedido");
  const card = document.getElementById("cardPedido");
  const spanButacas = document.getElementById("butacasSeleccionadas");

  resumenEl.innerHTML = "";
  let total = 0;
  const precioPorAsiento = 15;
  const filas = 10;
  const columnas = Math.ceil(asientos.length / filas); // 👈 importante

  if (seleccionados.size === 0) {
    card.style.display = "none";
    if (spanButacas) spanButacas.textContent = "Ninguna";
    return;
  }

  const ordenados = Array.from(seleccionados).sort((a, b) => a - b);
  const etiquetas = ordenados.map(i => obtenerEtiquetaAsiento(i, columnas));

  etiquetas.forEach(etiqueta => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>Asiento ${etiqueta}</span>
      <span>S/. ${precioPorAsiento.toFixed(2)}</span>
    `;
    resumenEl.appendChild(li);
    total += precioPorAsiento;
  });

  totalEl.textContent = `S/. ${total.toFixed(2)}`;
  card.style.display = "block";

  // ✅ Mostrar formato tipo A1, B2, etc. en campo "Butacas seleccionadas"
  if (spanButacas) {
    spanButacas.textContent = etiquetas.join(", ");
  }
}


