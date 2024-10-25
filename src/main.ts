import { bootstrapApplication } from '@angular/platform-browser';
// src/main.ts

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component'; // Importa el componente standalone
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule) // Arranca la aplicación con el componente standalone
  .catch(err => console.error(err));
