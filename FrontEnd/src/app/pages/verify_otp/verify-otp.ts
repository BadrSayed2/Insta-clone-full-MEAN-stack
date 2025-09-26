import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth-service';

@Component({
  selector: 'app-verify-otp',
  imports: [FormsModule],
  templateUrl: './verify-otp.html',
})
export class VerifyOtp {
  code: string = ""
  constructor(private authService: AuthService, private router: Router) { }
  onSubmit() {
    // console.log(this.code);

    this.authService.verify_otp(this.code).subscribe((res: any) => {

      const is_success = res?.status == "success"
      console.log(res);
      
      if (is_success) {
        this.router.navigate(['/home'])
      }
    })
  }
}
