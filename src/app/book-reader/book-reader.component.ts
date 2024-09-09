import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../services/book.service';
import { PdfStorageService } from '../services/pdf.service';

import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-book-reader',
  templateUrl: './book-reader.component.html',
  styleUrl: './book-reader.component.css'
})
export class BookReaderComponent implements OnInit{
  @ViewChild('pdfCanvas', { static: true }) pdfCanvas!: ElementRef<HTMLCanvasElement>;
  pdfDoc: any = null;
  currentPage = 1;
  totalPages: number = 0;
  zoom = 1.0;
  app!:string;

  constructor(private bookService: BookService, private pdfService: PdfStorageService){}
  
  ngOnInit(){
        // Configurar worker de PDF.js
    this.pdfDoc= this.pdfService.getPdfFile()
    console.log(this.pdfDoc);
  }

  disableContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  async loadPdf(url: string) {
    const loadingTask = pdfjsLib.getDocument(url);
    this.pdfDoc = await loadingTask.promise;
    this.totalPages = this.pdfDoc.numPages;
    this.renderPage(this.currentPage);
  }

  async renderPage(pageNumber: number) {
    const page = await this.pdfDoc.getPage(pageNumber);
    const canvas = this.pdfCanvas.nativeElement;
    const context = canvas.getContext('2d');

    const viewport = page.getViewport({ scale: this.zoom });

    // Ajusta el tamaño del canvas según el tamaño del PDF
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Renderizar el PDF en el canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    await page.render(renderContext).promise;
  }

  goToPage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.renderPage(pageNumber);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.renderPage(this.currentPage);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderPage(this.currentPage);
    }
  }

  zoomIn() {
    this.zoom += 0.2;
    this.renderPage(this.currentPage);
  }

  zoomOut() {
    if (this.zoom > 0.4) {
      this.zoom -= 0.2;
      this.renderPage(this.currentPage);
    }
  }

}
