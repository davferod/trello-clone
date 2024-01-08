import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faWaveSquare, faClock, faHeart, faBorderAll, faUsers, faGear, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faTrello, } from '@fortawesome/free-brands-svg-icons';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { RouterLinkWithHref, RouterLinkActive } from '@angular/router';

import { NavbarComponent } from '@shared/components/navbar/navbar.component'
import { CardColorComponent } from '@shared/components/card-color/card-color.component';
import { Board } from '@shared/models/board.model';
import { MeService } from '@shared/services/me.service';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, CardColorComponent, CdkAccordionModule, RouterLinkWithHref, RouterLinkActive, NavbarComponent],
  templateUrl: './boards.component.html'
})
export class BoardsComponent implements OnInit {
  //iconos
  faTrello = faTrello;
  faBox = faBox;
  faWaveSquare = faWaveSquare;
  faClock = faClock;
  faHeart = faHeart;
  faBorderAll = faBorderAll;
  faUsers = faUsers;
  faGear = faGear;
  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;
  //variables
  boards: Board[] = [];
  //menu
  workspaceMenu = [
    {
      title: 'Boards',
      icon: faBorderAll,
      route: 'boards',
      isActive: true
    },
    {
      title: 'Highlights',
      icon: faHeart,
      route: 'highlights',
      isActive: false
    },
    {
      title: 'Views',
      icon: faHeart,
      route: 'highlights',
      isActive: false
    },
    {
      title: 'Members',
      icon: faUsers,
      route: 'members',
      isActive: false
    },
    {
      title: 'Settings',
      icon: faGear,
      route: 'settings',
      isActive: false
    }
  ];

  constructor(private meService: MeService) {
  }

  ngOnInit(): void {
    this.getMeBoards();
  }

  getMeBoards() {
    this.meService.getMeBoads().subscribe((boards) => {
      this.boards = boards;
    } );
  }
}
