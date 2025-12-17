// Settings Cache Service
class SettingsCacheService {
  private cache = new Map<string, any>();

  set(key: string, value: unknown) {
    this.cache.set(key, value);

  }

  get(key: string) {
    return this.cache.get(key);

  }

  invalidate(key?: string) {
    if (key) {
      this.cache.delete(key);

    } else {
      this.cache.clear();

    } }

const settingsCacheService = new SettingsCacheService();

export const invalidateSettingsCache = (key?: string) => {
  settingsCacheService.invalidate(key);};

export default settingsCacheService;
