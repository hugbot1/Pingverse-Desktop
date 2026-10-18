import { app, desktopCapturer, session } from 'electron';
import * as path from 'node:path';
import { chooseScreenSource } from './picker/screen';
import { isTrustedURL } from './security';
import { getMainWindow } from './window';

const ALLOWED_REQUESTS: string[] = ['media', 'notifications', 'display-capture'];
const ALLOWED_CHECKS: string[] = ['media', 'notifications'];

export function configureSession(): void {
    const ses = session.defaultSession;

    ses.setPermissionRequestHandler((webContents, permission, callback, details) => {
        const url = details?.requestingUrl || webContents.getURL();

        callback(isTrustedURL(url) && ALLOWED_REQUESTS.includes(permission));
    });

    ses.setPermissionCheckHandler((_webContents, permission, requestingOrigin) => {
        return isTrustedURL(requestingOrigin) && ALLOWED_CHECKS.includes(permission);
    });

    ses.setDisplayMediaRequestHandler(
        async (request, callback) => {
            try {
                if (!isTrustedURL(request.securityOrigin)) {
                    callback(null);
                    return;
                }

                const sources = await desktopCapturer.getSources({
                    types: ['screen', 'window'],
                    thumbnailSize: { width: 640, height: 400 },
                    fetchWindowIcons: true
                });

                const win = getMainWindow();

                if (!sources.length || !win) {
                    callback(null);
                    return;
                }

                const sourceId = await chooseScreenSource(win, sources);
                const selected = sources.find(source => source.id === sourceId);

                if (!selected) {
                    callback(null);
                    return;
                }

                callback({
                    video: selected,
                    ...(request.audioRequested && process.platform === 'win32'
                        ? { audio: 'loopback' as const }
                        : {})
                });
            } catch (error) {
                console.error('Screen sharing failed:', error);
                callback(null);
            }
        },
        { useSystemPicker: false }
    );

    ses.on('will-download', (event, item, webContents) => {
        if (!isTrustedURL(webContents.getURL())) {
            event.preventDefault();
            return;
        }

        item.setSaveDialogOptions({
            title: 'Save download',
            defaultPath: path.join(
                app.getPath('downloads'),
                path.basename(item.getFilename())
            )
        });
    });
}