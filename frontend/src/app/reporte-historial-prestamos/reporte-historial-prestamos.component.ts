import { Component } from '@angular/core';
import { Historial } from '../historial';
import { HistorialService } from '../historial.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reporte-historial-prestamos',
  standalone: false,
  templateUrl: './reporte-historial-prestamos.component.html',
  styleUrl: './reporte-historial-prestamos.component.css'
})
export class ReporteHistorialPrestamosComponent {

 filtroBusqueda: string = '';
 
  p: number = 1;  
  itemsPerPage: number = 10;
  HistorialPrestamos: Historial[];

  constructor(private HistorialPrestamosService: HistorialService, private route: Router) {

  }

  ngOnInit(): void {

    this.obtenerMateriales();
  }
  
  private obtenerMateriales() {
    this.HistorialPrestamosService.obtenerListaHistorial().subscribe(dato => {

      this.HistorialPrestamos = dato;

    });
  }

  HistorialPrestamoFiltrado(): Historial[] {
      if (!this.filtroBusqueda.trim()) {
        return this.HistorialPrestamos;  
      }
    
      const filtro = this.filtroBusqueda.toLowerCase();
    
      return this.HistorialPrestamos.filter(cate =>
        cate.idHistorial?.toString().toLowerCase().includes(filtro) ||
        cate.prestamo?.toString().toLowerCase().includes(filtro) ||
        cate.idUsuario?.toString().toLowerCase().includes(filtro)||
        cate.material?.titulo?.toString().toLowerCase().includes(filtro)||
        cate.fechaPrestamo?.toString().toLowerCase().includes(filtro)||
         cate.fechaDevolucion?.toString().toLowerCase().includes(filtro)||
         cate.fechaRegistro?.toString().toLowerCase().includes(filtro)
      
      );
    }


      generarPDF(): void {
    // Filtrar datos si hay búsqueda
    const datos = this.HistorialPrestamoFiltrado();
    
    // Crear documento PDF
    const doc = new jsPDF('landscape');
    
    // Título del reporte
    doc.setFontSize(18);
    doc.text('Historial de Préstamos Devueltos', 14, 20);
    
    // Fecha de generación
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Configurar tabla
    const headers = [
      ['ID Historial', 'Usuario', 'ID Préstamo', 'Título Material', 'Fecha Préstamo', 'Fecha Devolución', 'Fecha Registro']
    ];
    
    const data = datos.map(item => [
      item.idHistorial || '',
      item.idUsuario || '',
      item.prestamo || '',
      item.material?.titulo || '',
      item.fechaPrestamo || '',
      item.fechaDevolucion || '',
      item.fechaRegistro || ''
    ]);
    
    // Generar tabla
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      }
    });
    
    // Guardar PDF
    doc.save('historial_prestamos.pdf');
    
    Swal.fire({
      title: 'PDF Generado',
      text: 'El historial de préstamos se ha exportado correctamente a PDF.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }
}
