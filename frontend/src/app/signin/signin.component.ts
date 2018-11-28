import { Component, OnInit } from '@angular/core';
import { Alert } from '../alert/alert.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  alert?: Alert

  constructor() { }

  ngOnInit() {
    this.alert = undefined
  }

  closeAlert() {
    this.alert = undefined
  }

  onClickOpenAlert() {
    this.alert = {
      message: 'Teste'
    }
  }

}
