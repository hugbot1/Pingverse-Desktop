import { contextBridge, ipcRenderer, webFrame } from 'electron';
import type { CameraDevice, PICK_CAMERA_CHANNEL } from '../shared/ipc';

declare global {
    interface Window {
        __pingverseNative: {
            pickCamera(devices: CameraDevice[]): Promise<string | null>;
        };
    }
}

const pickCameraChannel: typeof PICK_CAMERA_CHANNEL = 'pingverse:pick-camera';

function installCameraPicker(): void {
    const md = navigator.mediaDevices as MediaDevices & { __pvPatched?: boolean };

    if (!md || md.__pvPatched) return;
    md.__pvPatched = true;

    const original = md.getUserMedia.bind(md);

    const listCameras = async () =>
        (await md.enumerateDevices()).filter(device => device.kind === 'videoinput');

    md.getUserMedia = async function (
        constraints?: MediaStreamConstraints
    ): Promise<MediaStream> {
        const video = constraints?.video;

        if (!video || (typeof video === 'object' && video.deviceId)) {
            return original(constraints);
        }

        let cameras = await listCameras();

        if (cameras.length && !cameras[0].label) {
            const probe = await original({ video: true });
            probe.getTracks().forEach(track => track.stop());
            cameras = await listCameras();
        }

        if (cameras.length < 2) return original(constraints);

        const id = await window.__pingverseNative.pickCamera(
            cameras.map(({ deviceId, label }) => ({ deviceId, label }))
        );

        if (!id) {
            throw new DOMException('Camera selection cancelled', 'NotAllowedError');
        }

        const chosen: MediaTrackConstraints = {
            ...(video === true ? {} : video),
            deviceId: { exact: id }
        };

        return original({ ...constraints, video: chosen });
    };
}

contextBridge.exposeInMainWorld('__pingverseNative', {
    pickCamera: (devices: CameraDevice[]) =>
        ipcRenderer.invoke(pickCameraChannel, devices)
});

webFrame.executeJavaScript(`(${installCameraPicker.toString()})()`);