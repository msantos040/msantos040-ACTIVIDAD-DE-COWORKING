import { Routes } from '@angular/router';
import { ProductoList } from './components/producto-list/producto-list';
import { ProductoFormComponent } from './components/producto-form/producto-form';

export const routes: Routes = [
	{ path: '', redirectTo: 'list', pathMatch: 'full' },
	{ path: 'list', component: ProductoList },
	{ path: 'create', component: ProductoFormComponent },
	{ path: 'edit/:codigo', component: ProductoFormComponent },
	{ path: '**', redirectTo: 'list' }
];
