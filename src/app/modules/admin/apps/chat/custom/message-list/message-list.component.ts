import {
    Component,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ViewEncapsulation,
} from '@angular/core';
import { UserResponse } from 'stream-chat';
import {
    ChatClientService,
    DefaultStreamChatGenerics,
    parseDate,
    StreamMessage,
} from 'stream-chat-angular';

@Component({
    selector: 'app-message-list',
    templateUrl: './message-list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageListComponent implements OnInit {
    @Input() messages: StreamMessage | undefined;
    private user: UserResponse<DefaultStreamChatGenerics> | undefined;
    constructor(private chatClientService: ChatClientService) {}

    ngOnInit(): void {
        this.chatClientService.user$.subscribe((u) => {
            this.user = u;
        });
        console.log(this.messages);
    }

    trackByMessageId(index: number, item: StreamMessage): string {
        return item.id;
    }

    isMine(messageUserId: string): boolean{
        return this.user.id === messageUserId;
    }
}
