import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.css']
})
export class ProductoFormComponent
  implements OnInit {

  productoForm!: FormGroup;

  readonly maxCaracteres: number = 250;

  private editingCodigo: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.inicializarFormulario();

    const codigo =
      this.route.snapshot.paramMap.get('codigo');

    if (codigo) {
      this.cargarParaEdicion(codigo);
    }
  }

  inicializarFormulario(): void {

    this.productoForm = this.fb.group(
      {

        codigo: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            this.validarCodigoDuplicado()
          ]
        ],

        nombre: [
          '',
          Validators.required
        ],

        categoria: [
          '',
          Validators.required
        ],

        precioCompra: [
          0,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        precioVenta: [
          0,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        existencias: [
          0,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        stockMinimo: [
          0,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        proveedor: [
          '',
          Validators.required
        ],

        fechaIngreso: [
          new Date()
            .toISOString()
            .substring(0, 10),
          Validators.required
        ],

        descripcion: [
          '',
          Validators.maxLength(
            this.maxCaracteres
          )
        ],

        activo: [
          true,
          Validators.required
        ]

      },
      {
        validators: [
          this.validarPrecios
        ]
      }
    );
  }

  get caracteresRestantes(): number {

    const control =
      this.productoForm.get(
        'descripcion'
      );

    const cantidad =
      control?.value
        ? control.value.length
        : 0;

    return this.maxCaracteres - cantidad;
  }

  validarPrecios(
    group: AbstractControl
  ): ValidationErrors | null {

    const precioCompra =
      group.get('precioCompra')?.value;

    const precioVenta =
      group.get('precioVenta')?.value;

    if (
      precioCompra !== null &&
      precioVenta !== null &&
      precioVenta <= precioCompra
    ) {

      return {
        precioVentaInvalido: true
      };
    }

    return null;
  }

  validarCodigoDuplicado(): ValidatorFn {

    return (
      control: AbstractControl
    ): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      const codigo =
        control.value
          .toString()
          .trim()
          .toLowerCase();

      const productos =
        this.productoService
          .obtenerProductos();

      const existe =
        productos.some(producto => {

          if (
            this.editingCodigo &&
            producto.codigo.toLowerCase() ===
            this.editingCodigo.toLowerCase()
          ) {
            return false;
          }

          return (
            producto.codigo
              .toLowerCase() === codigo
          );
        });

      return existe
        ? { codigoDuplicado: true }
        : null;
    };
  }

  onSubmit(): void {

    if (this.productoForm.invalid) {

      this.productoForm.markAllAsTouched();

      return;
    }

    const productoData: Producto = {
      ...this.productoForm.getRawValue()
    };

    try {

      if (this.editingCodigo) {

        productoData.codigo =
          this.editingCodigo;

        this.productoService
          .actualizarProducto(
            productoData
          );

        console.log(
          'Producto actualizado con éxito'
        );

      } else {

        this.productoService
          .agregarProducto(
            productoData
          );

        console.log(
          'Producto guardado con éxito'
        );
      }

      this.editingCodigo = null;

      this.router.navigate([
        '/list'
      ]);

    } catch (error) {

      console.error(
        'Error al guardar el producto:',
        error
      );
    }
  }

  cargarParaEdicion(
    codigo: string
  ): void {

    const producto =
      this.productoService
        .obtenerProductos()
        .find(
          p => p.codigo === codigo
        );

    if (!producto) {

      console.error(
        'Producto no encontrado'
      );

      this.router.navigate([
        '/list'
      ]);

      return;
    }

    this.editingCodigo =
      producto.codigo;

    this.productoForm.patchValue({

      codigo: producto.codigo,

      nombre: producto.nombre,

      categoria: producto.categoria,

      precioCompra:
        producto.precioCompra,

      precioVenta:
        producto.precioVenta,

      existencias:
        producto.existencias,

      stockMinimo:
        producto.stockMinimo,

      proveedor:
        producto.proveedor,

      fechaIngreso:
        producto.fechaIngreso,

      descripcion:
        producto.descripcion,

      activo:
        producto.activo

    });

    this.productoForm
      .get('codigo')
      ?.disable();
  }
}