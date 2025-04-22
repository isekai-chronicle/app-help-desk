import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';

import { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';

import { Subscription } from 'rxjs';
import { AuthenticationService } from '../shared/services/authentication.service';
import { UserService } from './user.service';
import { TraductorService } from '../shared/services/traductor.service';
import { NotifyService } from '../shared/services/notify.service';

type EditorOptions = DxTextBoxTypes.Properties;

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  //*HELPER
  @ViewChild('gForm') gForm: DxFormComponent | any;
  //#region SYSTEM-CONFIG

  private gSubscription$!: Subscription;

  config: any = {
    isLoadingPanel: false,
    isPopupVisible: false,
    isPopupDictionaryVisible: false,
    isPopupChangePasswordVisible: false,
    isEdit: true,
    isView: false,
    popupHeight: 450,
    popupWidth: 750,
    popupDictionaryWidth: 1250,
    popupDictionaryHeight: 800,
    popupChangePasswordWidth: 500,
    popupChangePasswordHeight: 300,
    isLoadingTraductor: false,
    buttonColumnWidth: 150,
    isSendInfo: false,
    keys: [],
  };

  icon: any = {
    search: 'refresh',
    add: 'add',
    edit: 'edit',
    cancel: 'remove',
    delete: 'trash',
    view: 'eyeopen',
    translate: 'globe',
    lock: 'lock',
  };

  translate: any | {} = {
    btnAdd: { word: '_Add', disabled: false, visible: true },
    btnSearch: { word: '_Search', disabled: false, visible: true },
    btnEdit: { word: '_Edit', disabled: false, visible: true },
    btnView: { word: '_View', disabled: false, visible: true },
    btnPassword: { word: '_Password', disabled: false, visible: true },
    btnDelete: { word: '_Delete', disabled: false, visible: true },
    btnCancel: { word: '_Cancel', disabled: false, visible: true },
    btnConfirmDelete: {
      word: '_Confirm Delete?',
      disabled: false,
      visible: true,
    },
    btnConfirm: { word: '_Confirm', disabled: false, visible: true },
    btnConfirmPassword: {
      word: '_Confirm Password',
      disabled: false,
      visible: true,
    },
    title: { word: '_User', disabled: false, visible: true },
    titleUser: { word: '_User', disabled: false, visible: true },
    popupTitle: { word: '_User', disabled: false, visible: true },
    colHashtag: { word: '_#', disabled: false, visible: true },
    colName: { word: '_Name', disabled: false, visible: true },
    colLastName: { word: '_Last Name', disabled: false, visible: true },
    colNickname: { word: '_Nickname', disabled: false, visible: true },
    colAccount: { word: '_Account', disabled: false, visible: true },
    colEmail: { word: '_Email', disabled: false, visible: true },
    colAreaName: { word: '_Area', disabled: false, visible: true },
    colDomainName: { word: '_Domain', disabled: false, visible: true },
    colPassword: { word: '_Password', disabled: false, visible: true },
    colConfirmPassword: {
      word: '_Confirm Password',
      disabled: false,
      visible: true,
    },
    colIsActive: { word: '_Active', disabled: false, visible: true },
    btnTranslate: { word: '_Translate', disabled: false, visible: true },
    popupTitleDictionary: {
      word: '_Dictionary',
      disabled: false,
      visible: true,
    },
    popupChangePasswordTitle: {
      word: '_Change Password',
      disabled: false,
      visible: true,
    },

    valName: { word: '_Name is required', disabled: false, visible: true },

    valLastName: {
      word: '_Last Name is required',
      disabled: false,
      visible: true,
    },
    valNickname: {
      word: '_Nickname is required',
      disabled: false,
      visible: true,
    },
    valArea: { word: '_Area is required', disabled: false, visible: true },
    valPassword: {
      word: '_Password is required',
      disabled: false,
      visible: true,
    },
    valConfirmPassword: {
      word: '_Passwords do not match',
      disabled: false,
      visible: true,
    },

    lblIsActive: { word: '_Active', disabled: false, visible: true },
  };
  //#endregion CONFIG

  //*TRANSLATE
  component_name: string = 'user';
  component_area: string = '';
  component_language: string = 'ING';

  //*GRID
  dsUser: any[] | [] = [];
  dsArea: any[] | [] = [];
  dsDomain: any[] | [] = [];

  gUser: any = {
    id: null,
    domain_id: null,
    area_id: null,
    name: '',
    lastName: '',
    nickname: '',
    account: '',
    email: '',
    isActive: false,
  };

  gUserTemp: any = {
    id: null,
    domain_id: null,
    area_id: null,
    name: '',
    lastName: '',
    nickname: '',
    account: '',
    email: '',
    isActive: false,
  };

  gChangePassword: any = {
    id: null,
    password: '',
    confirmPassword: '',
    task_id: null,
  };

  gEditorOptionsForm: any = {
    name: { readOnly: false },
    lastName: { readOnly: false },
    nickname: { readOnly: false },
    isActive: { readOnly: false },
    area: { readOnly: false },
    domain: { readOnly: false, visible: true },
    account: { readOnly: true },
    password: { readOnly: true, visible: true },
    email: { readOnly: false },
  };

  copySuccess = {
    account: false,
    password: false,
  };

  passwordEditorOptions: EditorOptions = {
    mode: 'password',
    valueChangeEvent: 'keyup',
  };

  constructor(
    private sUser: UserService,
    private sNotify: NotifyService,
    private sTraductor: TraductorService,
    private sAuthententication: AuthenticationService
  ) {
    this.LoadTraductor();

    this.onValueChanged_lookup_Area =
      this.onValueChanged_lookup_Area.bind(this);

    this.onValueChanged_lookup_Domain =
      this.onValueChanged_lookup_Domain.bind(this);
  }

  ngOnInit() {
    this.gSubscription$ = this.sAuthententication.gAccess$.subscribe(
      (data: any) => {
        this.config.keys = data.tasks;
      }
    );

    this.LoadInfo();

    this.LoadCombo();
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      if (text === this.gUserTemp.account) {
        this.copySuccess.account = true;
      } else if (text === this.gUserTemp.password) {
        this.copySuccess.password = true;
      }

      setTimeout(() => {
        if (text === this.gUserTemp.account) {
          this.copySuccess.account = false;
        } else if (text === this.gUserTemp.password) {
          this.copySuccess.password = false;
        }
      }, 2000);
    });
  }

  //#region SYSTEM-TRADUCTOR
  LoadTraductor() {
    let data = {
      name: this.component_name,
      area: this.component_area,
      language: this.component_language,
    };

    this.sTraductor.Post(data).subscribe({
      next: (response: any) => {
        if (response && typeof this.translate === 'object') {
          Object.keys(response).forEach((key) => {
            if (
              this.translate.hasOwnProperty(key) &&
              typeof this.translate[key] === 'object'
            ) {
              Object.keys(response[key]).forEach((field) => {
                if (this.translate[key].hasOwnProperty(field)) {
                  this.translate[key][field] = response[key][field]; // Solo actualiza campos existentes
                }
              });
            }
          });
        }
      },
      complete: () => {
        this.config.isLoadingTraductor = true;
      },
      error: (err: any) => {
        this.config.isLoadingTraductor = true;
      },
    });
  }

  //#endregion TRADUCTOR

  //#region  METHOD
  LoadInfo() {
    this.config.isLoadingPanel = true;

    this.sUser.Get().subscribe({
      next: (data: any) => {
        this.dsUser = data;
      },
      complete: () => {
        this.config.isLoadingPanel = false;
      },
      error: (error) => {
        this.config.isLoadingPanel = false;
        this.sNotify.ErrorMessage(error);
      },
    });
  }

  LoadCombo() {
    this.LoadComboArea();
    this.LoadComboDomain();
  }

  LoadComboArea() {
    this.sUser.GetComboArea().subscribe({
      next: (data: any) => {
        this.dsArea = data;
      },
    });
  }

  LoadComboDomain() {
    this.sUser.GetComboDomain().subscribe({
      next: (data: any) => {
        this.dsDomain = data;
      },
    });
  }

  //#endregion

  //#region EVENT

  onClick_button_delete(event: any) {
    this.config.buttonColumnWidth = 250;
    event.isConfirmDelete = 1;
    event.isCancel = 1;
  }

  onClick_button_cancel(event: any) {
    this.config.buttonColumnWidth = 150;
    event.isConfirmDelete = 0;
    event.isCancel = 0;
  }

  onClick_button_add() {
    this.gEditorOptionsForm.password.readOnly = true;
    this.gEditorOptionsForm.password.visible = true;
    this.gEditorOptionsForm.account.readOnly = true;

    this.EnableComponent(this.gEditorOptionsForm);

    this.config.isPopupVisible = true;
    this.translate.popupTitle.word = `${this.translate.title.word} ${this.translate.btnAdd.word}`;

    this.gUser = {
      id: null,
      domain_id: null,
      area_id: null,
      name: '',
      lastName: '',
      nickname: '',
      account: '',
      email: '',
      isActive: false,
      hashtag: 0,
      task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
        .keyList,
    };

    this.gUserTemp = { ...this.gUser };
  }

  onClick_button_translate() {
    this.config.isPopupDictionaryVisible = true;
  }

  onClick_button_edit(event: any) {
    this.EnableComponent(this.gEditorOptionsForm);
    this.gEditorOptionsForm.password.visible = false;

    this.config.isPopupVisible = true;
    this.translate.popupTitle.word = `${this.translate.title.word} ${this.translate.btnEdit.word}`;

    this.config.isView = event.isView;
    this.config.isEdit = event.isEdit;

    this.gUser = event;
    this.gUser['task_id'] = this.config.keys.filter(
      (x: any) => x.list == 'Daily'
    )[0].keyList;

    this.gUserTemp = { ...this.gUser };
  }

  onClick_button_view(event: any) {
    this.config.isPopupVisible = true;
    this.translate.popupTitle.word = `${this.translate.title.word} ${this.translate.btnView.word}`;

    this.config.isView = event.isView;
    this.config.isEdit = event.isEdit;

    this.gUser = event;

    this.gUserTemp = { ...this.gUser };
  }

  DisableComponent(data: any) {
    for (let key in data) {
      if (key !== 'password' && key !== 'account') {
        data[key].readOnly = true;
      }
    }
  }

  EnableComponent(data: any) {
    for (let key in data) {
      if (key !== 'password' && key !== 'account') {
        data[key].readOnly = false;
      }
    }
  }

  onClick_button_confirm() {
    if (this.gForm.instance.validate().isValid) {
      this.config.isLoadingPanel = true;
      this.config.isSendInfo = true;

      if (this.gUserTemp.id === null) {
        this.sUser.Post(this.gUserTemp).subscribe({
          next: (data: any) => {
            this.config.isEdit = data.isEdit;
            this.config.isView = data.isView;

            Object.assign(this.gUser, {
              id: data.id,
              password: data.password,
              domain_id: data.domain_id,
              domain_name: data.domain_name,
              area_id: data.area_id,
              area_name: data.area_name,
              name: data.name,
              lastName: data.lastName,
              nickname: data.nickname,
              account: data.account,
              email: data.email,
              isActive: data.isActive,
              isConfirmDelete: data.isConfirmDelete,
              isEdit: data.isEdit,
              isView: data.isView,
              isCancel: data.isCancel,
              isDelete: data.isDelete,
              hashtag: data.hashtag,
            });
            this.dsUser = [this.gUser, ...this.dsUser];
          },
          complete: () => {
            this.config.isLoadingPanel = false;
            //this.config.isPopupVisible = false;

            this.DisableComponent(this.gEditorOptionsForm);
          },
          error: (error: any) => {
            this.config.isLoadingPanel = false;
            this.sNotify.ErrorMessage(error);
          },
        });
      } else {
        this.sUser.Put(this.gUserTemp).subscribe({
          next: (data: any) => {
            Object.assign(this.gUser, {
              password: data.password,
              domain_id: data.domain_id,
              domain_name: data.domain_name,
              area_id: data.area_id,
              area_name: data.area_name,
              name: data.name,
              lastName: data.lastName,
              nickname: data.nickname,
              account: data.account,
              email: data.email,
              isActive: data.isActive,
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

  onClick_button_close() {
    this.config.isPopupVisible = false;
  }

  onClick_button_password(event: any) {
    this.gChangePassword = {
      id: event.id,
      password: '',
      confirmPassword: '',
      task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
        .keyList,
    };

    this.translate.titleUser.word = event.name;

    this.config.isPopupChangePasswordVisible = true;
  }

  validatePasswordsMatch = (e: any) => {
    const password = this.gChangePassword.password;
    const confirmPassword = e.value;

    return password === confirmPassword;
  };

  onClick_button_confirmPassword() {
    this.config.isLoadingPanel = true;

    if (this.gForm.instance.validate().isValid) {
      this.sUser.PostPassword(this.gChangePassword).subscribe({
        next: (data: any) => {
          this.gChangePassword.password = '';
          this.gChangePassword.confirmPassword = '';
        },
        complete: () => {
          this.config.isLoadingPanel = false;
          this.config.isPopupChangePasswordVisible = false;
        },
        error: (error: any) => {
          this.config.isLoadingPanel = false;
          this.sNotify.ErrorMessage(error);
        },
      });
    }
  }

  onClick_button_confirmDelete(event: any) {
    this.config.isLoadingPanel = true;

    this.sUser
      .Delete({
        id: event.id,
        task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
          .keyList,
      })
      .subscribe({
        next: () => {
          this.dsUser = this.dsUser.filter((user) => user.id !== event.id);
        },
        complete: () => {
          this.config.isLoadingPanel = false;
        },
        error: (error) => {
          this.config.isLoadingPanel = false;
          this.sNotify.ErrorMessage(error);
        },
      });
  }

  onHidden_popup() {
    if (this.config.isPopupVisible) {
      this.config.isPopupVisible = false;
    } else if (this.config.isPopupDictionaryVisible) {
      this.config.isPopupDictionaryVisible = false;
    } else if (this.config.isPopupChangePasswordVisible) {
      this.config.isPopupChangePasswordVisible = false;
    }
  }

  onValueChanged_lookup_Area(event: any) {
    if (event.component.option('displayValue') && this.gUserTemp) {
      this.gUserTemp.area_name = event.component.option('displayValue');
    }
  }

  onValueChanged_lookup_Domain(event: any) {
    if (event.component.option('displayValue') && this.gUserTemp) {
      this.gUserTemp.domain_name = event.component.option('displayValue');
    }
  }
}
