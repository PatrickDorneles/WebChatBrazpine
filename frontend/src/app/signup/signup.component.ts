import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor() { }

  firstCardClassname: string
  secondCardClassname: string
  ngOnInit() {
    this.firstCardClassname = 'input-card first-focus'
    this.secondCardClassname = 'input-card'

  }

  onClickToSecondCard() {
    this.secondCardClassname = 'input-card focus'
  }



}
