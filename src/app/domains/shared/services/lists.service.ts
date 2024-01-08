import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { List, CreateListDto } from '@shared/models/list.model';
import { checkToken } from '@interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  apiUrl = environment.API_URL;
  private http = inject(HttpClient);

  createList(newList: CreateListDto) {
    return this.http.post<List>(`${this.apiUrl}/api/v1/lists`, newList, {
      context: checkToken(),
    });
  }


}
