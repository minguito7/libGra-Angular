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
import { PanelAdminComponent } from './panel-admin/panel-admin.component';
import { PanelContactoComponent } from './panel-contacto/panel-contacto.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { error404Componente } from './shared/404/404.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    PerfilUserComponent,
    BookReaderComponent,
    PanelAdminComponent,
    PanelContactoComponent,
    NavbarComponent,
    FooterComponent,
    error404Componente
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
