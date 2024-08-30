import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';  // Importa ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule, // Asegúrate de que ReactiveFormsModule esté en los imports
    HttpClientModule,
    CommonModule,
    
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
