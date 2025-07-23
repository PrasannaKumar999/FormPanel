import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }

  onLogin(): void {
    const username = this.loginForm.get('username')?.value;
    localStorage.setItem('username', username);
    this.router.navigate(['/home']);
  }

  onClear(): void {
    this.loginForm.reset();
  }
}
