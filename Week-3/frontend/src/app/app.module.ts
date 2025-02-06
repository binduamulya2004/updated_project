import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './features/auth/components/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { DashboardComponent } from './features/auth/components/dashboard/dashboard.component';

import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EncryptionInterceptor } from './core/interceptors/encryption.interceptor';
import { ForgetpasswordComponent } from './features/auth/components/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './features/auth/components/resetpassword/resetpassword.component';
import { ChatComponent } from './features/auth/components/chat/chat.component';
import { WebSocketService } from './core/services/websocket.service';
import { FilestatusComponent } from './features/auth/components/filestatus/filestatus.component';


// import { ToastrModule } from 'ngx-toastr';
@NgModule({ 
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    ForgetpasswordComponent,
    ResetpasswordComponent,
    // ChatComponent,
    FilestatusComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 5000, // duration in milliseconds
      positionClass: 'toast-top-center', // position of the toast
      preventDuplicates: true, // prevent duplicate toasts
      progressBar: true, // show progress bar
      closeButton: true, // show close button
      tapToDismiss: true,
      newestOnTop: true,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EncryptionInterceptor,
      multi: true,
    },WebSocketService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}