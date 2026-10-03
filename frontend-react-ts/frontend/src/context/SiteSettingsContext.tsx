import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSiteSettings } from '../services/siteSettingsService';
import type { SiteSettings } from '../types/siteSettings.types';

interface SiteSettingsContextValue {
    settings: SiteSettings | null;
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);

function updateDocumentMetadata(settings: SiteSettings | null): void {
    if (!settings) return;

    document.title = settings.tagline ? `${settings.siteName} — ${settings.tagline}` : settings.siteName;

    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description && settings.tagline) description.content = settings.tagline;

    const favicon = document.querySelector<HTMLLinkElement>('#site-favicon');
    if (favicon) {
        if (settings.faviconUrl) {
            favicon.href = settings.faviconUrl;
            favicon.type = 'image/*';
        } else {
            favicon.href = '/favicon.svg';
            favicon.type = 'image/svg+xml';
        }
    }
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            setSettings(await getSiteSettings());
            setError(null);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Unable to load site settings.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    useEffect(() => {
        updateDocumentMetadata(settings);
    }, [settings]);

    return (
        <SiteSettingsContext.Provider value={{ settings, isLoading, error, refresh }}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings(): SiteSettingsContextValue {
    const context = useContext(SiteSettingsContext);
    if (!context) throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
    return context;
}
