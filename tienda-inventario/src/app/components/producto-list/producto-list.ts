import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css'
})
export class ProductoList implements OnInit {

  productos: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productos = this.productoService.obtenerProductos();
  }

  editarProducto(producto: Producto): void {
    this.productoService.actualizarProducto(producto);
  }

  eliminarProducto(producto: Producto): void {

    const confirmar = confirm(
      `¿Desea eliminar el producto "${producto.nombre}"?`
    );

    if (confirmar) {
      this.productoService.eliminarProducto(producto.codigo);
      this.productos = this.productoService.obtenerProductos();
    }
  }

  calcularGanancia(producto: Producto): number {
    return producto.precioVenta - producto.precioCompra;
  }

  calcularValorInventario(producto: Producto): number {
    return producto.precioCompra * producto.existencias;
  }

  calcularValorTotalInventario(): number {
    return this.productos.reduce(
      (total, producto) =>
        total + this.calcularValorInventario(producto),
      0
    );
  }

  calcularGananciaTotal(): number {
    return this.productos.reduce(
      (total, producto) =>
        total + this.calcularGanancia(producto) * producto.existencias,
      0
    );
  }

  tieneStockBajo(producto: Producto): boolean {
    return producto.existencias <= producto.stockMinimo;
  }
}