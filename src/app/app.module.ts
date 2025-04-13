import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DxHttpModule } from 'devextreme-angular/http';
import {
  SideNavOuterToolbarModule,
  SideNavInnerToolbarModule,
  SingleCardModule,
} from './layouts';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { AppRoutingModule } from './app-routing.module';
import { authenticationInterceptor } from './shared/interceptors/authentication.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    DxHttpModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,

    AppRoutingModule,
  ],
  providers: [
    AuthService,
    ScreenService,
    AppInfoService,
    provideHttpClient(withInterceptors([authenticationInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
