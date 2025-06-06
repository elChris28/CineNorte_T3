document.addEventListener("DOMContentLoaded", () => {
  const productos = JSON.parse(localStorage.getItem("dulceria")) || [];
  const contenedor = document.getElementById("contenidoDulceria");

  const categorias = ["Combos", "Snacks", "Bebidas", "Otros"];

  // Crear secciones dinámicamente
  categorias.forEach(cat => {
    const filtrados = productos.filter(p => p.categoria === cat);
    if (filtrados.length > 0) {
      const seccion = document.createElement("section");
      seccion.className = "mb-5 categoria-seccion";
      seccion.dataset.categoria = cat;

      seccion.innerHTML = `<h2 class="text-danger mb-4">${cat}</h2>`;

      const row = document.createElement("div");
      row.className = "row";

      filtrados.forEach((p, index) => {
        const idCantidad = `cantidad-${cat}-${index}`;

        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

        col.innerHTML = `
        <div class="card producto-card h-100 text-center">
            <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}" style="height: 220px; object-fit: cover;">
            <div class="card-body d-flex flex-column justify-content-between">
              <div>
                  <h5 class="card-title">${p.nombre}</h5>
                  <p class="card-text">${p.descripcion}</p>
                  <p class="card-text fw-bold">S/. ${p.precio.toFixed(2)}</p>
              </div>
            </div>
        </div>
    `;

        row.appendChild(col);
      });

      seccion.appendChild(row);
      contenedor.appendChild(seccion);
    }
  });
});

// Mostrar solo la categoría seleccionada
function mostrarCategoria(categoria) {
  const secciones = document.querySelectorAll(".categoria-seccion");
  secciones.forEach(seccion => {
    if (categoria === "Todos" || seccion.dataset.categoria === categoria) {
      seccion.style.display = "block";
    } else {
      seccion.style.display = "none";
    }
  });
}



// Scroll dinámico para navbar (opcional si tienes navbar flotante)
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
});
