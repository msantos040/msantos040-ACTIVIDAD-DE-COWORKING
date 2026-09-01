export interface Producto {
  codigo: string;
  nombre: string;
  categoria: string;
  precioCompra: number;
  precioVenta: number;
  existencias: number;
  stockMinimo: number;
  proveedor: string;
  fechaIngreso: string;
  descripcion: string;
  activo: boolean;
}
