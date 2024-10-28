import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2'
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  esAdmin:boolean = false;
  auth = inject(AuthService)
  resultadoInput: string="";
  
  abrirModal(){
    Swal.fire({
      title: "Enter your IP address",
      input: "text",
      inputLabel: "Your IP address",
      inputValue: "",
      showCancelButton: true, 
    }).then((result) => {
      this.resultadoInput = result.value;
    });
  }
}

