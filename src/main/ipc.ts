import { ipcMain } from 'electron';
import { PICK_CAMERA_CHANNEL, type CameraDevice } from '../shared/ipc';
import { chooseCamera } from './picker/camera';
import { isTrustedURL } from './security';
import { getMainWindow } from './window';

function isCameraDevice(value: unknown): value is CameraDevice {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof (value as CameraDevice).deviceId === 'string'
    );
}

export function registerIpc(): void {
    ipcMain.handle(PICK_CAMERA_CHANNEL, async (event, devices: unknown) => {
        const win = getMainWindow();

        if (!win || !isTrustedURL(event.senderFrame?.url) || !Array.isArray(devices)) {
            return null;
        }

        const cameras = devices
            .slice(0, 20)
            .filter(isCameraDevice)
            .map((device, index) => ({
                id: device.deviceId,
                name: String(device.label || '').slice(0, 200) || 'Camera ' + (index + 1)
            }));

        if (!cameras.length) return null;

        return chooseCamera(win, cameras);
    });
}