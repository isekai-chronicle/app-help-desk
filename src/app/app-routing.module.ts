import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './shared/services';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

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
  DxTagBoxModule,
  DxAccordionModule,
  DxLookupModule,
} from 'devextreme-angular';

import { UserComponent } from './user/user.component';
import { PathsComponent } from './paths/paths.component';
import { RoleComponent } from './role/role.component';
import { DomainComponent } from './domain/domain.component';
import { MenuComponent } from './menu/menu.component';
import { AreaComponent } from './area/area.component';
import { ComponentComponent } from './component/component.component';

import { LoginComponent } from './login/login.component';
import { noAuthenticationGuard } from './shared/guards/noAuthentication.guard';

import { authenticationGuard } from './shared/guards/authentication.guard';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [authenticationGuard],
  },
  {
    path: 'area',
    component: AreaComponent,
    canActivate: [authenticationGuard],
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [authenticationGuard],
  },

  {
    path: 'path',
    component: PathsComponent,
    canActivate: [authenticationGuard],
  },
  {
    path: 'role',
    component: RoleComponent,
    canActivate: [authenticationGuard],
  },

  {
    path: 'domain',
    component: DomainComponent,
    canActivate: [authenticationGuard],
  },
  {
    path: 'component',
    component: ComponentComponent,
    canActivate: [authenticationGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthenticationGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    CommonModule,
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
    DxTagBoxModule,
    DxAccordionModule,
    DxLookupModule,
    DxFormModule,
    FormsModule,
  ],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [
    ProfileComponent,
    TasksComponent,
    UserComponent,
    PathsComponent,
    RoleComponent,
    DomainComponent,
    MenuComponent,
    AreaComponent,
    ComponentComponent,
    LoginComponent,
  ],
})
export class AppRoutingModule {}
