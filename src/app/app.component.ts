import { Component, OnInit } from '@angular/core';
import { TestService } from './test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  messages: any[] = [];
  length:number;

  constructor(private testService: TestService) { }

  ngOnInit() {
    this.getMessages();
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
    }, 100);
  }
}
