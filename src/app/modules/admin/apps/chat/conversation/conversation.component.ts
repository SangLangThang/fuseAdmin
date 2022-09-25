import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil, Observable } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Chat } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import { ChannelService, ChatClientService, DefaultStreamChatGenerics, EmojiInputService, StreamMessage } from 'stream-chat-angular';
import { Channel, DefaultGenerics, UserResponse } from 'stream-chat';

@Component({
    selector: 'chat-conversation',
    templateUrl: './conversation.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationComponent implements OnInit, OnDestroy {
    @ViewChild('messageInput') messageInput: ElementRef;
    chat: Chat;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    messages!: StreamMessage[];
    activeChannel$: Observable<Channel<DefaultStreamChatGenerics>>;
    isSendingMessage: boolean = false;
    private user: UserResponse<DefaultStreamChatGenerics> | undefined;
    private newMessageSubscription: { unsubscribe: () => void } | undefined;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _chatService: ChatService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _ngZone: NgZone,
        private channelService: ChannelService,
        private chatClientService: ChatClientService,
        private emojiInputService: EmojiInputService
    ) {
        this.activeChannel$ = this.channelService.activeChannel$;
        this.channelService.activeChannel$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((channel) => {
                this.newMessageSubscription?.unsubscribe();
                if (channel) {
                    this.newMessageSubscription = channel.on('message.new', (event) => {
                        if(event){
                            this.isSendingMessage = false;
                        }
                        console.log('event', event);
                    });
                }
            });
        this.emojiInputService.emojiInput$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(emojiInput => this.messageInput.nativeElement.value += emojiInput);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Decorated methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resize on 'input' and 'ngModelChange' events
     *
     * @private
     */
    @HostListener('input')
    @HostListener('ngModelChange')
    private _resizeMessageInput(): void {
        // This doesn't need to trigger Angular's change detection by itself
        this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                // Set the height to 'auto' so we can correctly read the scrollHeight
                this.messageInput.nativeElement.style.height = 'auto';

                // Detect the changes so the height is applied
                this._changeDetectorRef.detectChanges();

                // Get the scrollHeight and subtract the vertical padding
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;

                // Detect the changes one more time to apply the final height
                this._changeDetectorRef.detectChanges();
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.setMessages$();
        this.chatClientService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((u) => {
                this.user = u;
            });
        // Chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.chat = chat;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the contact info
     */
    openContactInfo(): void {
        // Open the drawer
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Reset the chat
     */
    resetChat(): void {
        this._chatService.resetChat();

        // Close the contact info in case it's opened
        this.drawerOpened = false;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle mute notifications
     */
    toggleMuteNotifications(): void {
        // Toggle the muted
        this.chat.muted = !this.chat.muted;

        // Update the chat on the server
        this._chatService.updateChat(this.chat.id, this.chat).subscribe();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    messageSent(text: string): void{
        if(!this.isSendingMessage){
            this.messageInput.nativeElement.value = '';
            const textContainsOnlySpaceChars = !text.replace(/ /g, ''); //space
            if(!text || textContainsOnlySpaceChars) {
                return ;
            }
            this.channelService.sendMessage(text);
        }
        this.isSendingMessage = true;
    }

    private setMessages$(): void {
        this.channelService.activeChannelMessages$
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((messages) => {
                this.messages = messages;
            });
    }

}
