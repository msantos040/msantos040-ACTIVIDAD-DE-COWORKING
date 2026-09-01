import { Component } from '@angular/core';
import { Producto } from '../../models/producto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-producto-list',
  imports: [FormsModule],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css'
})

export class ProductoList {

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

  constructor() {
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
}
