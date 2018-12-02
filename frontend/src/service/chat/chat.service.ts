import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Chat } from "src/entities";
import { DEFAULT_API_URL } from "../url.services";


@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(private http: HttpClient) { }

    public async getChatsFromAuth() {
        const httpOptions = {
            headers: new HttpHeaders({ 'authorization': localStorage.getItem('token') })
        };
        return await this.http.get<Chat[]>(`${DEFAULT_API_URL}/chat`, httpOptions).toPromise()
    }

}