import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productos: Producto[] = [];
  // Datos iniciales para facilitar pruebas CRUD
  // Estos se usan si no se agregan productos desde la aplicación
  private initialProducts: Producto[] = [
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

  obtenerProductos(): Producto[] {
    // Si no hay productos, inicializar con datos de ejemplo
    if (!this.productos || this.productos.length === 0) {
      this.productos = [...this.initialProducts];
    }
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