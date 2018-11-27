import { Component, OnInit, Input } from '@angular/core';
import { Alert, AlertType } from '../alert/alert.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  @Input() signup: SignUpInputs

  alert?: Alert

  constructor() { }

  ngOnInit() {
    this.alert = undefined
    this.signup = {
      name: '',
      nickname: '',
      password: '',
      rePassword: '',
      birthday: new Date(),
      isAdmin: true,
      imageUrl: ''
    }
  }

  closeAlert() {
    this.alert = undefined
  }

  onClickSignUp() {
    const signUp: SignUpInputs = this.signup

    if (signUp.password !== signUp.rePassword) {
      this.alert = {
        message: "The writen passwords aren't equivalent",
        alertType: AlertType.ERROR
      }
    }

  }

}

interface SignUpInputs {
  name: string
  nickname: string
  password: string
  rePassword: string
  birthday: Date
  isAdmin: boolean
  imageUrl: ''
}
