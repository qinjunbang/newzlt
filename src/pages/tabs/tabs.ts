import { Component } from '@angular/core';
import { MePage } from '../me/me';
import { ShopsListPage } from '../shops/shops-list/shops-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ShopsListPage;
  tab2Root = MePage;


  constructor() {

  }
}
