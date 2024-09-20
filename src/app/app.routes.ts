// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { PerfilUserComponent } from './perfil-user/perfil-user.component';
import { BookReaderComponent } from './book-reader/book-reader.component';
import { PanelAdminComponent } from './panel-admin/panel-admin.component';
import { PanelContactoComponent } from './panel-contacto/panel-contacto.component';

// src/app/app-routing.module.ts

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'perfil-user', component: PerfilUserComponent },
  { path: 'book-reader/:bookId', component: BookReaderComponent },
  { path: 'panel-admin', component: PanelAdminComponent },
  { path: 'panel-contacto', component: PanelContactoComponent },
  { path: '**', redirectTo: '' } // Redirige cualquier ruta desconocida a HomeComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutesModule { }
