import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Board } from '@shared/models/board.model';
import { TokenService } from './token.service';
import { checkToken } from '@interceptors/token.interceptor';
import { environment } from '@environments/environment';
import { Card } from '../models/card.model';
import { Colors } from '../models/colors.model';
import { List } from '../models/list.model';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  apiUrl = environment.API_URL;
  bufferSpace = 65535;
  backgroundColor$ = new BehaviorSubject<Colors>('sky');

  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  constructor() { }

  getBoard(id: Board['id']) {
    return this.http.get<Board>(`${this.apiUrl}/api/v1/boards/${id}`, {
      context: checkToken()
    })
    .pipe(
      tap(board => this.setBackgroundColor(board.backgroundColor))
    );
  }

  createBoard(title: string, backgroundColor: Colors) {
    const token = this.tokenService.getToken()
    return this.http.post<Board>(`${this.apiUrl}/api/v1/boards`, {
      title,
      backgroundColor
    }, {
      context: checkToken()
    });
  }

  getPosition(cards: Card[], currentIndex: number) {
    if (cards.length === 1 ) {
      return this.bufferSpace;
    }
    if (cards.length > 1 && currentIndex === 0) {
      const onTopPosition = cards[currentIndex + 1].position;
      return onTopPosition / 2;
    }
    const lastIndex = cards.length - 1;
    if (cards.length > 2 && currentIndex > 0 && currentIndex < lastIndex) {
      const previousCardPosition = cards[currentIndex - 1].position;
      const nextCardPosition = cards[currentIndex + 1].position;
      return (previousCardPosition + nextCardPosition) / 2;
    }
    if (cards.length > 1 && currentIndex === lastIndex) {
      const onBottomPosition = cards[lastIndex - 1].position;
      return onBottomPosition + this.bufferSpace;
    }
    return 0;
  }

  getPositionNewItem(elements: Card[] | List[]) {
    if (elements.length === 0 ) {
      return this.bufferSpace;
    }
    const lastIndex = elements.length - 1
    const onBottomPosition = elements[lastIndex].position;
    return onBottomPosition + this.bufferSpace;
  }

  setBackgroundColor(color: Colors) {
    this.backgroundColor$.next(color);
  }

}
