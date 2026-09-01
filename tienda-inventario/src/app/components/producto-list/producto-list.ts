import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-list.html',
  styleUrls: ['./producto-list.css']
})

export class ProductoList implements OnInit {

  productos: Producto[] = [
    {
      codigo: 'TEC001',
      nombre: 'Teclado mecánico',
      categoria: 'Tecnología',
      precioCompra: 250,
      precioVenta: 400,
      existencias: 5,
      stockMinimo: 10,
      proveedor: 'Tech Supplier',
      fechaIngreso: '2026-09-01',
      descripcion: 'Teclado mecánico RGB',
      activo: true
    },
    {
      codigo: 'TEC002',
      nombre: 'Mouse inalámbrico',
      categoria: 'Tecnología',
      precioCompra: 100,
      precioVenta: 175,
      existencias: 20,
      stockMinimo: 5,
      proveedor: 'Tech Supplier',
      fechaIngreso: '2026-09-01',
      descripcion: 'Mouse inalámbrico',
      activo: true
    },
    {
      codigo: 'ALI001',
      nombre: 'Galletas',
      categoria: 'Alimentos',
      precioCompra: 5,
      precioVenta: 8,
      existencias: 30,
      stockMinimo: 10,
      proveedor: 'Distribuidora ABC',
      fechaIngreso: '2026-09-01',
      descripcion: 'Paquete de galletas',
      activo: true
    }
  ];

  productosFiltrados: Producto[] = [];

    constructor(private productoService: ProductoService, private router: Router) {
      this.productosFiltrados = this.productos;
    }
 
  ngOnInit(): void {
    this.productos = this.productoService.obtenerProductos();
  }
 
  editarProducto(producto: Producto): void {
    // Navegar a la vista de edición para el producto
    this.router.navigate(['edit', producto.codigo]);
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

  trackByCodigo(index: number, producto: Producto): string {
    return producto.codigo;
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.categoriaSeleccionada = '';
    this.productosFiltrados = this.productos;
  }
}
