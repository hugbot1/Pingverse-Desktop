import { Menu, app } from 'electron';
import { APP_ID } from './config';
import { registerIpc } from './ipc';
import { configureSession } from './session';
import { createTray } from './tray';
import { createMainWindow, showMainWindow } from './window';

Menu.setApplicationMenu(null);
app.setAppUserModelId(APP_ID);

if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.on('second-instance', showMainWindow);

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.whenReady().then(() => {
        configureSession();
        registerIpc();
        createMainWindow();
        createTray();
    });
}