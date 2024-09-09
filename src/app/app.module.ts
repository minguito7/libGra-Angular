import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Importa ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { CommonModule, DatePipe } from '@angular/common';
import { routes } from './app.routes';
import { PerfilUserComponent } from './perfil-user/perfil-user.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { BookReaderComponent } from './book-reader/book-reader.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    PerfilUserComponent,
    BookReaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule, // Asegúrate de que ReactiveFormsModule esté en los imports
    HttpClientModule,
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule
],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
