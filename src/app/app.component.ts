import { Component, OnInit,ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TestService } from './test.service';
import { Message } from './message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'app';
  messages: Message[] = [];
  length:number;
  message: Message = {
      _id: null,
      receiverId: null, // id of the user to whom the message was sent
      receiverType: null, // group or individual
      senderId: null, // id of the user who has sent the message
      picUrl: null,
      text: null,
      type: null,
      status: null, //sent,seen,notSent,error(unauthorised,connectionFailed)
      contentType: null, //text,image,radio,checkbox,slider,video
      contentData: { // data that needs to be sent to the component
          data: []
      },
      responseData: { // data that componenet send out to the web services
          data: []
      },
      createdBy: null,
      updatedBy: null,
      createdTime: null,
      updatedTime: null
  };

  constructor(private testService: TestService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.testService.connection(1);
    setInterval(() => {
      this.sendSocketMessage();
    },5);
    this.receiveSocketMessage();
  }

  getMessages() {
    setInterval(() => {
      this.testService.getMessages()
        .subscribe((res) => {
          res.map((msg) => {
            console.log('res', res);
            this.messages.push(msg);
            this.length = this.messages.length;
          });
        });
    }, 5);
  }

  sendSocketMessage() {
    this.message.receiverId = 1;
    this.message.senderId = 2;
    this.message.receiverType = 'group';
    this.message.contentType = 'text';
    this.message.createdBy = ''
    this.message.type = 'text';
    this.message.createdTime = Date.now();
    this.message.updatedTime = Date.now();
    this.message.status = 'delivered';
    this.message.text = 'Hello, this is testing';
    this.testService.sendMessage(this.message);
  }

  receiveSocketMessage() {
    this.testService.receiveMessages()
    .subscribe((msg: any) => {
        this.messages.push(msg);
        this.ref.detectChanges();
    });
  }
}
