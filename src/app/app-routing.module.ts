import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import {
//   LoginFormComponent,
//   ResetPasswordFormComponent,
//   CreateAccountFormComponent,
//   ChangePasswordFormComponent,
// } from './shared/components';

import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { CommonModule } from '@angular/common';

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

const routes: Routes = [
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'area',
    component: AreaComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuardService],
  },

  {
    path: 'path',
    component: PathsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'role',
    component: RoleComponent,
    canActivate: [AuthGuardService],
  },

  {
    path: 'domain',
    component: DomainComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'component',
    component: ComponentComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: '**',
    redirectTo: 'home',
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
  ],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [
    HomeComponent,
    ProfileComponent,
    TasksComponent,
    UserComponent,
    PathsComponent,
    RoleComponent,
    DomainComponent,
    MenuComponent,
    AreaComponent,
    ComponentComponent,
  ],
})
export class AppRoutingModule {}
