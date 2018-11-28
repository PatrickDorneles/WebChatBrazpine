import { Component, OnInit, Input } from '@angular/core';
import { Alert } from '../alert/alert.component';
import { SignUpService } from 'src/service';
import { UserSignUp, ReceivedSignUpUser } from 'src/entities';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  @Input() signup: SignUpInputs

  alert?: Alert

  constructor(private signUpService: SignUpService) { }

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

  async onClickSignUp() {
    const signUp: SignUpInputs = this.signup

    if (signUp.password !== signUp.rePassword) {
      this.alert = {
        message: "The writen passwords aren't equivalent"
      }
    }

    const signUpUser: UserSignUp = {
      name: signUp.name,
      nickname: signUp.nickname,
      password: signUp.password,
      birthday: signUp.birthday,
      isAdmin: signUp.isAdmin,
      imageUrl: signUp.imageUrl
    }


    try {
      const receivedUser: ReceivedSignUpUser = await this.signUpService.signUpUser(signUpUser)
      this.alert = {
        message: "User registered with success"
      }
    } catch (error) {
      this.alert = {
        message: error.error.message
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
