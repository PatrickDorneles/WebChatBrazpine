import { Component, OnInit } from '@angular/core';
import { AuthenticatedUser } from 'src/entities';
import { UserService } from 'src/service/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  private user: AuthenticatedUser

  constructor(private userService: UserService, private router: Router) { }

  async ngOnInit() {
    this.user = {
      id: -1,
      name: '',
      nickname: '',
      imageUrl: '',
      birthday: new Date(),
      isAdmin: false
    }

    await this.getAuthenticatedUser()
  }

  async getAuthenticatedUser() {
    try {
      const userObj = await this.userService.getAuthenticatedUser()
      this.user = userObj.user
    } catch (error) {
      this.router.navigateByUrl('/')
    }
  }

}
