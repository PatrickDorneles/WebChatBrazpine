import { Component, OnInit, Input } from '@angular/core';
import { AuthenticatedUser, ContactUser, Chat, MessageWithContact, Message } from 'src/entities';
import { Router } from '@angular/router';
import { SocketService, UserService } from 'src/service';
import { ChatService } from 'src/service/chat/chat.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  private token: string
  private user: AuthenticatedUser
  private socket: SocketIOClient.Socket

  _userSearch: string

  contacts: ContactUser[]
  searchedUsers: ContactUser[]

  chats: Chat[]
  activeChat: Chat

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private chatService: ChatService,
    private router: Router) {
    this.clickContactOpenChat = this.clickContactOpenChat.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  async ngOnInit() {
    this.chats = []
    this.contacts = []
    this.user = { id: -1, name: '', nickname: '', imageUrl: '', birthday: new Date(), isAdmin: false }
    await this.getAuthenticatedUser()
    await this.getChatsFromAuth()

    this.token = localStorage.getItem('token')

    this.socket = this.socketService.connect(this.token)

    this.socket.on('search_result', (contactsFound: ContactUser[]) => {
      this.searchedUsers = contactsFound
    })

    this.socket.on('new_chat', (chatResponse: Chat) => {
      this.chats.push(chatResponse)
      this.contacts.push(chatResponse.contact)
      this.activeChat = chatResponse
    })

    this.socket.on('new_message', (message: MessageWithContact) => {
      const contactChat = this.chats.find(c => c.contact.id === message.contactId)
      contactChat.messages.push(message as Message)
      this.pullMessagesScrollToEnd()
    })
  }

  async getAuthenticatedUser() {
    try {
      const userObj = await this.userService.getAuthenticatedUser()
      this.user = userObj.user
    } catch (error) {
      this.router.navigateByUrl('/')
    }
  }

  async getChatsFromAuth() {
    const chats: Chat[] = await this.chatService.getChatsFromAuth()

    this.chats = chats
    this.contacts = chats.map(c => c.contact)
    this.activeChat = this.chats[0];
  }

  sendMessage(message: string) {

    if (!message) {
      return
    }

    const chat: Chat = this.activeChat

    const messageReq: MessageRequest = {
      token: this.token,
      contactId: chat.contact.id,
      message: message
    }

    this.socket.emit('message', messageReq)
  }

  @Input()
  set userSearch(search: string) {
    this._userSearch = search
    if (this._userSearch) {
      this.socket.emit('search_user', { search: this._userSearch, token: this.token })
    }
  }

  get userSearch() {
    return this._userSearch
  }

  clickContactOpenChat(contact: ContactUser) {
    const isContactInContacts = this.contacts.find(c => c.id === contact.id)

    if (!isContactInContacts) {
      const newChat: Chat = {
        contact,
        messages: []
      }
      this.activeChat = newChat
      this.pullMessagesScrollToEnd()
    } else {
      const chatWithContact: Chat = this.chats.find(c => c.contact.id === contact.id)
      this.activeChat = chatWithContact
      this.pullMessagesScrollToEnd()
    }

  }

  pullMessagesScrollToEnd() {
    setTimeout(() => {
      const objDiv = document.getElementById("messages");
      objDiv.scrollTop = objDiv.scrollHeight;
    })
  }

}

interface MessageRequest {
  token: string
  contactId: number
  message: string
}