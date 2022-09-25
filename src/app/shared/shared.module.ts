import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StreamChatModule, StreamAutocompleteTextareaModule } from 'stream-chat-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //getstream.io
        StreamAutocompleteTextareaModule, StreamChatModule,
        TranslateModule.forChild(),
        //picker module
        PickerModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //getstream.io
        StreamAutocompleteTextareaModule, StreamChatModule,
        //picker module
        PickerModule
    ]
})
export class SharedModule
{
}
