import { Component, OnInit, Input } from '@angular/core';
import { Chat } from 'src/entities';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() chat: Chat
  @Input() sendMessage: (message: string) => void
  message: string

  constructor() { }

  ngOnInit() {
    this.message = ''
  }

  send() {
    console.log('here');

    this.sendMessage(this.message)
    this.message = ''
  }

}
