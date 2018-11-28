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
    this.alertClassName = `alert`
  }

}


export interface Alert {
  message: string
}