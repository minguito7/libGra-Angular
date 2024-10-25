import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PdfStorageService {
  private pdfFile: string | null = null;

  // Guardar el archivo PDF
  setPdfFile(file: string) {
    this.pdfFile = file;
  }

  // Obtener el archivo PDF
  getPdfFile(): string | null {
    return this.pdfFile;
  }

  // Limpiar el archivo
  clearPdfFile() {
    this.pdfFile = null;
  }
}
