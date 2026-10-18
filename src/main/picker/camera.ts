import type { BrowserWindow } from 'electron';
import type { PickerItem } from './client';
import { buildPickerPage } from './page';
import { openPicker } from './picker';

export function chooseCamera(
    parent: BrowserWindow,
    cameras: Array<{ id: string; name: string }>
): Promise<string | null> {
    const items: PickerItem[] = cameras.map(camera => ({
        id: camera.id,
        name: camera.name,
        kind: 'camera'
    }));

    const html = buildPickerPage({
        title: 'Select camera',
        shareLabel: 'Select',
        items,
        initialKind: 'camera'
    });

    return openPicker(parent, 'Select camera', html, items.map(item => item.id));
}