import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings } from '@/features/settings/settingsSlice';

/**
 * useSettings()
 *
 * Returns the global site settings from Redux.
 * Automatically fetches from the API if not already loaded.
 *
 * Usage:
 *   const { settings, loading } = useSettings()
 *   settings.general.siteName
 *   settings.social.github
 *   settings.homepage.heroTitle
 */
export function useSettings() {
  const dispatch = useDispatch();
  const { settings, loading, error } = useSelector((state) => state.settings);

  useEffect(() => {
    if (!settings && !loading) {
      dispatch(fetchSettings());
    }
  }, [dispatch, settings, loading]);

  return {
    settings,
    loading,
    error,
    // Flat convenience accessors with safe fallbacks
    general:  settings?.general  || {},
    seo:      settings?.seo      || {},
    social:   settings?.social   || {},
    contact:  settings?.contact  || {},
    homepage: settings?.homepage || {},
    theme:    settings?.theme    || {},
  };
}
