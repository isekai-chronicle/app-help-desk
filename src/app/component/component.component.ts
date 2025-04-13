import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';

import { Subscription } from 'rxjs';
import { AuthenticationService } from '../shared/services/authentication.service';
import { TraductorService } from '../shared/services/traductor.service';
import { NotifyService } from '../shared/services/notify.service';
import { ComponentService } from './component.service';

@Component({
  selector: 'app-component',
  standalone: false,
  templateUrl: './component.component.html',
  styleUrl: './component.component.scss',
})
export class ComponentComponent implements OnInit {
  //*HELPER
  @ViewChild('gForm') gForm: DxFormComponent | any;
  //#region SYSTEM-CONFIG

  private gSubscription$!: Subscription;

  config: any = {
    isLoadingPanel: false,
    isPopupVisible: false,
    isPopupDictionaryVisible: false,
    isEdit: true,
    isView: false,
    popupHeight: 400,
    popupWidth: 600,
    popupDictionaryWidth: 1250,
    popupDictionaryHeight: 800,
    isLoadingTraductor: false,
    buttonColumnWidth: 130,
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
    btnConfirmSubMenu: { word: '_Confirm', disabled: false, visible: true },
    title: { word: '_Component', disabled: false, visible: true },
    popupTitle: { word: '_Component', disabled: false, visible: true },
    colHashtag: { word: '_#', disabled: false, visible: true },
    colName: { word: '_Name', disabled: false, visible: true },
    colDisplayName: { word: '_Display Name', disabled: false, visible: true },
    colAreaName: { word: '_Area', disabled: false, visible: true },
    colPathName: { word: '_Path', disabled: false, visible: true },
    colIsOffline: { word: '_Offline', disabled: false, visible: true },
    colIsService: { word: '_Service', disabled: false, visible: true },
    colIsShared: { word: '_Shared', disabled: false, visible: true },
    valName: { word: '_Name is required', disabled: false, visible: true },
    valDisplayName: {
      word: '_Display Name is required',
      disabled: false,
      visible: true,
    },
    valArea: { word: '_Area is required', disabled: false, visible: true },

    btnTranslate: { word: '_Translate', disabled: false, visible: true },

    popupTitleDictionary: {
      word: '_Dictionary',
      disabled: false,
      visible: true,
    },
    lblIsOffline: { word: '_Offline', disabled: false, visible: true },
    lblIsService: { word: '_Service', disabled: false, visible: true },
    lblIsShared: { word: '_Shared', disabled: false, visible: true },
  };

  //#endregion CONFIG

  //*TRANSLATE
  component_name: string = 'component';
  component_area: string = '';
  component_language: string = 'ING';

  //*GRID
  dsComponent: any[] | [] = [];
  dsArea: any[] | [] = [];
  dsPath: any[] | [] = [];

  gComponent: any = {
    id: null,
    name: '',
    displayName: '',
    area_id: null,
    area_name: '',
    path_id: null,
    path_name: '',
    isOffline: false,
    isService: false,
    isShared: false,
  };

  gComponentTemp: any = {
    id: null,
    name: '',
    displayName: '',
    area_id: null,
    area_name: '',
    path_id: null,
    path_name: '',
    isOffline: false,
    isService: false,
    isShared: false,
  };

  gEditorOptionsForm: any = {
    area: { readonly: false },
    isOffline: { readonly: false },
    isService: { readonly: false },
    isShared: { readonly: false },
  };

