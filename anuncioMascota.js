import Anuncio from "./anuncio.js";

export class AnuncioMascota extends Anuncio {
  constructor(
    id,
    titulo,
    transaccion,
    descripcion,
    precio,
    animal,
    raza,
    fecha,
    vacuna
  ) {
    super(id, titulo, transaccion, descripcion, precio);
    this.animal = animal;
    this.raza = raza;
    this.fecha = fecha;
    this.vacuna = vacuna;
  }
}
