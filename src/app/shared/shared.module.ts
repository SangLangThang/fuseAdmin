import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StreamChatModule, StreamAutocompleteTextareaModule } from 'stream-chat-angular';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //getstream.io
        StreamAutocompleteTextareaModule, StreamChatModule,
        TranslateModule.forChild()
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //getstream.io
        StreamAutocompleteTextareaModule, StreamChatModule,
    ]
})
export class SharedModule
{
}
