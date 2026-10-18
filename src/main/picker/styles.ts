export const PICKER_CSS = String.raw`
:root {
    --bg: #302e2b;
    --sidebar: #262522;
    --cards: #262522;
    --text: #e9edef;
    --text-muted: #9a9b96;
    --accent: #6fa74a;
    --accent-hover: #588838;
    --border: #44413d;
}

* {
    box-sizing: border-box;
}

html,
body {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
}

body {
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text);
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

header {
    flex: 0 0 auto;
    padding: 25px 28px 20px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
}

h1 {
    margin: 0;
    font-size: 22px;
    line-height: 1.35;
    letter-spacing: -0.45px;
}

main {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
    padding: 20px 28px 24px;
    gap: 20px;
}

.tabs {
    display: flex;
    flex: 0 0 auto;
    align-self: flex-start;
    gap: 4px;
    padding: 4px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--sidebar);
}

button {
    font: inherit;
}

.tab {
    min-height: 36px;
    padding: 0 15px;
    border: 1px solid transparent;
    border-radius: 7px;
    background: transparent;
    color: var(--text);
    font-size: 13px;
    cursor: pointer;
}

.tab:hover {
    color: var(--text);
    background: var(--accent-hover);
}

.tab.active {
    background: var(--accent);
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(245px, 1fr));
    align-content: start;
    align-items: start;
    gap: 60px;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 2px 3px 8px 2px;
    scrollbar-width: thin;
    scrollbar-color: #514e48 transparent;
}

.grid::-webkit-scrollbar {
    width: 8px;
}

.grid::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: #514e48;
}

.source {
    display: flex;
    width: 100%;
    min-width: 0;
    flex-direction: column;
    gap: 0;
    padding: 8px;
    overflow: hidden;
    text-align: left;
    color: var(--text);
    background: var(--cards);
    border: 1px solid #403e39;
    border-radius: 11px;
    cursor: pointer;
}

.source:hover {
    background: #302e2a;
    border-color: #656157;
}

.source:focus-visible,
.tab:focus-visible,
.button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
}

.source.selected {
    background: #303a2b;
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
}

.preview {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border: 1px solid #45433e;
    border-radius: 6px;
    background: #1e1d1b;
}

.preview img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.fallback {
    color: #77776e;
    font-size: 38px;
}

.check {
    position: absolute;
    top: 9px;
    right: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    opacity: 0;
}

.source.selected .check {
    opacity: 1;
}

.name {
    display: block;
    width: 100%;
    margin-top: 11px;
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
    line-height: 1.45;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.source.selected .name {
    color: #c5e7b0;
}

.empty {
    grid-column: 1 / -1;
    display: flex;
    min-height: 180px;
    align-items: center;
    justify-content: center;
    padding: 24px;
    border: 1px dashed #514e48;
    border-radius: 10px;
    color: var(--text-muted);
    text-align: center;
}

footer {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 76px;
    padding: 14px 28px;
    border-top: 1px solid var(--border);
    background: var(--sidebar);
}

#status {
    min-width: 0;
    overflow: hidden;
    color: var(--text-muted);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.actions {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 10px;
}

.button {
    display: inline-flex;
    min-width: 94px;
    height: 38px;
    align-items: center;
    justify-content: center;
    padding: 0 17px;
    border: 1px solid #49463f;
    border-radius: 7px;
    background: #302e2b;
    color: var(--text);
    font-size: 13px;
    cursor: pointer;
}

.button:hover:not(:disabled) {
    background: #3b3934;
    border-color: #625e54;
}

.button.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
}

.button.primary:hover:not(:disabled) {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
}

.button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

@media (max-width: 780px) {
    header {
        padding: 20px;
    }

    main {
        padding: 16px 20px 20px;
    }

    .grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
    }

    footer {
        padding: 12px 20px;
    }
}
`;