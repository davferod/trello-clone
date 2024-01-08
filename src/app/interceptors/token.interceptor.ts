import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpContextToken,
  HttpContext,
  HttpEvent,
} from '@angular/common/http';
import { TokenService } from '@app/domains/shared/services/token.service';
import { AuthService } from '@shared/services/auth.service';
import { inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const tokenService = inject(TokenService);

  if (req.context.get(CHECK_TOKEN)) {
    const isValidToken = tokenService.isValidToken();
    if (!isValidToken) {
      return updateAccessTokenAndRefreshToken(req, next);
    }
    return addToken(req, next);
  }
  return next(req);
}

function updateAccessTokenAndRefreshToken(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const refreshToken = tokenService.getRefreshToken();
  const isValidRefreshToken = tokenService.isValidRefreshToken();
  if (isValidRefreshToken && refreshToken) {
    return authService.refreshToken(refreshToken)
    .pipe(
      switchMap(() => addToken(req, next))
    )
  }
  return next(req);
}

function addToken(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Get the auth header from the service.
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getToken();
  // Clone the request to add the authentication header.
  const newRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
  });
  // Pass on the cloned request instead of the original request.
  return next(newRequest);
}
