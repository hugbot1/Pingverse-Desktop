import { BrowserWindow, app, shell } from 'electron';
import { ICON_PATH, PRELOAD_PATH, SITE, START_HIDDEN } from './config';
import { closePicker } from './picker/picker';
import { isTrustedURL } from './security';

let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

app.on('before-quit', () => {
    isQuitting = true;
});

export function getMainWindow(): BrowserWindow | null {
    return mainWindow && !mainWindow.isDestroyed() ? mainWindow : null;
}

export function showMainWindow(): void {
    const win = getMainWindow();
    if (!win) return;

    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
}

export function createMainWindow(): BrowserWindow {
    const win = new BrowserWindow({
        show: !START_HIDDEN,
        width: 1200,
        height: 800,
        autoHideMenuBar: true,
        icon: ICON_PATH,
        webPreferences: {
            preload: PRELOAD_PATH,
            devTools: false,
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            backgroundThrottling: false
        }
    });

    mainWindow = win;

    win.on('close', event => {
        if (!isQuitting) {
            event.preventDefault();
            win.hide();
        }
    });

    win.on('closed', () => {
        mainWindow = null;
        closePicker(null);
    });

    win.webContents.on('before-input-event', (event, input) => {
        if (input.type !== 'keyDown') return;

        const key = input.key.toLowerCase();

        if (
            (input.control && !['c', 'v', 'x', 'a'].includes(key)) ||
            input.alt ||
            input.meta ||
            /^F([1-9]|1[0-2])$/.test(input.key)
        ) {
            event.preventDefault();
        }
    });

    win.webContents.on('context-menu', event => {
        event.preventDefault();
    });

    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https://') && !isTrustedURL(url)) {
            shell.openExternal(url);
        }

        return { action: 'deny' };
    });

    win.webContents.on('will-navigate', (event, url) => {
        if (!isTrustedURL(url)) {
            event.preventDefault();

            if (url.startsWith('https://')) {
                shell.openExternal(url);
            }
        }
    });

    win.loadURL(SITE);

    return win;
}