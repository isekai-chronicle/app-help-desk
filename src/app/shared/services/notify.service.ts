import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  constructor() {}

  ErrorMessage(error: any) {
    let errorMessage = error.error || 'An error occurred';

    if (error.error && error.error.errors) {
      const errorMessages = Object.values(error.error.errors).flat();
      errorMessage = errorMessages.join('\n');
    } else if (error.error && error.error.data) {
      errorMessage = error.error.data.join('\n');
    }

    this.Notify({
      message: `${errorMessage}`,
      type: 'warning',
      height: 'auto',
      width: 'auto',
      displayTime: 5000,
    });
  }

  Message(message: String) {
    this.Notify({
      message: `${message}`,
      type: 'success',
      height: 'auto',
      width: 'auto',
      displayTime: 5000,
    });
  }

  Error(message: String) {
    this.Notify({
      message: `${message}`,
      type: 'error',
      height: 'auto',
      width: 'auto',
      displayTime: 5000,
    });
  }

  Notify(config: any) {
    config = {
      message:
        config?.message !== undefined && config?.message !== null
          ? config.message
          : '',
      height:
        config?.height !== undefined && config?.height !== null
          ? config.height
          : 45,
      width:
        config?.width !== undefined && config?.width !== null
          ? config.width
          : 300,
      minWidth:
        config?.minWidth !== undefined && config?.minWidth !== null
          ? config.minWidth
          : 150,
      type:
        config?.type !== undefined && config?.type !== null
          ? config.type
          : 'success',
      displayTime:
        config?.displayTime !== undefined && config?.displayTime !== null
          ? config.displayTime
          : 3500,
      position:
        config?.position !== undefined && config?.position !== null
          ? config.position
          : 'bottom right',
      direction:
        config?.direction !== undefined && config?.direction !== null
          ? config.direction
          : 'up-push',
    };

    notify(
      {
        message: config.message,
        height: config.height,
        width: config.width,
        minWidth: config.minWidth,
        type: config.type,
        displayTime: config.displayTime,
      },
      { position: config.position, direction: config.direction }
    );
  }
}
