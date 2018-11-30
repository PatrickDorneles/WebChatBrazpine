import { Component, OnInit, Input } from '@angular/core';
import { Alert } from '../alert/alert.component';
import { UserSignIn } from 'src/entities';
import { SignInService } from 'src/service/';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private signInService: SignInService, private router: Router) { }

  @Input() signin: UserSignIn

  alert?: Alert


  ngOnInit() {
    this.alert = undefined
    this.signin = {
      nickname: '',
      password: ''
    }
  }

  closeAlert() {
    this.alert = undefined
  }

  async onClickLogin() {
    try {
      const tokenObj = await this.signInService.signInUser(this.signin)

      localStorage.setItem('token', `Bearer ${tokenObj.token}`)

      this.router.navigate(['main'])
    } catch (error) {
      this.alert = {
        message: error.error.message
      }
    }
  }

}
