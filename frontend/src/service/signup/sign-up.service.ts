import { Injectable } from '@angular/core';
import { ReceivedSignUpUser, UserSignUp } from '../../entities'
import { DEFAULT_API_URL } from '../url.services'
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient) { }

  signUpUser(user: UserSignUp): Promise<ReceivedSignUpUser> {
    return this.http.post<ReceivedSignUpUser>(`${DEFAULT_API_URL}/user/signup`, {
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      isAdmin: user.isAdmin,
      birthday: user.birthday,
      imageUrl: user.imageUrl
    }, httpOptions).toPromise()
  }

}
