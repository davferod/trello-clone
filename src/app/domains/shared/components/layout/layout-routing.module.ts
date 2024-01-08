import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { UsersComponent } from '@domains/users/users.component';
import { authGuard } from '@domains/auth/guards/auth.guard';
import { ProfileComponent } from '@domains/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'boards',
        pathMatch: 'full'
      },
      {
        path: 'boards',
        canActivate: [authGuard],
        loadChildren: () =>
          import('@domains/boards/boards-routing.module').then((m) => m.BoardsRoutingModule),
      },
      {
        path: 'users',
        canActivate: [authGuard],
        component: UsersComponent
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        component: ProfileComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
