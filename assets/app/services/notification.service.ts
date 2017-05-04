/**
 * Created by mike on 2/13/17.
 */

import { Component } from '@angular/core';

import { Log, Level } from 'ng2-logger/ng2-logger';
const log = Log.create('NotificationService');
log.color = 'orange';

@Component({
  selector: 'notification',
  template: `
    <div
      class="notification"
      [hidden]="isHidden"
      >
      Notification {{message}}
    </div>`,
  styles: [
    `.notification {
      position: fixed;
      right: 10px;
      top: 10px;
      background: #eee;
      box-shadow: 0 3px 5px rgba(0,0,0,0.5);
      padding: 15px 20px;
      border-radius: 5px;
      font-size: 12px;
    }`
  ]
})
export class NotificationService {
  private message: string = 'Hello World!!!';
  private isHidden: boolean = false;

  show(message?: string) {
    log.d('show', message);
    this.message = message ? message : '';
    this.isHidden = false;
  }

  hide() {
    this.isHidden = true;
  }
}