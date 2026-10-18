export type PickerKind = 'screen' | 'window' | 'camera';

export interface PickerItem {
    id: string;
    name: string;
    kind: PickerKind;
    thumbnail?: string;
}

export function pickerClient(sources: PickerItem[], initialKind: PickerKind): void {
    const glyphs: Record<PickerKind, string> = {
        screen: 'No preview',
        window: 'No preview',
        camera: 'No preview'
    };

    let kind = initialKind;
    let selectedId: string | null = null;

    const grid = document.getElementById('grid') as HTMLElement;
    const status = document.getElementById('status') as HTMLElement;
    const share = document.getElementById('share') as HTMLButtonElement;
    const tabs = document.querySelectorAll<HTMLButtonElement>('.tab');

    function render(): void {
        grid.replaceChildren();

        const list = sources.filter(source => source.kind === kind);

        if (!list.length) {
            selectedId = null;
            share.disabled = true;

            const empty = document.createElement('div');
            empty.className = 'empty';
            empty.textContent = 'No sources found in this category.';
            grid.appendChild(empty);
            return;
        }

        for (const source of list) {
            const card = document.createElement('button');
            card.className = 'source' + (source.id === selectedId ? ' selected' : '');

            const preview = document.createElement('div');
            preview.className = 'preview';

            const fallback = document.createElement('span');
            fallback.className = 'fallback';
            fallback.textContent = glyphs[source.kind];

            if (source.thumbnail) {
                const image = document.createElement('img');
                image.alt = '';
                image.src = source.thumbnail;

                image.addEventListener('error', () => {
                    image.remove();
                    preview.prepend(fallback);
                });

                preview.append(image);
            } else {
                preview.append(fallback);
            }

            const check = document.createElement('span');
            check.className = 'check';
            check.textContent = '✓';
            preview.append(check);

            const name = document.createElement('span');
            name.className = 'name';
            name.textContent = source.name;

            card.append(preview, name);

            card.addEventListener('click', () => {
                selectedId = source.id;
                share.disabled = false;
                status.textContent = 'Selected: ' + source.name;
                render();
            });

            grid.appendChild(card);
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            kind = tab.dataset.kind as PickerKind;
            selectedId = null;
            share.disabled = true;
            status.textContent = '';

            tabs.forEach(item => {
                item.classList.toggle('active', item === tab);
            });

            render();
        });
    });

    document.getElementById('cancel')!.addEventListener('click', () => {
        window.open('pingverse-picker://cancel');
    });

    share.addEventListener('click', () => {
        if (selectedId === null) return;

        window.open('pingverse-picker://select?id=' + encodeURIComponent(selectedId));
    });

    render();
}