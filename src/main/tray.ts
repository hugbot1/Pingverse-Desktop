import { Menu, Tray, app } from 'electron';
import { ICON_PATH } from './config';
import { showMainWindow } from './window';

let tray: Tray | null = null;

export function createTray(): void {
    tray = new Tray(ICON_PATH);
    tray.setToolTip('Pingverse');

    tray.setContextMenu(
        Menu.buildFromTemplate([
            { label: 'Open Pingverse', click: showMainWindow },
            {
                label: 'Start with system',
                type: 'checkbox',
                checked: app.getLoginItemSettings().openAtLogin,
                click: item => {
                    app.setLoginItemSettings({
                        openAtLogin: item.checked,
                        args: ['--hidden']
                    });
                }
            },
            { type: 'separator' },
            { label: 'Quit', click: () => app.quit() }
        ])
    );

    tray.on('click', showMainWindow);
}