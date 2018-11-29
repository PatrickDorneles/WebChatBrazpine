import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserSignIn, TokenSignInReceiver } from "src/entities";
import { DEFAULT_API_URL } from "../url.services";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class SignInService {

    constructor(private http: HttpClient) { }

    signInUser(user: UserSignIn): Promise<TokenSignInReceiver> {
        return this.http.post<TokenSignInReceiver>(`${DEFAULT_API_URL}/auth/`, user, httpOptions).toPromise()
    }

}
