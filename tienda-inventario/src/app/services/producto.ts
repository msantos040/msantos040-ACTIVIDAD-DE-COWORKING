import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productos: Producto[] = [];

  obtenerProductos(): Producto[] {
    return this.productos;
  }

  agregarProducto(producto: Producto): void {
    this.productos.push(producto);
  }

  actualizarProducto(producto: Producto): void {
    const indice = this.productos.findIndex(
      p => p.codigo === producto.codigo
    );

    if (indice !== -1) {
      this.productos[indice] = producto;
    }
  }

  eliminarProducto(codigo: string): void {
    this.productos = this.productos.filter(
      p => p.codigo !== codigo
    );
  }
}