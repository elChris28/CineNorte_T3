document.addEventListener("DOMContentLoaded", () => {
  const resumen = JSON.parse(localStorage.getItem("pedidoDulceria")) || {};
  const asientos = JSON.parse(localStorage.getItem("asientosSeleccionados")) || [];
  const lista = document.getElementById("resumenPedido");
  const totalEl = document.getElementById("totalPedido");

  let total = 0;
  lista.innerHTML = "";

  for (const [nombre, item] of Object.entries(resumen)) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${item.cantidad} x ${nombre}</span>
      <span>S/. ${(item.cantidad * item.precio).toFixed(2)}</span>
    `;
    total += item.cantidad * item.precio;
    lista.appendChild(li);
  }

  totalEl.textContent = `S/. ${total.toFixed(2)}`;
  document.getElementById("listaAsientos").textContent = asientos.length > 0 ? asientos.join(", ") : "Ninguno";

  // Escuchar cambio de método de pago
  document.getElementById("metodoPago").addEventListener("change", renderCamposMetodo);
});

function renderCamposMetodo() {
  const metodo = document.getElementById("metodoPago").value;
  const contenedor = document.getElementById("camposAdicionales");
  contenedor.innerHTML = "";

  if (metodo === "debito" || metodo === "credito") {
    contenedor.innerHTML = `
      <div class="mb-2">
        <label class="form-label">Número de Tarjeta</label>
        <input type="text" class="form-control" id="numTarjeta" maxlength="16" required>
      </div>
      <div class="row">
        <div class="col mb-2">
          <label class="form-label">Mes</label>
          <input type="text" class="form-control" id="mesTarjeta" placeholder="MM" maxlength="2" required>
        </div>
        <div class="col mb-2">
          <label class="form-label">Año</label>
          <input type="text" class="form-control" id="anioTarjeta" placeholder="YY" maxlength="2" required>
        </div>
        <div class="col mb-2">
          <label class="form-label">CVV</label>
          <input type="text" class="form-control" id="cvvTarjeta" maxlength="4" required>
        </div>
      </div>
      <div class="mb-2">
        <label class="form-label">DNI</label>
        <input type="text" class="form-control" id="dniTarjeta" maxlength="8" required>
      </div>
      ${
        metodo === "credito"
          ? `<div class="mb-2">
              <label class="form-label">Número de Cuotas</label>
              <select class="form-select" id="cuotas" required>
                <option value="1">1 Cuota</option>
                <option value="3">3 Cuotas</option>
                <option value="6">6 Cuotas</option>
                <option value="12">12 Cuotas</option>
              </select>
            </div>`
          : ""
      }
    `;
  } else if (metodo === "billetera") {
    contenedor.innerHTML = `
      <div class="mb-2">
        <label class="form-label">DNI</label>
        <input type="text" class="form-control" id="dniBilletera" maxlength="8" required>
      </div>
      <div class="mb-2">
        <label class="form-label">Número de Celular</label>
        <input type="text" class="form-control" id="celularBilletera" maxlength="9" required>
      </div>
    `;
  }
}

document.getElementById("formPago").addEventListener("submit", e => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const metodo = document.getElementById("metodoPago").value;

  if (!nombre || !correo || !metodo) {
    mostrarToast("Completa todos los campos", "danger");
    return;
  }

  // Validaciones básicas según método
  if (metodo === "debito" || metodo === "credito") {
    const num = document.getElementById("numTarjeta")?.value.trim();
    const mes = document.getElementById("mesTarjeta")?.value.trim();
    const anio = document.getElementById("anioTarjeta")?.value.trim();
    const cvv = document.getElementById("cvvTarjeta")?.value.trim();
    const dni = document.getElementById("dniTarjeta")?.value.trim();

    if (!num || !mes || !anio || !cvv || !dni) {
      mostrarToast("Completa todos los campos de tarjeta", "danger");
      return;
    }

    if (metodo === "credito") {
      const cuotas = document.getElementById("cuotas")?.value;
      if (!cuotas) {
        mostrarToast("Selecciona el número de cuotas", "danger");
        return;
      }
    }
  }

  if (metodo === "billetera") {
    const dni = document.getElementById("dniBilletera")?.value.trim();
    const celular = document.getElementById("celularBilletera")?.value.trim();
    if (!dni || !celular) {
      mostrarToast("Completa los campos para billetera", "danger");
      return;
    }
  }

  mostrarToast("¡Pago exitoso!", "success");

  // Limpiar datos
  localStorage.removeItem("pedidoDulceria");
  localStorage.removeItem("asientosSeleccionados");
  localStorage.removeItem("reservaSeleccionada");

  setTimeout(() => {
    window.location.href = "Inicio.html";
  }, 3000);
});

function mostrarToast(mensaje, tipo = "success") {
  const toastEl = document.getElementById("toastPago");
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  toastEl.classList.remove("bg-success", "bg-danger");
  toastEl.classList.add(`bg-${tipo}`);
  document.getElementById("mensajeToast").textContent = mensaje;
  toast.show();
}