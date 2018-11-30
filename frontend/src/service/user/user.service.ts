import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";

import { DEFAULT_API_URL } from '../url.services'
import { AuthenticatedUser } from 'src/entities';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    public async getAuthenticatedUser() {
        const httpOptions = {
            headers: new HttpHeaders({ 'authorization': localStorage.getItem('token') })
        };
        return await this.http.get<{ user: AuthenticatedUser }>(`${DEFAULT_API_URL}/auth`, httpOptions).toPromise()

    }

}