  constructor(
    private sComponent: ComponentService,
    private sNotify: NotifyService,
    private sTraductor: TraductorService,
    private sAuthententication: AuthenticationService
  ) {
    // this.LoadTraductor();

    this.onValueChanged_lookup_Area =
      this.onValueChanged_lookup_Area.bind(this);

    this.onValueChanged_lookup_Path =
      this.onValueChanged_lookup_Path.bind(this);
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

    this.sComponent.Get().subscribe({
      next: (data: any) => {
        this.dsComponent = data;
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
    this.LoadComboPath();
  }

  LoadComboArea() {
    this.sComponent.GetComboArea().subscribe({
      next: (data: any) => {
        this.dsArea = data;
      },
      complete: () => {},
      error: (error) => {
        this.sNotify.ErrorMessage(error);
      },
    });
  }

  LoadComboPath() {
    this.sComponent.GetComboPath().subscribe({
      next: (data: any) => {
        this.dsPath = data;
      },
      complete: () => {},
      error: (error) => {
        this.sNotify.ErrorMessage(error);
      },
    });
  }

  //#endregion

  //#region EVENT

  onClick_button_delete(event: any) {
    this.config.buttonColumnWidth = 200;
    event.isConfirmDelete = 1;
    event.isCancel = 1;
  }

  onClick_button_cancel(event: any) {
    this.config.buttonColumnWidth = 130;
    event.isConfirmDelete = 0;
    event.isCancel = 0;
  }

  onClick_button_add() {
    this.config.isPopupVisible = true;
    this.translate.popupTitle.word = `${this.translate.title.word} ${this.translate.btnAdd.word}`;

    this.gComponent = {
      id: null,
      name: '',
      displayName: '',
      area_id: null,
      path_id: null,
      isOffline: false,
      isService: false,
      isShared: false,
      task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
        .keyList,
    };

    this.gComponentTemp = { ...this.gComponent };
  }

  onClick_button_translate() {
    this.config.isPopupDictionaryVisible = true;
  }

  onClick_button_edit(event: any) {
    this.config.isPopupVisible = true;
    this.translate.popupTitle.word = `${this.translate.title.word} ${this.translate.btnEdit.word}`;

    this.config.isView = event.isView;
    this.config.isEdit = event.isEdit;

    this.gComponent = event;
    this.gComponent['task_id'] = this.config.keys.filter(
      (x: any) => x.list == 'Daily'
    )[0].keyList;

    this.gComponentTemp = { ...this.gComponent };
  }

  onClick_button_view(event: any) {
    this.config.isPopupVisible = true;
    this.translate.popupTitle.word = `${this.translate.title.word} ${this.translate.btnView.word}`;

    this.config.isView = event.isView;
    this.config.isEdit = event.isEdit;

    this.gComponent = event;

    this.gComponentTemp = { ...this.gComponent };
  }

  onClick_button_confirm() {
    if (this.gForm.instance.validate().isValid) {
      this.config.isLoadingPanel = true;
      if (this.gComponentTemp.id === null) {
        this.sComponent.Post(this.gComponentTemp).subscribe({
          next: (data: any) => {
            this.config.isEdit = data.isEdit;
            this.config.isView = data.isView;

            Object.assign(this.gComponent, {
              id: data.id,
              name: data.name,
              displayName: data.displayName,
              area_id: data.area_id,
              area_name: data.area_name,
              path_id: data.path_id,
              path_name: data.path_name,
              isOffline: data.isOffline,
              isService: data.isService,
              isShared: data.isShared,
              isConfirmDelete: data.isConfirmDelete,
              isEdit: data.isEdit,
              isView: data.isView,
              isCancel: data.isCancel,
              isDelete: data.isDelete,
              hashtag: data.hashtag,
            });
            this.dsComponent = [this.gComponent, ...this.dsComponent];
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
        this.sComponent.Put(this.gComponentTemp).subscribe({
          next: (data: any) => {
            Object.assign(this.gComponent, {
              name: data.name,
              displayName: data.displayName,
              area_id: data.area_id,
              area_name: data.area_name,
              path_id: data.path_id,
              path_name: data.path_name,
              isOffline: data.isOffline,
              isService: data.isService,
              isShared: data.isShared,
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

  onClick_button_confirmDelete(event: any) {
    this.config.isLoadingPanel = true;

    this.sComponent
      .Delete({
        id: event.id,
        task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
          .keyList,
      })
      .subscribe({
        next: () => {
          this.dsComponent = this.dsComponent.filter(
            (component) => component.id !== event.id
          );
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
    }
  }

  onValueChanged_lookup_Area(event: any) {
    if (event.component.option('displayValue') && this.gComponentTemp) {
      this.gComponentTemp.area_name = event.component.option('displayValue');
    }
  }

  onValueChanged_lookup_Path(event: any) {
    if (event.component.option('displayValue') && this.gComponentTemp) {
      this.gComponentTemp.path_name = event.component.option('displayValue');
    }
  }
}
