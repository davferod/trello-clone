import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CdkTableModule} from '@angular/cdk/table';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { MeService } from '@shared/services/me.service';
import { UsersStore } from '@shared/services/users-store';
import { AuthService } from '@shared/services/auth.service';
import { Users } from '@shared/models/users.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, CdkTableModule, ReactiveFormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private meService = inject(MeService);
  private usersStore = inject(UsersStore);
  columns: string[] = ['id', 'avatar', 'name', 'email'];
  input = new FormControl('', { nonNullable: true });

  users =  this.usersStore.users;
  originalData = this.usersStore.originalData;
  user: Users | null = null;


  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.meService.getMeProfile()
    .subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err: Error) => {
        console.error(err);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }
}
