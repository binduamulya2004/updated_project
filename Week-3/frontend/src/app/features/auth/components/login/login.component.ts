import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }



  onSubmit() {
    if (this.loginForm.valid) {
      // Extract form values
      const credentials = this.loginForm.value;
      console.log('login details:', credentials);

      // Call the login method of AuthService
      this.authService.login(credentials).subscribe(
        (response: { accessToken: string; refreshToken: string }) => {
          // Assuming the response contains the access and refresh tokens
          console.log('response', response);
          const accessToken = response.accessToken;
          const refreshToken = response.refreshToken;
          console.log('accessToken', accessToken);
          console.log('refreshToken', refreshToken);
          if (accessToken && refreshToken) {
            // Store the tokens in localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            alert('Login successful!');
            // this.toastr.success('Login successful!', 'Success');
            // Redirect to dashboard after successful login
            this.router.navigate(['/dashboard']);
          }
        },
        (error: any) => {
         alert('Login failed. Please check your credentials and try again.');
          console.error('Login failed', error);
        }
      );
    }
  }

  redirectToRegister(): void {
    this.router.navigate(['/register']);
  }
  redirectToForgetPassword(){
    this.router.navigate(['/forgetpassword'])
  }
}
