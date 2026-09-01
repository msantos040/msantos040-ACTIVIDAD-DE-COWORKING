import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-producto-list',
  imports: [FormsModule],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css'
})
export class ProductoList implements OnInit {

  productos: Producto[] = [];

  productosFiltrados: Producto[] = [];

  textoBusqueda: string = '';

  categoriaSeleccionada: string = '';

  categorias: string[] = [
    'Alimentos',
    'Bebidas',
    'Tecnología',
    'Librería',
    'Limpieza',
    'Otros'
  ];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productos = this.productoService.obtenerProductos();
    this.productosFiltrados = this.productos;
  }

  buscar(): void {
    const texto = this.textoBusqueda.toLowerCase().trim();

    this.productosFiltrados = this.productos.filter(producto => {

      const coincideTexto =
        producto.codigo.toLowerCase().includes(texto) ||
        producto.nombre.toLowerCase().includes(texto);

      const coincideCategoria =
        this.categoriaSeleccionada === '' ||
        producto.categoria === this.categoriaSeleccionada;

      return coincideTexto && coincideCategoria;
    });
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.categoriaSeleccionada = '';
    this.productosFiltrados = this.productos;
  }

  editarProducto(producto: Producto): void {
    this.productoService.actualizarProducto(producto);
    this.productos = this.productoService.obtenerProductos();
    this.buscar();
  }

  eliminarProducto(producto: Producto): void {

    const confirmar = confirm(
      `¿Desea eliminar el producto "${producto.nombre}"?`
    );

    if (confirmar) {
      this.productoService.eliminarProducto(producto.codigo);

      this.productos = this.productoService.obtenerProductos();

      this.buscar();
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
