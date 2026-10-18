export const PICK_CAMERA_CHANNEL = 'pingverse:pick-camera' as const;

export interface CameraDevice {
    deviceId: string;
    label: string;
}