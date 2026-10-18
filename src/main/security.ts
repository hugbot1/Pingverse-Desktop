import { SITE_ORIGIN } from './config';

export function isTrustedURL(value: string | undefined | null): boolean {
    if (!value) return false;

    try {
        return new URL(value).origin === SITE_ORIGIN;
    } catch {
        return false;
    }
}