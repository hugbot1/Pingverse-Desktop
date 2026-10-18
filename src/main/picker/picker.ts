import { BrowserWindow } from 'electron';
import { ICON_PATH } from '../config';

let pickerWindow: BrowserWindow | null = null;
let pickerResolve: ((id: string | null) => void) | null = null;

export function closePicker(result: string | null = null): void {
    const resolve = pickerResolve;
    pickerResolve = null;

    if (resolve) resolve(result);

    if (pickerWindow && !pickerWindow.isDestroyed()) {
        pickerWindow.close();
    }
}

export function openPicker(
    parent: BrowserWindow,
    title: string,
    html: string,
    validIds: string[]
): Promise<string | null> {
    if (pickerWindow) {
        closePicker(null);
    }

    return new Promise(resolve => {
        pickerResolve = resolve;

        const picker = new BrowserWindow({
            width: 1000,
            height: 720,
            minWidth: 740,
            minHeight: 540,
            title,
            parent,
            modal: true,
            autoHideMenuBar: true,
            icon: ICON_PATH,
            backgroundColor: '#302e2b',
            resizable: true,
            minimizable: false,
            maximizable: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                sandbox: true,
                devTools: false
            }
        });

        pickerWindow = picker;
        picker.setMenu(null);

        picker.webContents.setWindowOpenHandler(({ url }) => {
            try {
                const parsed = new URL(url);

                if (parsed.protocol !== 'pingverse-picker:') {
                    return { action: 'deny' };
                }

                if (parsed.hostname === 'select') {
                    const id = parsed.searchParams.get('id');
                    closePicker(id !== null && validIds.includes(id) ? id : null);
                } else if (parsed.hostname === 'cancel') {
                    closePicker(null);
                }
            } catch (error) {
                console.error('Picker action failed:', error);
                closePicker(null);
            }

            return { action: 'deny' };
        });

        picker.webContents.on('will-navigate', event => {
            event.preventDefault();
        });

        picker.on('closed', () => {
            if (pickerWindow !== picker) return;

            pickerWindow = null;

            if (pickerResolve) {
                const finish = pickerResolve;
                pickerResolve = null;
                finish(null);
            }
        });

        picker
            .loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html))
            .catch(error => {
                console.error('Could not open picker:', error);
                closePicker(null);
            });
    });
}