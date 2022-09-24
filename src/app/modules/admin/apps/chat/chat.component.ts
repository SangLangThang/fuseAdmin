import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { ConnectionOpen, StreamChat } from 'stream-chat';
import {
    ChatClientService,
    ChannelService,
    StreamI18nService,
} from 'stream-chat-angular';
import {
    catchError,
    Observable,
    of,
    switchMap,
    map,
    from,
    forkJoin,
    combineLatest,
    tap,
} from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { ChatService } from './chat.service';
@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
    chatIsReady$!: Observable<boolean>;
    test: User;
    constructor(
        private gsChatService: ChatClientService,
        private _userService: UserService,
        private _chatService: ChatService,
        private streamI18nService: StreamI18nService
    ) {
        this._chatService.getInstanceChat();
        this.streamI18nService.setTranslation();
    }

    ngOnInit(): void {
        this.chatIsReady$ = combineLatest([
            this._chatService.chatClient$,
            this._userService.user$,
        ]).pipe(
            switchMap(([chatClient, user]) => this.gsChatService.init(
                'vzjz4e946w2c',
                {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                chatClient.devToken(user.id)
            )),
            tap(res => console.log('user', (res as ConnectionOpen).me)),
            map((channel) => {
                console.log('channel', channel);
                return true;
            }),
            catchError(() => of(false))
        );
    }
}
