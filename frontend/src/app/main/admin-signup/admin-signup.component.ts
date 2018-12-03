import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'admin-signup',
  templateUrl: './admin-signup.component.html',
  styleUrls: ['./admin-signup.component.scss']
})
export class AdminSignupComponent implements OnInit {

  @Input() signup: SignUpInputs
  @Input() closeSignUp: () => void

  constructor() { }

  ngOnInit() {
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