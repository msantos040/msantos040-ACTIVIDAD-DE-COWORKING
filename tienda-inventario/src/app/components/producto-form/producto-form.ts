import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.css']
})
export class ProductoFormComponent implements OnInit {
  productoForm!: FormGroup;
  readonly maxCaracteres: number = 250;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  private editingCodigo: string | null = null;

  ngOnInit(): void {
    this.inicializarFormulario();
    // Si viene un parámetro de ruta con código, cargar producto para edición
    const codigo = this.route.snapshot.paramMap.get('codigo');
    if (codigo) {
      this.cargarParaEdicion(codigo);
    }
  }

  inicializarFormulario(): void {
    this.productoForm = this.fb.group(
      {
        codigo: [
          '',
          [Validators.required, Validators.minLength(3), this.validarCodigoDuplicado()]
        ],
        nombre: ['', [Validators.required]],
        categoria: ['', [Validators.required]],
        precioCompra: [0, [Validators.required, Validators.min(0)]],
        precioVenta: [0, [Validators.required, Validators.min(0)]],
        existencias: [0, [Validators.required, Validators.min(0)]],
        stockMinimo: [0, [Validators.required, Validators.min(0)]],
        proveedor: ['', [Validators.required]],
        fechaIngreso: [new Date().toISOString().substring(0, 10), [Validators.required]],
        descripcion: ['', [Validators.maxLength(this.maxCaracteres)]],
        activo: [true, [Validators.required]]
      },
      {
        validators: [this.validarPrecios]
      }
    );
  }

  get caracteresRestantes(): number {
    const descripcionControl = this.productoForm.get('descripcion');
    const cantidadEscrita = descripcionControl?.value ? descripcionControl.value.length : 0;
    return this.maxCaracteres - cantidadEscrita;
  }

  validarPrecios(group: AbstractControl): ValidationErrors | null {
    const precioCompra = group.get('precioCompra')?.value;
    const precioVenta = group.get('precioVenta')?.value;

    if (precioCompra !== null && precioVenta !== null && precioVenta <= precioCompra) {
      return { precioVentaInvalido: true };
    }

    return null;
  }

  validarCodigoDuplicado(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const productos: Producto[] = this.productoService.obtenerProductos();
      const existe = productos.some(
        p => p.codigo.toLowerCase() === control.value.toString().toLowerCase()
      );

      return existe ? { codigoDuplicado: true } : null;
    };
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const productoData: Producto = this.productoForm.value;

    try {
      if (this.editingCodigo) {
        // mantener el mismo código si se editó
        productoData.codigo = this.editingCodigo;
        this.productoService.actualizarProducto(productoData);
        console.log('Producto actualizado con éxito');
      } else {
        this.productoService.agregarProducto(productoData);
        console.log('Producto guardado con éxito');
      }

      this.productoForm.reset({
        precioCompra: 0,
        precioVenta: 0,
        existencias: 0,
        stockMinimo: 0,
        fechaIngreso: new Date().toISOString().substring(0, 10),
        activo: true
      });
      this.editingCodigo = null;
      // Regresar a la lista después de guardar/actualizar
      this.router.navigate(['list']);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  }

  cargarParaEdicion(codigo: string): void {
    const producto = this.productoService.obtenerProductos().find(p => p.codigo === codigo);
    if (!producto) {
      return;
    }
    this.editingCodigo = producto.codigo;
    this.productoForm.patchValue({
      codigo: producto.codigo,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precioCompra: producto.precioCompra,
      precioVenta: producto.precioVenta,
      existencias: producto.existencias,
      stockMinimo: producto.stockMinimo,
      proveedor: producto.proveedor,
      fechaIngreso: producto.fechaIngreso,
      descripcion: producto.descripcion,
      activo: producto.activo
    });
  }
}