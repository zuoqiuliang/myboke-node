/**
 * 图片处理工具函数
 */

/**
 * 将 QQ 空间图片链接转换为代理链接
 * @param {string} url - 原始图片链接
 * @returns {string} - 代理后的图片链接
 */
exports.proxyImageUrl = (url) => {
  // 检查是否是 QQ 空间图片（m.qpic.cn 域名）
  if (url && url.includes('m.qpic.cn')) {
    // 转换为代理链接
    return `/api/proxy/image?url=${encodeURIComponent(url)}`;
  }
  // 非 QQ 空间图片直接返回原链接
  return url;
};

/**
 * 处理 HTML 内容中的图片链接
 * @param {string} htmlContent - 原始 HTML 内容
 * @returns {string} - 处理后的 HTML 内容
 */
exports.processHtmlImages = (htmlContent) => {
  if (!htmlContent) return htmlContent;
  
  // 替换 HTML 中的图片链接
  return htmlContent.replace(/<img[^>]+src="([^"]+)"/g, (match, src) => {
    const proxyUrl = exports.proxyImageUrl(src);
    return match.replace(src, proxyUrl);
  });
};