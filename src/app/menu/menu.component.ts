import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';

import { Subscription } from 'rxjs';
import { AuthenticationService } from '../shared/services/authentication.service';
import { TraductorService } from '../shared/services/traductor.service';
import { NotifyService } from '../shared/services/notify.service';
import { MenuService } from './menu.service';

import CustomStore from 'devextreme/data/custom_store';
import { DxDropDownBoxTypes } from 'devextreme-angular/ui/drop-down-box';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  //*HELPER
  @ViewChild('gForm') gForm: DxFormComponent | any;
  @ViewChild('gFormAddMenu') gFormAddMenu: DxFormComponent | any;
  //#region SYSTEM-CONFIG

  private gSubscription$!: Subscription;

  config: any = {
    isLoadingPanel: false,
    isDisabledComboUser: true,
    isPopupVisible: false,
    isPopupAddMenuVisible: false,
    ispopupAddSubMenuDataVisible: false,
    isEdit: true,
    isView: false,
    popupHeight: 200,
    popupWidth: 600,
    popupAddMenuWidth: 600,
    popupAddMenuHeight: 250,
    popupAddSubMenuDataWidth: 800,
    popupAddSubMenuDataHeight: 520,
    buttonColumnWidth: 130,
    keys: [],
  };

  icon: any = {
    search: 'refresh',
    add: 'add',
    edit: 'edit',
    cancel: 'remove',
    delete: 'trash',
    save: 'save',
    view: 'eyeopen',
    translate: 'globe',
    arrowright: 'arrowright',
    arrowleft: 'arrowleft',
  };

  translate: any | {} = {
    btnAdd: { word: '_Add', disabled: false, visible: true },
    btnSearch: { word: '_Search', disabled: false, visible: true },
    btnEdit: { word: '_Edit', disabled: false, visible: true },
    btnView: { word: '_View', disabled: false, visible: true },
    btnDelete: { word: '_Delete', disabled: false, visible: true },
    btnCancel: { word: '_Cancel', disabled: false, visible: true },
    btnConfirmDelete: {
      word: '_Confirm Delete?',
      disabled: false,
      visible: true,
    },
    btnConfirm: { word: '_Confirm', disabled: false, visible: true },
    btnCheckRole: { word: '_Role', disabled: false, visible: true },
    btnCheckUser: { word: '_User', disabled: false, visible: true },
    btnSaved: { word: '_Saved', disabled: false, visible: true },
    title: { word: '_Menu', disabled: false, visible: true },
    popupTitle: { word: '_Menu', disabled: false, visible: true },
    popupAddMenuTitle: { word: '_Add Menu', disabled: false, visible: true },
    popupAddSubMenuDataTitle: {
      word: '_Add Sub Menu Data',
      disabled: false,
      visible: true,
    },

    colHashtag: { word: '_#', disabled: false, visible: true },
    colName: { word: '_Name', disabled: false, visible: true },
    colDisplayName: { word: '_Display Name', disabled: false, visible: true },
    colMenuData: { word: '_Menu Data', disabled: false, visible: true },
    colTag: { word: '_Tag', disabled: false, visible: true },
    valName: { word: '_Name is required', disabled: false, visible: true },
    valDisplayName: {
      word: '_Display Name is required',
      disabled: false,
      visible: true,
    },
    btnTranslate: { word: '_Translate', disabled: false, visible: true },
    btnAssigned: { word: '_Un Assigned', disabled: false, visible: true },
    btnUnAssigned: { word: '_Assigned', disabled: false, visible: true },
    popupTitleDictionary: {
      word: '_Dictionary',
      disabled: false,
      visible: true,
    },
  };

  //#endregion CONFIG

  //*GRID
  //#region GRID
  dsMenu: any[] | [] = [];
  dsMenuData: any[] | [] = [];

  dsMenuAssigned: {} | any = {
    assignedMenu: [],
    unAssignedMenu: [],
  };

  dsMenuDataAssigned: any[] = [];

  gMenu: any = {
    menu_id: null,
    menu_name: '',
    task_id: null,
  };

  gMenuTemp: any = {
    menu_id: null,
    menu_name: '',
    task_id: null,
  };

  gAddMenu: any = { id: null, name: '', displayName: '', menu_id: null };
  gAddMenuTemp: any = { id: null, name: '', displayName: '', menu_id: null };

  gMenu_id: any | [] = [];
  gMenuData_id: any | [] = [];

  dsUser: any | [] = [];
  dsUserComboValue: any | [] = [];

  dsComboMenuData: any | [] = [];

  dsRoleCombo: any | [] = [];
  dsRoleComboValue: any | [] = [];

  //**ASIGNED TO GRID
  pendingToAssign: any[] = [];
  pendingToUnassign: any[] = [];

  //#endregion GRID

  dsTagBox: any[] | [] = [];

  isClose: boolean | any = false;
  isCloseUser: boolean | any = false;

  gridColumns = ['role_name'];
  gridColumnsUser = ['user_name'];

  option: any = {
    toolbarItems: [
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: 'Ok',
          onClick: () => (this.isClose = false),
        },
      },
    ],
  };

  optionUser: any = {
    toolbarItems: [
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: 'Ok',
          onClick: () => (this.isCloseUser = false),
        },
      },
    ],
  };

  isCheckRole: boolean = false;
  isCheckUser: boolean = false;

  constructor(
    private sMenu: MenuService,
    private sNotify: NotifyService,
    private sTraductor: TraductorService,
    private sAuthententication: AuthenticationService
  ) {
    this.onValueChanged_lookup_menuData =
      this.onValueChanged_lookup_menuData.bind(this);
  }

  ngOnInit() {
    this.gSubscription$ = this.sAuthententication.gAccess$.subscribe(
      (data: any) => {
        this.config.keys = data.tasks;
      }
    );

    //this.LoadInfo();

    this.LoadCombo();

    this.dsTagBox = [
      { id: 1, name: 'btnEdit' },
      { id: 2, name: 'btnAdd' },
      { id: 3, name: 'btnDelete' },
      { id: 4, name: 'btnView' },
      { id: 5, name: 'btnCancel' },
      { id: 6, name: 'btnSave' },
    ];
  }

  //#region  METHOD

  // LoadInfo() {
  //   this.config.isLoadingPanel = true;

  //   this.sMenu.Get().subscribe({
  //     next: (data: any) => {
  //       console.log(data, 'data ');
  //       this.dsMenu.splice(0, this.dsMenu.length, ...data);
  //       //this.dsMenu = data;
  //     },
  //     complete: () => {
  //       this.config.isLoadingPanel = false;
  //     },
  //     error: (error: any) => {
  //       this.config.isLoadingPanel = false;
  //       this.sNotify.ErrorMessage(error);
  //     },
  //   });
  // }

  LoadCombo() {
    this.LoadComboUser();
    //this.LoadComboRole();
  }

  LoadComboUser() {
    this.sMenu.GetComboUser().subscribe({
      next: (data: any) => {
        this.dsUser = this.ngLoadDataCombo(data, 'user_id');
      },
    });
  }

  //#region  SEARCH
  onClick_button_search() {
    if (this.dsUserComboValue.length > 0) {
      this.sMenu.GetMenu(this.dsUserComboValue[0]).subscribe({
        next: (data: any) => {
          console.log(data, 'data en search menu');
          this.dsMenu = data;
        },
        complete: () => {
          this.config.isLoadingPanel = false;
        },
        error: (error: any) => {
          this.config.isLoadingPanel = false;
          this.sNotify.ErrorMessage(error);
        },
      });
    }
  }

  //#endregion
  LoadComboRole() {
    this.sMenu.GetRoleCombo().subscribe({
      next: (data: any) => {
        this.dsRoleCombo = this.ngLoadDataCombo(data, 'role_id');
      },
    });
  }

  LoadComboMenuData(data?: any) {
    if (data) {
      this.gMenu_id = data;
    }
    this.sMenu.GetComboMenuData(this.gMenu_id).subscribe({
      next: (data: any) => {
        this.dsComboMenuData = data;
      },
    });
  }

  //#endregion

  ngLoadDataCombo(data: any | [], id: string) {
    return new CustomStore({
      loadMode: 'raw',
      key: id,
      load() {
        return data;
      },
    });
  }

  onOptionChanged_dropDown_role(e: DxDropDownBoxTypes.OptionChangedEvent) {
    if (e.name === 'value') {
      this.dsRoleComboValue = e.value;
      //this.dsMenu = [];
    }

    if (e.name === 'isDirty') {
      //this.dsMenu = [];
    }
  }

  onOptionChanged_dropDown_user(e: DxDropDownBoxTypes.OptionChangedEvent) {
    if (e.name === 'value') {
      this.dsUserComboValue = e.value;
      //this.dsMenu = [];
    }

    if (e.name === 'isDirty') {
      //this.dsMenu = [];
    }
  }

  onClick_button_add() {
    this.config.isPopupVisible = true;

    this.gMenu = {
      menu_id: null,
      menu_name: '',
      task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
        .keyList,
    };
    this.gMenuTemp = { ...this.gMenu };
  }

  onClick_button_edit(e: any, menu: any) {
    e.event.stopPropagation();

    this.config.isPopupVisible = true;
    this.translate.popupTitle.word = `${this.translate.title.word} ${this.translate.btnEdit.word}`;

    this.config.isView = menu.isView;
    this.config.isEdit = menu.isEdit;

    this.gMenu = menu;
    this.gMenu['task_id'] = this.config.keys.filter(
      (x: any) => x.list == 'Daily'
    )[0].keyList;

    this.gMenuTemp = { ...this.gMenu };
  }

  onClick_button_confirm() {
    if (this.gForm.instance.validate().isValid) {
      this.config.isLoadingPanel = true;
      if (this.gMenuTemp.menu_id === null) {
        this.sMenu.PostMenu(this.gMenuTemp).subscribe({
          next: (data: any) => {
            this.config.isEdit = data.isEdit;
            this.config.isView = data.isView;

            Object.assign(this.gMenu, {
              menu_id: data.menu_id,
              menu_name: data.menu_name,
              isConfirmDelete: data.isConfirmDelete,
              isEdit: data.isEdit,
              isView: data.isView,
              isCancel: data.isCancel,
              isDelete: data.isDelete,
              hashtag: data.hashtag,
            });
            this.dsMenu = [this.gMenu, ...this.dsMenu];
          },
          complete: () => {
            this.config.isLoadingPanel = false;
            this.config.isPopupVisible = false;
          },
          error: (error: any) => {
            this.config.isLoadingPanel = false;
            this.sNotify.ErrorMessage(error);
          },
        });
      } else {
        this.sMenu.Put(this.gMenuTemp).subscribe({
          next: (data: any) => {
            Object.assign(this.gMenu, {
              menu_name: data.menu_name,
              isConfirmDelete: data.isConfirmDelete,
              isEdit: data.isEdit,
              isView: data.isView,
              isCancel: data.isCancel,
              isDelete: data.isDelete,
            });
          },
          complete: () => {
            this.config.isLoadingPanel = false;
            this.config.isPopupVisible = false;
          },
          error: (error: any) => {
            this.config.isLoadingPanel = false;
            this.sNotify.ErrorMessage(error);
          },
        });
      }
    }
  }

  onClick_button_confirm_AddMenu() {
    if (this.gFormAddMenu.instance.validate().isValid) {
      this.config.isLoadingPanel = true;
      if (this.gAddMenuTemp.menuData_id === null) {
        this.sMenu.PostMenuData(this.gAddMenuTemp).subscribe({
          next: (data: any) => {
            this.config.isEdit = data.isEdit;
            this.config.isView = data.isView;
            Object.assign(this.gAddMenu, {
              menu_id: data.menu_id,
              menuData_id: data.menuData_id,
              menuData_name: data.menuData_name,
              menu_id_root: data.menu_id_root,
              component_id: data.component_id,
              menuData_displayName: data.menuData_displayName,
              isConfirmDelete: data.isConfirmDelete,
              isEdit: data.isEdit,
              isView: data.isView,
              isCancel: data.isCancel,
              isDelete: data.isDelete,
              hashtag: data.hashtag,
            });
            this.dsMenuData = [this.gAddMenu, ...this.dsMenuData];
          },
          complete: () => {
            this.config.isLoadingPanel = false;
            this.config.isPopupAddMenuVisible = false;
          },
          error: (error: any) => {
            this.config.isLoadingPanel = false;
            this.sNotify.ErrorMessage(error);
          },
        });
      } else {
        this.sMenu.PutMenuData(this.gAddMenuTemp).subscribe({
          next: (data: any) => {
            Object.assign(this.gAddMenu, {
              menuData_id: data.menuData_id,
              menuData_name: data.menuData_name,
              menu_id_root: data.menu_id_root,
              component_id: data.component_id,
              menuData_displayName: data.menuData_displayName,
              isConfirmDelete: data.isConfirmDelete,
              isEdit: data.isEdit,
              isView: data.isView,
              isCancel: data.isCancel,
              isDelete: data.isDelete,
            });
          },
          complete: () => {
            this.config.isLoadingPanel = false;
            this.config.isPopupAddMenuVisible = false;
          },
          error: (error: any) => {
            this.config.isLoadingPanel = false;
            this.sNotify.ErrorMessage(error);
          },
        });
      }
    }
  }

  onHidden_popup() {
    if (this.config.isPopupVisible) {
      this.config.isPopupVisible = false;
    } else if (this.config.isPopupDictionaryVisible) {
      this.config.isPopupDictionaryVisible = false;
    } else if (this.config.isPopupAddMenuVisible) {
      this.config.isPopupAddMenuVisible = false;
    } else if (this.config.ispopupAddSubMenuDataVisible) {
      this.config.ispopupAddSubMenuDataVisible = false;
    }
  }

  onValueChanged_onClick_role(event: any) {
    console.log(event, 'role');
  }

  onValueChanged_onClick_user(event: any) {
    console.log(event.value, 'user');

    this.config.isDisabledComboUser = event.value.length > 0 ? false : true;
  }

  onClick_button_add_menu(e: any, menu: any) {
    e.event.stopPropagation();

    this.gMenu_id = menu.menu_id;

    this.gAddMenu = {
      menu_id: menu.menu_id,
      menuData_id: null,
      menuData_name: '',
      menuData_id_root: null,
      component_id: null,
      menuData_displayName: '',
      task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
        .keyList,
    };

    this.LoadComboMenuData();

    this.config.isPopupAddMenuVisible = true;

    this.gAddMenuTemp = { ...this.gAddMenu };
  }

  onClick_button_edit_menuData(e: any, sub: any, menu: any) {
    e.event.stopPropagation();

    this.LoadComboMenuData(menu.menu_id);

    this.config.isPopupAddMenuVisible = true;

    const task_id = this.config.keys.filter((x: any) => x.list === 'Daily')[0]
      ?.keyList;

    const menuEdit = {
      ...sub,
      menu_id: menu.menu_id,
      task_id: task_id,
    };

    this.gAddMenu = menuEdit;
    this.gAddMenuTemp = { ...menuEdit };
  }

  onClick_button_add_menuData(e: any, menu: any, sub: any) {
    e.event.stopPropagation();

    this.config.isLoadingPanel = true;

    let subMenu = sub.menuData_id;

    this.gMenuData_id = subMenu;

    this.sMenu.GetMenuComponent(subMenu).subscribe({
      next: (data: any) => {
        this.dsMenuAssigned.assignedMenu = data.link;
        this.dsMenuAssigned.unAssignedMenu = data.unLink;

        const taskId = this.config.keys.find(
          (x: any) => x.list === 'Daily'
        )?.keyList;

        this.dsMenuDataAssigned = [
          {
            //menuData_id: this.gMenuData_id,
            menuData_id: subMenu,
            components: data.link.map((item: any) => ({
              menuData_id_component: item.menuData_id_component,
            })),
            task_id: taskId,
          },
        ];
      },
      complete: () => {
        this.config.isLoadingPanel = false;
        this.config.ispopupAddSubMenuDataVisible = true;
      },
      error: (error: any) => {
        this.config.isLoadingPanel = false;
        this.sNotify.ErrorMessage(error);
      },
    });
  }

  onClick_button_confirm_subMenuAdd() {
    this.config.isLoadingPanel = true;
    const data = this.dsMenuDataAssigned[0];

    this.sMenu.PutMenuDataComponent(data).subscribe({
      next: () => {},
      complete: () => {
        this.config.isLoadingPanel = false;
        this.config.ispopupAddSubMenuDataVisible = false;
        //this.LoadInfo();
      },
      error: (err: any) => {
        console.error('err', err);
      },
    });
  }

  onClick_button_unAssigned() {
    const selectedMenus = this.dsMenuAssigned.assignedMenu.filter(
      (menu: any) => menu.isCheck === true
    );

    if (selectedMenus.length > 0) {
      const removeIds = selectedMenus.map(
        (menu: any) => menu.menuData_id_component
      );

      console.log('Removing', removeIds);

      this.dsMenuDataAssigned = this.dsMenuDataAssigned.map((menu: any) => {
        if (menu.menuData_id === this.gMenuData_id) {
          const updatedComponents = menu.components.filter(
            (comp: any) => !removeIds.includes(comp.menuData_id_component)
          );
          return {
            ...menu,
            components: updatedComponents,
          };
        }
        return menu;
      });

      console.log(this.dsMenuDataAssigned, 'desasignado DATA SOURCE');

      this.dsMenuAssigned.unAssignedMenu = [
        ...this.dsMenuAssigned.unAssignedMenu,
        ...selectedMenus,
      ];

      this.dsMenuAssigned.assignedMenu =
        this.dsMenuAssigned.assignedMenu.filter(
          (menu: any) => menu.isCheck === false
        );
    }
  }

  onClick_button_assigned() {
    const selectedMenus = this.dsMenuAssigned.unAssignedMenu.filter(
      (menu: any) => menu.isCheck === true
    );

    if (selectedMenus.length > 0) {
      const newComponents = selectedMenus.map((menu: any) => ({
        menuData_id_component: menu.menuData_id_component,
      }));

      const taskId = this.config.keys.find(
        (x: any) => x.list === 'Daily'
      )?.keyList;

      const existing = this.dsMenuDataAssigned.find(
        (menu: any) => menu.menuData_id === this.gMenuData_id
      );

      if (existing) {
        const existingIds = new Set(
          existing.components.map((c: any) => c.menuData_id_component)
        );
        newComponents.forEach((component: any) => {
          if (!existingIds.has(component.menuData_id_component)) {
            existing.components.push(component);
          }
        });
      } else {
        this.dsMenuDataAssigned.push({
          menuData_id: this.gMenuData_id,
          components: newComponents,
          task_id: taskId,
        });
      }

      console.log(this.dsMenuDataAssigned, 'asignado DATA SOURCE');

      this.dsMenuAssigned.assignedMenu = [
        ...this.dsMenuAssigned.assignedMenu,
        ...selectedMenus,
      ];

      this.dsMenuAssigned.unAssignedMenu =
        this.dsMenuAssigned.unAssignedMenu.filter(
          (menu: any) => menu.isCheck === false
        );
    }
  }

  onValueChanged_lookup_menuData(event: any) {
    if (event.component.option('displayValue') && this.gAddMenuTemp) {
      this.gAddMenuTemp.menuData_name_root =
        event.component.option('displayValue');
    }
  }

  // onCheckboxChanged(newValue: boolean, row: any, sub: any) {
  //   //  console.log(sub.menuData_id, 'sub en checkbox');
  //   console.log(newValue, 'newValue en checkbox');
  //   console.log(row, 'row en checkbox');
  //   console.log(sub, 'sub en checkbox');

  //   const id = row.component_id;
  //   if (newValue) {
  //     this.pendingToAssign = this.pendingToAssign.filter(
  //       (x) => x.component_id !== id
  //     );
  //     if (
  //       !this.isAlreadyAssigned(id) &&
  //       !this.pendingToAssign.some((x) => x.component_id === id)
  //     ) {
  //       this.pendingToAssign.push({ component_id: id });
  //     } else {
  //       this.pendingToUnassign = this.pendingToUnassign.filter(
  //         (x) => x.component_id !== id
  //       );
  //       if (
  //         this.isAlreadyAssigned(id) &&
  //         !this.pendingToUnassign.some((x) => x.component_id === id)
  //       ) {
  //         this.pendingToUnassign.push({ component_id: id });
  //       }
  //     }
  //   }

  //   console.log('Asignar:', this.pendingToAssign);
  //   console.log('Quitar:', this.pendingToUnassign);

  //   // if (newValue) {
  //   //   this.pendingToUnassign = this.pendingToUnassign.filter(
  //   //     (x) => x.menuData_id_component !== id
  //   //   );

  //   //   if (
  //   //     !this.isAlreadyAssigned(id) &&
  //   //     !this.pendingToAssign.some((x) => x.menuData_id_component === id)
  //   //   ) {
  //   //     this.pendingToAssign.push({ menuData_id_component: id });
  //   //   }
  //   // } else {
  //   //   this.pendingToAssign = this.pendingToAssign.filter(
  //   //     (x) => x.menuData_id_component !== id
  //   //   );

  //   //   if (
  //   //     this.isAlreadyAssigned(id) &&
  //   //     !this.pendingToUnassign.some((x) => x.menuData_id_component === id)
  //   //   ) {
  //   //     this.pendingToUnassign.push({ menuData_id_component: id });
  //   //   }
  //   // }

  //   //* this.SendAssignedMenu(this.pendingToAssign);
  // }

  isAlreadyAssigned(id: number): boolean {
    return this.dsMenuAssigned.assignedMenu.some(
      (x: any) => x.component_id === id
    );
  }

  assignedMenuData: any[] = [];

  onValueChanged_assigned(rowData: any) {
    const userId = this.dsUserComboValue[0];
    const taskId = this.config.keys.filter((x: any) => x.list === 'Daily')[0]
      .keyList;

    const newRecord = {
      user_id: userId,
      component_id: rowData.component_id,
      task_id: taskId,
    };

    console.log(newRecord, 'assignedMenu_component');

    if (rowData.isCheck) {
      const found = this.assignedMenuData.some(
        (item) => item.component_id === rowData.component_id
      );
      if (!found) {
        this.assignedMenuData.push(newRecord);
      }
    } else {
      this.assignedMenuData = this.assignedMenuData.filter(
        (item) => item.component_id !== rowData.component_id
      );
    }

    console.log(this.assignedMenuData, 'assignedMenu_component');
  }

  // onValueChanged_assigned(data: any) {
  //   let dataMenu = {
  //     assignedMenu_component: data.component_id,
  //     task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
  //       .keyList,
  //     user_id: this.dsUserComboValue[0],
  //   };

  //   console.log(dataMenu, 'assignedMenu_component');
  // }

  // SendAssignedMenu(event: any) {
  //   //console.log(event, 'event en send assigned menu');
  // }

  onClick_button_save() {
    console.log('Entra aca');
    this.config.isLoadingPanel = true;

    this.sMenu.PostMenuComponent(this.assignedMenuData).subscribe({
      next: (data: any) => {
        console.log(data, 'data en post menu component');
      },
      complete: () => {
        this.config.isLoadingPanel = false;
      },

      error: (error: any) => {
        this.config.isLoadingPanel = false;
        this.sNotify.ErrorMessage(error);
      },
    });
  }
}
