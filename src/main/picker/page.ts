import { pickerClient, type PickerItem, type PickerKind } from './client';
import { PICKER_CSS } from './styles';

interface PageOptions {
    title: string;
    shareLabel: string;
    items: PickerItem[];
    initialKind: PickerKind;
    tabs?: string;
}

function safeJSON(value: unknown): string {
    return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function buildPickerPage(options: PageOptions): string {
    const { title, shareLabel, items, initialKind, tabs = '' } = options;

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy"
 content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
<title>${title}</title>
<style>${PICKER_CSS}</style>
</head>

<body>
<header>
    <h1>${title}</h1>
</header>

<main>
    ${tabs}
    <div class="grid" id="grid"></div>
</main>

<footer>
    <span id="status"></span>
    <div class="actions">
        <button class="button" id="cancel">Cancel</button>
        <button class="button primary" id="share" disabled>${shareLabel}</button>
    </div>
</footer>

<script>
(${pickerClient.toString()})(${safeJSON(items)}, ${safeJSON(initialKind)});
</script>
</body>
</html>`;
}