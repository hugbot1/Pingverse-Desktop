import { app } from 'electron';
import * as path from 'node:path';

export const SITE = '';
export const SITE_ORIGIN = new URL(SITE).origin;
export const APP_ID = 'ping.pingverse.desktop';

export const ICON_PATH = path.join(app.getAppPath(), 'assets', 'icon.ico');
export const PRELOAD_PATH = path.join(__dirname, '..', 'preload', 'index.js');

export const START_HIDDEN = process.argv.includes('--hidden');