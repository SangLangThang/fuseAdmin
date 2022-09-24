import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { StreamMessage } from 'stream-chat-angular';
import { Subject, Observable } from 'rxjs';
@Component({
    selector: 'app-message-input',
    templateUrl: './message-input.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class MessageInputComponent implements OnInit {
    @Input() isFileUploadEnabled: boolean | undefined;
    @Input() areMentionsEnabled: boolean | undefined;
    @Input() mentionScope: 'channel' | 'application' | undefined;
    @Input() mode: 'thread' | 'main' = 'main';
    @Input() isMultipleFileUploadEnabled: boolean | undefined;
    @Input() message: StreamMessage | undefined;
    @Input() sendMessage$: Observable<void> | undefined;
    @Output() readonly messageUpdate = new EventEmitter<void>();
    constructor() {
        console.log('init MessageInputComponent');
    }

    ngOnInit(): void {}
}
