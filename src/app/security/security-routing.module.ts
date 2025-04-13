import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthenticationService } from '../shared/services/authentication.service';

import {
  DxFormModule,
  DxDataGridModule,
  DxDropDownBoxModule,
  DxPopupModule,
  DxButtonModule,
  DxSpeedDialActionModule,
  DxLoadPanelModule,
  DxCheckBoxModule,
  DxChartModule,
  DxScrollViewModule,
  DxDateBoxModule,
  DxTextBoxModule,
  DxValidatorModule,
  DxRadioGroupModule,
  DxTabsModule,
  DxPivotGridModule,
  DxContextMenuModule,
  DxNumberBoxModule,
  DxTabPanelModule,
} from 'devextreme-angular';
import { LoginComponent } from './login/login.component';

import { noAuthenticationGuard } from '../shared/guards/noAuthentication.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [noAuthenticationGuard],
    component: LoginComponent,
    data: { title: 'Login' },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    DxDataGridModule,
    DxDropDownBoxModule,
    DxPopupModule,
    DxButtonModule,
    DxSpeedDialActionModule,
    DxLoadPanelModule,
    DxCheckBoxModule,
    DxChartModule,
    DxScrollViewModule,
    DxDateBoxModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxRadioGroupModule,
    DxTabsModule,
    DxPivotGridModule,
    DxContextMenuModule,
    DxNumberBoxModule,
    DxTabPanelModule,
    DxFormModule,
  ],
  exports: [RouterModule],
  declarations: [LoginComponent],
})
export class SecurityRoutingModule {}
