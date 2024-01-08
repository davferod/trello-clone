import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@shared/models/users.model';
import { Card, UpdateCardDto, CreateCardDto } from '@shared/models/card.model';
import { checkToken } from '@interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  apiUrl = environment.API_URL;
  private http = inject(HttpClient);

  createCard(card: CreateCardDto) {
    return this.http.post<Card>(`${this.apiUrl}/api/v1/cards`, card, {
      context: checkToken(),
    });
  }

  updateCard(id: Card['id'], changes:UpdateCardDto) {
    return this.http.put<User>(`${this.apiUrl}/api/v1/cards/${id}`, changes, {
      context: checkToken(),
    });
  }


}
