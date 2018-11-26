import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() alert: Alert
  @Input() onClose: () => void

  alertClassName: string

  constructor() { }

  ngOnInit() {
  }

}

export enum AlertType {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  COMMON = ''
}

export interface Alert {
  message: string,
  alertType: AlertType
}