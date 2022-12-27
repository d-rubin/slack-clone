import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MainareaComponent } from './mainarea/mainarea.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { HotToastModule } from '@ngneat/hot-toast';
import { ChatRoomsComponent } from './chat-rooms/chat-rooms.component';
import { CurrentChatComponent } from './current-chat/current-chat.component';
import { ChatPreviewComponent } from './chat-preview/chat-preview.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ChannelDialogComponent } from './channel-dialog/channel-dialog.component';
import { ConversationDialogComponent } from './conversation-dialog/conversation-dialog.component';

import { AngularFireModule } from '@angular/fire/compat';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    LoginComponent,
    SignUpComponent,
    MainareaComponent,
    HeaderComponent,
    ChatRoomsComponent,
    CurrentChatComponent,
    ChatPreviewComponent,
    ChannelDialogComponent,
    ConversationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    HotToastModule.forRoot(),
    MatExpansionModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
