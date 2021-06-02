import { AnuncioMascota } from "./anuncioMascota.js";

let mascotas = JSON.parse(localStorage.getItem("lista")) || [];
let form = document.forms[0];
let spinnerPause = 3000;

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", handlerClick);
  form.addEventListener("submit", handlerSubmit);
  ActualizarListaDinamica();
});

function handlerClick(e) {
  if (e.target.matches("td")) handlerTdClick(e);
  if (e.target.matches("#cancel")) limpiarForm(e);
}

//HANDLERS
function handlerSubmit(e) {
  e.preventDefault();
  let id = form.id.value;
  if (id) {
    let artViejo = ObtenerArtPorId(id);
    let artNuevo = ObtenerArtPorForm(form, id);
    if (JSON.stringify(artViejo) === JSON.stringify(artNuevo)) {
      //sin cambios
      alert("no se han realizado modificaciones.");
    } else {
      //modif
      if (confirm("¿Desea confirmar las modificaciones?")) {
        agregarSpinner();
        ReemplazarArticulo(artViejo, artNuevo);
        setTimeout(() => {
          eliminarSpinner();
        }, spinnerPause);
        console.log("modif");
      }
    }
  } else {
    //alta
    agregarSpinner();
    AgregarMascota(ObtenerArtPorForm(form, Date.now()));
    setTimeout(() => {
      eliminarSpinner();
    }, spinnerPause);
  }
  localStorage.setItem("lista", JSON.stringify(mascotas));
  ActualizarListaDinamica();
  limpiarForm(e);
}

function handlerDeleteClick(e) {
  e.preventDefault();
  let id = form.id.value;
  if (confirm("¿Seguro que desea eliminar?")) {
    mascotas.splice(
      mascotas.findIndex((a) => {
        return a.id === parseInt(id);
      }),
      1
    );
    localStorage.setItem("lista", JSON.stringify(mascotas));
    ActualizarListaDinamica();
  }
  limpiarForm(e);
}

function handlerTdClick(e) {
  let art = null;
  art = ObtenerArtPorId(e.target.parentNode.dataset.id);
  const { id, titulo, descripcion, precio, animal, raza, fecha, vacuna } = art;
  form.id.value = id;
  form.titulo.value = titulo;
  form.descripcion.value = descripcion;
  form.precio.value = precio;
  form.animal.value = animal;
  form.raza.value = raza;
  form.fecha.value = fecha;
  form.vacuna.value = vacuna;
  showDeleteButton(form);
  ChangeTextButton("send", "Modificar");
}

//FUNCIONES PRIVADAS

function ReemplazarArticulo(artViejo, artNuevo) {
  mascotas.splice(
    mascotas.findIndex((a) => {
      return a === artViejo;
    }),
    1,
    artNuevo
  );
}

function ObtenerArtPorId(id) {
  return mascotas.find((a) => a.id === parseInt(id));
}

function ObtenerArtPorForm(form, id) {
  return new AnuncioMascota(
    parseInt(id),
    form.titulo.value,
    "venta",
    form.descripcion.value,
    form.precio.value,
    form.animal.value,
    form.raza.value,
    form.fecha.value,
    form.vacuna.value
  );
}

function agregarSpinner() {
  let spinner = document.createElement("img");
  spinner.setAttribute("src", "./imagenes/spinner.gif");
  spinner.setAttribute("alt", "image spinner");
  document.getElementById("spinner-div").appendChild(spinner);
}

function eliminarSpinner() {
  document.getElementById("spinner-div").innerHTML = "";
}

function ActualizarListaDinamica() {
  let $divLista = document.getElementById("lista");
  while ($divLista.firstChild) $divLista.removeChild($divLista.firstChild);
  if (mascotas.length > 0) {
    let table = document.createElement("table");
    table.appendChild(DibujarTableHead());
    table.appendChild(DibujarTableRows());
    $divLista.appendChild(table);
  }
}

function DibujarTableHead() {
  let tr = document.createElement("tr");
  for (let entrie of Object.entries(mascotas[0])) {
    if (entrie[0] != "id") {
      let th = document.createElement("th");
      th.innerText = entrie[0];
      tr.appendChild(th);
    }
  }
  return tr;
}

function DibujarTableRows() {
  let tbody = document.createElement("tbody");
  mascotas.forEach((art) => {
    let tr = document.createElement("tr");
    for (let entrie of Object.entries(art)) {
      if (entrie[0] === "id") {
        tr.setAttribute("data-id", entrie[1]);
      } else {
        let td = document.createElement("td");
        td.innerText = entrie[1];
        tr.appendChild(td);
        tbody.appendChild(tr);
      }
    }
  });
  return tbody;
}

function limpiarForm(e) {
  e.preventDefault();
  form.reset();
  ChangeTextButton("send", "Alta");
  hideDeleteButton(form);
}

function ChangeTextButton(idButton, value) {
  let sendButton = document.getElementById(idButton);
  sendButton.value = value;
}

function showDeleteButton(form) {
  let button = document.getElementById("delete");
  if (!button) {
    button = document.createElement("input");
    button.setAttribute("type", "submit");
    button.setAttribute("value", "Eliminar");
    button.setAttribute("id", "delete");
    button.addEventListener("click", handlerDeleteClick);
  }
  form.appendChild(button);
}

function hideDeleteButton(form) {
  let button = document.getElementById("delete");
  if (button) {
    form.removeChild(button);
  }
}

function AgregarMascota(mascota) {
  mascotas.push(mascota);
}
