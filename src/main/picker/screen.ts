import type { BrowserWindow, DesktopCapturerSource } from 'electron';
import type { PickerItem } from './client';
import { buildPickerPage } from './page';
import { openPicker } from './picker';

const TABS = `<div class="tabs">
        <button class="tab active" data-kind="screen">Entire screens</button>
        <button class="tab" data-kind="window">Application windows</button>
    </div>`;

export function chooseScreenSource(
    parent: BrowserWindow,
    sources: DesktopCapturerSource[]
): Promise<string | null> {
    const items: PickerItem[] = sources.map(source => ({
        id: source.id,
        name: source.name,
        kind: source.id.startsWith('screen:') ? 'screen' : 'window',
        thumbnail: source.thumbnail.toDataURL()
    }));

    const html = buildPickerPage({
        title: 'Select screen',
        shareLabel: 'Share',
        items,
        initialKind: 'screen',
        tabs: TABS
    });

    return openPicker(parent, 'Share your screen', html, items.map(item => item.id));
}