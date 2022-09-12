import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { StreamChat } from 'stream-chat';
import {
    ChatClientService,
    ChannelService,
    StreamI18nService,
} from 'stream-chat-angular';
import { catchError, Observable, of, switchMap, map, from } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
    chatIsReady$!: Observable<boolean>;

    constructor(
        private chatService: ChatClientService,
        private channelService: ChannelService,
        private streamI18nService: StreamI18nService,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        const chatClient = StreamChat.getInstance('vzjz4e946w2c', {
            timeout: 6000,
        });
        this.streamI18nService.setTranslation();
        this._userService.user$.pipe(
            map((user) => {
                this.chatService.init('vzjz4e946w2c', user.id, chatClient.devToken(user.id));
                console.log(chatClient);
                return true;
            }),
            catchError(() => of(false))
        ).subscribe();
    }
}
