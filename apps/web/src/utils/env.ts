export const isProd = import.meta.env.PROD;

export const serverOriginUrl = isProd
  ? window.__WEWE_RSS_SERVER_ORIGIN_URL__
  : import.meta.env.VITE_SERVER_ORIGIN_URL;

export const appVersion = __APP_VERSION__;

export const enabledAuthCode =
  window.__WEWE_RSS_ENABLED_AUTH_CODE__ === false ? false : true;

// 默认搜索关键词配置
export const defaultKeywords = (() => {
  try {
    return JSON.parse(import.meta.env.VITE_DEFAULT_KEYWORDS || '[]');
  } catch (e) {
    console.warn('解析默认关键词配置失败:', e);
    return [];
  }
})();

export const defaultSearchMode = import.meta.env.VITE_DEFAULT_SEARCH_MODE || 'AND';
