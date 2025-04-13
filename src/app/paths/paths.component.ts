import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';

import { Subscription } from 'rxjs';
import { AuthenticationService } from '../shared/services/authentication.service';
import { TraductorService } from '../shared/services/traductor.service';
import { NotifyService } from '../shared/services/notify.service';
import { PathsService } from './paths.service';

@Component({
  selector: 'app-paths',
  standalone: false,
  templateUrl: './paths.component.html',
  styleUrl: './paths.component.scss',
})
export class PathsComponent implements OnInit {
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
    popupHeight: 300,
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
    title: { word: '_Paths', disabled: false, visible: true },
    popupTitle: { word: '_Paths', disabled: false, visible: true },
    colHashtag: { word: '_#', disabled: false, visible: true },
    colName: { word: '_Name', disabled: false, visible: true },
    colPath: { word: '_Path', disabled: false, visible: true },
    colUser: { word: '_User', disabled: false, visible: true },
    colPassword: { word: '_Password', disabled: false, visible: true },
    valName: { word: '_Name is required', disabled: false, visible: true },
    valPath: { word: '_Path is required', disabled: false, visible: true },

    btnTranslate: { word: '_Translate', disabled: false, visible: true },
    popupTitleDictionary: {
      word: '_Dictionary',
      disabled: false,
      visible: true,
    },
  };

  //#endregion CONFIG

  //*TRANSLATE
  component_name: string = 'paths';
  component_area: string = '';
  component_language: string = 'ING';

  //*GRID
  dsPaths: any[] | [] = [];

  gPaths: any = {
    id: null,
    name: '',
    path: '',
    user: '',
    password: '',
  };

  gPathsTemp: any = {
    id: null,
    name: '',
    path: '',
    user: '',
    password: '',
  };

  constructor(
    private sPaths: PathsService,
    private sNotify: NotifyService,
    private sTraductor: TraductorService,
    private sAuthententication: AuthenticationService
  ) {
    // this.LoadTraductor();
  }

  ngOnInit() {
    this.gSubscription$ = this.sAuthententication.gAccess$.subscribe(
      (data: any) => {
        this.config.keys = data.tasks;
      }
    );

    this.LoadInfo();
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

    this.sPaths.Get().subscribe({
      next: (data: any) => {
        this.dsPaths = data;
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

    this.gPaths = {
      id: null,
      name: '',
      path: '',
      user: '',
      password: '',
      task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
        .keyList,
    };

    this.gPathsTemp = { ...this.gPaths };
  }

  onClick_button_translate() {
    this.config.isPopupDictionaryVisible = true;
  }

  onClick_button_edit(event: any) {
    this.config.isPopupVisible = true;
    this.translate.popupTitle.word = `${this.translate.title.word} ${this.translate.btnEdit.word}`;

    this.config.isView = event.isView;
    this.config.isEdit = event.isEdit;

    this.gPaths = event;
    this.gPaths['task_id'] = this.config.keys.filter(
      (x: any) => x.list == 'Daily'
    )[0].keyList;

    this.gPathsTemp = { ...this.gPaths };
  }

  onClick_button_view(event: any) {
    this.config.isPopupVisible = true;
    this.translate.popupTitle.word = `${this.translate.title.word} ${this.translate.btnView.word}`;

    this.config.isView = event.isView;
    this.config.isEdit = event.isEdit;

    this.gPaths = event;

    this.gPathsTemp = { ...this.gPaths };
  }

  onClick_button_confirm() {
    if (this.gForm.instance.validate().isValid) {
      this.config.isLoadingPanel = true;
      if (this.gPathsTemp.id === null) {
        this.sPaths.Post(this.gPathsTemp).subscribe({
          next: (data: any) => {
            console.log(data, 'Recibe');

            this.config.isEdit = data.isEdit;
            this.config.isView = data.isView;

            Object.assign(this.gPaths, {
              id: data.id,
              name: data.name,
              path: data.path,
              user: data.user,
              password: data.password,
              isConfirmDelete: data.isConfirmDelete,
              isEdit: data.isEdit,
              isView: data.isView,
              isCancel: data.isCancel,
              isDelete: data.isDelete,
              hashtag: data.hashtag,
            });
            this.dsPaths = [this.gPaths, ...this.dsPaths];
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
        this.sPaths.Put(this.gPathsTemp).subscribe({
          next: (data: any) => {
            Object.assign(this.gPaths, {
              name: data.name,
              path: data.path,
              user: data.user,
              password: data.password,
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

    this.sPaths
      .Delete({
        id: event.id,
        task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
          .keyList,
      })
      .subscribe({
        next: () => {
          this.dsPaths = this.dsPaths.filter((paths) => paths.id !== event.id);
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
}
