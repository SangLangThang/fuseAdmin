import { Component, ElementRef, ViewChild } from '@angular/core';
import { EmojiInputService } from 'stream-chat-angular';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss'],
})
export class EmojiPickerComponent {
  @ViewChild('container') container: ElementRef<HTMLElement> | undefined;
  isOpened = false;

  constructor(private emojiInputService: EmojiInputService) {
  }

  emojiSelected(event: any): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.emojiInputService.emojiInput$?.next(event.emoji.native);
  }

  eventHandler = (event: Event): void => {
    // Watching for outside clicks
    if (!this.container?.nativeElement.contains(event.target as Node)) {
      console.log('Watching for outside clicks');
      this.isOpened = false;
      window.removeEventListener('click', this.eventHandler);
    }
  };


  toggled(): void {
    if (!this.container) {
      return;
    }
    this.isOpened = !this.isOpened;
    if (this.isOpened) {
      window.addEventListener('click', this.eventHandler);
    } else {
      window.removeEventListener('click', this.eventHandler);
    }
  }
}
