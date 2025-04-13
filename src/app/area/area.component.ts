import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';

import { Subscription } from 'rxjs';
import { AuthenticationService } from '../shared/services/authentication.service';
import { TraductorService } from '../shared/services/traductor.service';
import { NotifyService } from '../shared/services/notify.service';
import { AreaService } from './area.service';

type OnReorderType = DxDataGridTypes.RowDragging['onReorder'] | any;

@Component({
  selector: 'app-area',
  standalone: false,
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss',
})
export class AreaComponent implements OnInit {
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
    popupHeight: 250,
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
    title: { word: '_Area', disabled: false, visible: true },
    popupTitle: { word: '_Area', disabled: false, visible: true },
    colHashtag: { word: '_#', disabled: false, visible: true },
    colName: { word: '_Name', disabled: false, visible: true },
    colRoute: { word: '_Route', disabled: false, visible: true },
    valName: { word: '_Name is required', disabled: false, visible: true },
    valRoute: { word: '_Route is required', disabled: false, visible: true },
    btnTranslate: { word: '_Translate', disabled: false, visible: true },
    popupTitleDictionary: {
      word: '_Dictionary',
      disabled: false,
      visible: true,
    },
  };

  //#endregion CONFIG

  //*TRANSLATE
  component_name: string = 'area';
  component_area: string = '';
  component_language: string = 'ING';

  //*GRID
  dsArea: any[] | [] = [];

  gArea: any = {
    id: null,
    name: '',
    route: '',
  };

  gAreaTemp: any = {
    id: null,
    name: '',
    route: '',
  };

  constructor(
    private sArea: AreaService,
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

    this.sArea.Get().subscribe({
      next: (data: any) => {
        this.dsArea = data;
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

  //HABILITAR SOLAMENTE SI SE DESEA IMPLEMENTAR EL REORDENAMIENTO DE LAS FILAS
  // onReorder = (event: OnReorderType) => {
  //   if (event) {
  //     const visibleRows = event.component.getVisibleRows();
  //     const toIndex = this.dsArea.findIndex(
  //       (item) => item.id === visibleRows[event.toIndex].data.id
  //     );
  //     const fromIndex = this.dsArea.findIndex(
  //       (item) => item.id === event.itemData.id
  //     );

  //     this.dsArea.splice(fromIndex, 1);
  //     this.dsArea.splice(toIndex, 0, event.itemData);

  //     for (let index = 0; index < this.dsArea.length; index++) {
  //       this.dsArea[index].hashtag = index + 1;

  //       if (this.dsArea[index].id === event.itemData.id) {
  //         this.sArea
  //           .PutSort({
  //             id: this.dsArea[index].id,
  //             hashtag: index + 1,
  //             task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
  //               .keyList,
  //           })
  //           .subscribe();
  //       }
  //     }
  //   }
  // };

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

    this.gArea = {
      id: null,
      name: '',
      route: '',
      task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
        .keyList,
    };

    this.gAreaTemp = { ...this.gArea };
  }

  onClick_button_translate() {
    this.config.isPopupDictionaryVisible = true;
  }

  onClick_button_edit(event: any) {
    this.config.isPopupVisible = true;
    this.translate.popupTitle.word = `${this.translate.title.word} ${this.translate.btnEdit.word}`;

    this.config.isView = event.isView;
    this.config.isEdit = event.isEdit;

    this.gArea = event;
    this.gArea['task_id'] = this.config.keys.filter(
      (x: any) => x.list == 'Daily'
    )[0].keyList;

    this.gAreaTemp = { ...this.gArea };
  }

  onClick_button_view(event: any) {
    this.config.isPopupVisible = true;
    this.translate.popupTitle.word = `${this.translate.title.word} ${this.translate.btnView.word}`;

    this.config.isView = event.isView;
    this.config.isEdit = event.isEdit;

    this.gArea = event;

    this.gAreaTemp = { ...this.gArea };
  }

  onClick_button_confirm() {
    if (this.gForm.instance.validate().isValid) {
      this.config.isLoadingPanel = true;
      if (this.gAreaTemp.id === null) {
        this.sArea.Post(this.gAreaTemp).subscribe({
          next: (data: any) => {
            this.config.isEdit = data.isEdit;
            this.config.isView = data.isView;

            Object.assign(this.gArea, {
              id: data.id,
              name: data.name,
              route: data.route,
              isConfirmDelete: data.isConfirmDelete,
              isEdit: data.isEdit,
              isView: data.isView,
              isCancel: data.isCancel,
              isDelete: data.isDelete,
              hashtag: data.hashtag,
            });
            this.dsArea = [this.gArea, ...this.dsArea];
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
        this.sArea.Put(this.gAreaTemp).subscribe({
          next: (data: any) => {
            Object.assign(this.gArea, {
              name: data.name,
              route: data.route,
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

    this.sArea
      .Delete({
        id: event.id,
        task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
          .keyList,
      })
      .subscribe({
        next: () => {
          this.dsArea = this.dsArea.filter((area) => area.id !== event.id);
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
