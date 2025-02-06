import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],

})
export class RegisterComponent {
  signupForm: FormGroup;

 constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    //private toastr: ToastrService
 )
 {
    this.signupForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[^A-Za-z0-9]/), // At least one special character
        ],
      ],
      role: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const userData = this.signupForm.value;

      this.authService.register(userData).subscribe(
        (response) => {
          console.log('Register Response:', response);
          if (response.first_name && response.role) {
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('role', response.role);
            localStorage.setItem('first_name', response.first_name);
          } else {
            console.error("Missing first_name or role in response", response);
          }
          alert('Register successful!');
          this.router.navigate(['/login']);
        },
        (error) => {
          if (error.status === 500) {
            alert('User already exists. Please use a different email.');
          } else {
            alert('Registration failed. Please check your credentials and try again.');
          }
          console.error('Registration failed', error);
        }
      );
    }
  }


  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}
