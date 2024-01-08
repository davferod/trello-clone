import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormControl, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { BoardsService } from '@shared/services/boards.service';
import { Colors} from '@shared/models/colors.model';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-board-form',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './board-form.component.html'
})
export class BoardFormComponent {

  @Output() closeOverlay = new EventEmitter<boolean>();

  form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required]],
    backgroundColor: new FormControl<Colors>('sky', {
      nonNullable: true,
      validators: [Validators.required]
    })
  })

  constructor (
    private formBuilder: FormBuilder,
    private boardService: BoardsService,
    private router: Router
    ) {

  }

  doSave () {
    if (this.form.valid) {
      const {title, backgroundColor} = this.form.getRawValue()
      console.log(title, backgroundColor)
      this.boardService.createBoard(title, backgroundColor)
      .subscribe(board => {
        this.closeOverlay.next(false)
        console.log(board)
        this.router.navigate(['/app/boards', board.id])
      })
    } else {
      this.form.markAllAsTouched();
    }
  }


}
