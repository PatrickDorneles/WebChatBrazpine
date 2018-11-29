import { Component, OnInit, Input } from '@angular/core';
import { Alert } from '../alert/alert.component';
import { UserSignIn } from 'src/entities';
import { SignInService } from 'src/service/';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(private signInService: SignInService) { }

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
      console.log(tokenObj.token);
    } catch (error) {
      this.alert = {
        message: error.error.message
      }
    }
  }

}
