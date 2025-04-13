import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';

import { Subscription } from 'rxjs';
import { AuthenticationService } from '../shared/services/authentication.service';
import { TraductorService } from '../shared/services/traductor.service';
import { NotifyService } from '../shared/services/notify.service';
import { RoleService } from './role.service';

type OnReorderType = DxDataGridTypes.RowDragging['onReorder'] | any;

@Component({
  selector: 'app-role',
  standalone: false,
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss',
})
export class RoleComponent implements OnInit {
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
    popupWidth: 700,
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
    title: { word: '_Role', disabled: false, visible: true },
    popupTitle: { word: '_Role', disabled: false, visible: true },
    colHashtag: { word: '_#', disabled: false, visible: true },
    colName: { word: '_Name', disabled: false, visible: true },
    colAreaName: { word: '_Area', disabled: false, visible: true },
    valName: { word: '_Name is required', disabled: false, visible: true },
    valArea: { word: '_Area is required', disabled: false, visible: true },
    btnTranslate: { word: '_Translate', disabled: false, visible: true },
    popupTitleDictionary: {
      word: '_Dictionary',
      disabled: false,
      visible: true,
    },
  };

  gEditorOptionsForm: any = {
    area: { readOnly: false },
  };

  //#endregion CONFIG

  //*TRANSLATE
  component_name: string = 'role';
  component_area: string = '';
  component_language: string = 'ING';

  //*GRID
  dsRole: any[] | [] = [];
  dsArea: any[] | [] = [];

  gRole: any = {
    id: null,
    area_id: null,
    name: '',
  };

  gRoleTemp: any = {
    id: null,
    area_id: null,
    name: '',
  };

  constructor(
    private sRole: RoleService,
    private sNotify: NotifyService,
    private sTraductor: TraductorService,
    private sAuthententication: AuthenticationService
  ) {
    this.LoadTraductor();

    this.onValueChanged_lookup_Area =
      this.onValueChanged_lookup_Area.bind(this);
  }

  ngOnInit() {
    this.gSubscription$ = this.sAuthententication.gAccess$.subscribe(
      (data: any) => {
        this.config.keys = data.tasks;
      }
    );

    this.LoadInfo();
    this.LoadComboArea();
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

    this.sRole.Get().subscribe({
      next: (data: any) => {
        this.dsRole = data;
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

  LoadComboArea() {
    this.sRole.GetComboArea().subscribe({
      next: (data: any) => {
        this.dsArea = data;
      },
    });
  }

  //#endregion

  //#region EVENT

  //HABILITAR SOLAMENTE SI SE ACTUALIZAR EL SORT
  // onReorder = (event: OnReorderType) => {
  //   if (event) {
  //     const visibleRows = event.component.getVisibleRows();
  //     const toIndex = this.dsRole.findIndex(
  //       (item) => item.id === visibleRows[event.toIndex].data.id
  //     );
  //     const fromIndex = this.dsRole.findIndex(
  //       (item) => item.id === event.itemData.id
  //     );

  //     this.dsRole.splice(fromIndex, 1);
  //     this.dsRole.splice(toIndex, 0, event.itemData);

  //     for (let index = 0; index < this.dsRole.length; index++) {
  //       this.dsRole[index].hashtag = index + 1;

  //       if (this.dsRole[index].id === event.itemData.id) {
  //         this.sRole
  //           .PutSort({
  //             id: this.dsRole[index].id,
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

    this.gRole = {
      id: null,
      area_id: null,
      area_name: '',
      name: '',
      hashtag: 0,
      task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
        .keyList,
    };

    this.gRoleTemp = { ...this.gRole };
  }

  onClick_button_translate() {
    this.config.isPopupDictionaryVisible = true;
  }

  onClick_button_edit(event: any) {
    this.config.isPopupVisible = true;
    this.translate.popupTitle.word = `${this.translate.title.word} ${this.translate.btnEdit.word}`;

    this.config.isView = event.isView;
    this.config.isEdit = event.isEdit;

    this.gRole = event;
    this.gRole['task_id'] = this.config.keys.filter(
      (x: any) => x.list == 'Daily'
    )[0].keyList;

    this.gRoleTemp = { ...this.gRole };
  }

  onClick_button_view(event: any) {
    this.config.isPopupVisible = true;
    this.translate.popupTitle.word = `${this.translate.title.word} ${this.translate.btnView.word}`;

    this.config.isView = event.isView;
    this.config.isEdit = event.isEdit;

    this.gRole = event;

    this.gRoleTemp = { ...this.gRole };
  }

  onClick_button_confirm() {
    if (this.gForm.instance.validate().isValid) {
      this.config.isLoadingPanel = true;
      if (this.gRoleTemp.id === null) {
        this.sRole.Post(this.gRoleTemp).subscribe({
          next: (data: any) => {
            this.config.isEdit = data.isEdit;
            this.config.isView = data.isView;

            Object.assign(this.gRole, {
              id: data.id,
              area_id: data.area_id,
              area_name: data.area_name,
              name: data.name,
              isConfirmDelete: data.isConfirmDelete,
              isEdit: data.isEdit,
              isView: data.isView,
              isCancel: data.isCancel,
              isDelete: data.isDelete,
              hashtag: data.hashtag,
            });
            this.dsRole = [this.gRole, ...this.dsRole];
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
        this.sRole.Put(this.gRoleTemp).subscribe({
          next: (data: any) => {
            Object.assign(this.gRole, {
              area_id: data.area_id,
              area_name: data.area_name,
              name: data.name,
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

    this.sRole
      .Delete({
        id: event.id,
        task_id: this.config.keys.filter((x: any) => x.list == 'Daily')[0]
          .keyList,
      })
      .subscribe({
        next: () => {
          this.dsRole = this.dsRole.filter((role) => role.id !== event.id);
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
    if (event.component.option('displayValue') && this.gRoleTemp) {
      this.gRoleTemp.area_name = event.component.option('displayValue');
    }
  }
}
