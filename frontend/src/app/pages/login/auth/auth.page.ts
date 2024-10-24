import { ApiRestService } from '../../../servicios/api-rest.service';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.css',
})
export class AuthPage {
  email: string = '';
  password: string = '';

  private apiService: ApiRestService = inject(ApiRestService);
  private router: Router = inject(Router);

  async onSubmit() {
    console.log(this.email);
    console.log(this.password);
    const sent = await this.apiService.post(
      'auth/login',
      JSON.stringify({ email: this.email, contrasena: this.password })
    );
    console.log(sent);
    this.apiService.setToken(sent.token);
    this.router.navigate(['/inicio']);
  }
}
