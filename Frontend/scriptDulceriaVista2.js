const resumen = {}; // ← Esto es lo que falta

document.addEventListener("DOMContentLoaded", () => {


      // 🔹 Mostrar asientos seleccionados
  const asientosSeleccionados = JSON.parse(localStorage.getItem("asientosSeleccionados")) || [];
    if (asientosSeleccionados.length > 0) {
        document.getElementById("listaAsientos").textContent = asientosSeleccionados.join(", ");
    } else {
        document.getElementById("resumenAsientos").style.display = "none";
    }
    
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
            <div class="cantidad d-flex justify-content-center align-items-center gap-2 mt-3">
                <button class="btn btn-sm btn-dark fw-bold" onclick="cambiarCantidad('${idCantidad}', -1)">-</button>
                <span id="${idCantidad}" class="px-2">0</span>
                <button class="btn btn-sm btn-dark fw-bold" onclick="cambiarCantidad('${idCantidad}', 1)">+</button>
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

// Aumentar / disminuir cantidad
function cambiarCantidad(id, delta) {
  const cantidadEl = document.getElementById(id);
  let cantidad = parseInt(cantidadEl.textContent);
  const nuevo = Math.max(0, cantidad + delta);
  cantidadEl.textContent = nuevo;

  // Obtener nombre y precio del producto
  const card = cantidadEl.closest(".card");
  const nombre = card.querySelector(".card-title").textContent;
  const precioText = card.querySelector(".fw-bold").textContent;
  const precio = parseFloat(precioText.replace("S/.", "").trim());

  if (nuevo > 0) {
    resumen[nombre] = { cantidad: nuevo, precio };
  } else {
    delete resumen[nombre];
  }

  actualizarResumen();
}

function actualizarResumen() {
  const lista = document.getElementById("resumenPedido");
  const totalEl = document.getElementById("totalPedido");
  const btnContinuar = document.getElementById("btnContinuar");

  lista.innerHTML = "";

  let total = 0;
  let hayItems = false;

  for (const [nombre, item] of Object.entries(resumen)) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${item.cantidad} x ${nombre}</span>
      <span>S/. ${(item.cantidad * item.precio).toFixed(2)}</span>
    `;
    lista.appendChild(li);
    total += item.cantidad * item.precio;
    hayItems = true;
  }

  totalEl.textContent = `S/. ${total.toFixed(2)}`;
  btnContinuar.disabled = !hayItems;
}

document.getElementById("btnContinuar").addEventListener("click", () => {
  // Guardar pedido en localStorage
  localStorage.setItem("pedidoDulceria", JSON.stringify(resumen));
  window.location.href = "Pago.html";
});


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
