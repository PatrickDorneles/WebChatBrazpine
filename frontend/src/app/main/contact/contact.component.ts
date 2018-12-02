import { Component, OnInit, Input } from '@angular/core';
import { ContactUser } from 'src/entities';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  @Input() contact: ContactUser
  @Input() onClick: (contact: ContactUser) => void

  constructor() { }

  ngOnInit() {
  }

}
