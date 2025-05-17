import { Component } from '@angular/core';
import { Categoria } from '../categoria';
import { CategoriaService } from '../categoria.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-categoria',
  standalone: false,
  templateUrl: './agregar-categoria.component.html',
  styleUrl: './agregar-categoria.component.css'
})
export class AgregarCategoriaComponent {

  
  categoria: Categoria = new Categoria();

  constructor(private idiomaServicio: CategoriaService, private router:Router) { }

   ngOnInit(): void {
    // Inicializa el objeto idioma si es necesario
   
  }

  guardarCategoria() {
    this.idiomaServicio.registrarCategoria(this.categoria).subscribe(dato => {
      console.log(dato);
      this.irALaListaCategorias();
    }, error => console.log(error));
  }

  irALaListaCategorias() {
    this.router.navigate(['/list_categorias']);
  }

  onSubmit() {
     this.guardarCategoria()
  }


}
