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

  userSearch: string

  contacts: ContactUser[]
  searchedUsers: ContactUser[]

  chats: Chat[]
  activeChat: Chat

  searchingUsers: boolean

  moreActive: boolean

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
    this.searchedUsers = []
    this.user = { id: -1, name: '', nickname: '', imageUrl: '', birthday: new Date(), isAdmin: false }
    await this.getAuthenticatedUser()
    await this.getChatsFromAuth()

    this.token = localStorage.getItem('token')

    this.initializeSocket()


  }

  onClickToLogout() {
    localStorage.setItem('token', '')
    this.router.navigateByUrl('/')
  }

  onClickToMore() {
    this.moreActive = !this.moreActive
  }

  onClickToSearchUsers() {
    this.searchingUsers = !this.searchingUsers
  }

  async searchUsers() {
    const contactsFound = await this.userService.searchUsers(this.userSearch)
    this.searchedUsers = contactsFound
  }

  cleanSearch() {
    this.userSearch = ''
  }

  async getAuthenticatedUser() {
    try {
      console.log('here');

      const userObj = await this.userService.getAuthenticatedUser()
      console.log('or here');
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

  clickContactOpenChat(contact: ContactUser) {
    const isContactInContacts = this.contacts.find(c => c.id === contact.id)

    if (!isContactInContacts) {
      const newChat: Chat = {
        contact,
        messages: []
      }
      this.activeChat = newChat
      this.pullMessagesScrollToEnd()
      this.cleanSearch()
      this.searchedUsers = []
      this.searchingUsers = false
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

  initializeSocket() {
    this.socket = this.socketService.connect(this.token)

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

}

interface MessageRequest {
  token: string
  contactId: number
  message: string
}