window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("contenedor-promociones");
  const promociones = JSON.parse(localStorage.getItem("promociones")) || [];

  if (promociones.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "text-center mt-5";
    mensaje.textContent = "No hay promociones disponibles en este momento.";
    container.appendChild(mensaje);
    return;
  }

  promociones.forEach((promo) => {
    const col = document.createElement("div");
    col.className = "col-12";

    // Card contenedor principal
    const card = document.createElement("div");
    card.className = "d-flex align-items-center justify-content-between flex-wrap p-4 border rounded bg-light";

    // Contenido textual
    const content = document.createElement("div");
    content.className = "flex-grow-1 me-4";

    const title = document.createElement("h3");
    title.className = "fw-bold mb-2";
    title.textContent = promo.nombre;

    const desc = document.createElement("p");
    desc.className = "mb-3";
    desc.textContent = promo.descripcion;

    content.appendChild(title);
    content.appendChild(desc);

    if (promo.pdf) {
      const link = document.createElement("a");
      link.href = promo.pdf;
      link.target = "_blank";
      link.className = "btn btn-danger";
      link.textContent = "Términos y condiciones";
      content.appendChild(link);
    }

    // Imagen
    const img = document.createElement("img");
    img.src = promo.imagen;
    img.alt = "Imagen promoción";
    img.className = "img-fluid";
    img.style.maxWidth = "300px";
    img.style.border = "8px solid #ccc";
    img.style.borderRadius = "10px";

    // Añadir elementos a la tarjeta
    card.appendChild(content);
    card.appendChild(img);

    // Añadir tarjeta al contenedor
    col.appendChild(card);
    container.appendChild(col);
  });
});