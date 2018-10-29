import { Component } from '@angular/core';
import { NativeService } from '../../../providers/NativeService';

@Component({
    selector: 'contact-page',
    templateUrl: 'contact.html'
})

export class ContactPage {

  constructor (
    public native: NativeService,
  ) {

  }

  // 拨打电话
  callNumber (number: string) {
    this.native.callNumber(number);
  }
}
