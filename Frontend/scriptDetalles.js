document.addEventListener("DOMContentLoaded", () => {
  const pelicula = JSON.parse(localStorage.getItem("peliculaSeleccionada"));
  const peliculas = JSON.parse(localStorage.getItem("peliculas")) || [];
  const salas = JSON.parse(localStorage.getItem("salas")) || [];
  const index = peliculas.findIndex(p => p.titulo === pelicula.titulo && p.duracion === pelicula.duracion);

  // Mostrar tráiler y detalles
  const detalleDiv = document.getElementById("detallePelicula");
  let trailerEmbed = "";
  if (pelicula.trailer) {
    let videoId = "";
    if (pelicula.trailer.includes("youtube.com")) {
      videoId = pelicula.trailer.split("v=")[1]?.split("&")[0];
    } else if (pelicula.trailer.includes("youtu.be")) {
      videoId = pelicula.trailer.split("youtu.be/")[1]?.split("?")[0];
    }
    if (videoId) {
      trailerEmbed = `<div class="mb-4 text-center">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" 
          title="Tráiler" frameborder="0" allowfullscreen></iframe>
      </div>`;
    }
  }

  detalleDiv.innerHTML = `
    ${trailerEmbed}
    <div class="card mb-4">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${pelicula.poster}" class="img-fluid rounded-start" alt="${pelicula.titulo}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h4 class="card-title">${pelicula.titulo}</h4>
            <p class="card-text">${pelicula.sinopsis || ""}</p>
            <p><strong>Género:</strong> ${pelicula.genero}</p>
            <p><strong>Duración:</strong> ${pelicula.duracion}</p>
            <p><strong>Clasificación:</strong> ${pelicula.clasificacion}</p>
            <p><strong>Idioma:</strong> ${pelicula.idioma}</p>
            <p><strong>Disponibilidad:</strong> ${(pelicula.disponibilidad || []).join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Mostrar horarios en tarjetas como en horarios.html
  const horariosDiv = document.getElementById("horariosPelicula");
  const salasAsociadas = salas.filter(s => s.peliculaId === index);
  if (salasAsociadas.length > 0) {
    horariosDiv.innerHTML = "";
    salasAsociadas.forEach(sala => {
      const card = document.createElement("div");
      card.className = "card mb-3 sala-horario";
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${sala.nombre} (${sala.tipo})</h5>
          <div>
            ${(sala.horarios || []).map(h => 
              `<button class="btn btn-sm btn-outline-primary me-2 mb-2" onclick="seleccionarHorario('${sala.nombre}', ${index}, '${h}')">${h}</button>`
            ).join("")}
          </div>
        </div>
      `;
      horariosDiv.appendChild(card);
    });
  } else {
    horariosDiv.innerHTML = `<p>No hay horarios disponibles para esta película.</p>`;
  }
});

function seleccionarHorario(nombreSala, peliculaId, horario) {
  const reserva = {
    sala: { nombre: nombreSala },
    peliculaId: peliculaId,
    horario: horario
  };
  localStorage.setItem("reservaSeleccionada", JSON.stringify(reserva));
  window.location.href = "ReservarAsiento.html";
}