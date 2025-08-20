/**
 * 图片预加载工具类
 * @description 用于预加载图片，提升用户体验
 * @author diaochan
 */

class ImagePreloader {
  constructor() {
    this.cache = new Map()
    this.loadingQueue = new Map()
    this.maxConcurrent = 3 // 最大并发加载数
    this.retryCount = 2 // 重试次数
  }

  /**
   * 预加载单张图片
   * @param {string} url - 图片URL
   * @param {Object} options - 配置选项
   * @returns {Promise<HTMLImageElement>}
   */
  preloadImage(url, options = {}) {
    const {
      retry = this.retryCount,
      timeout = 10000
    } = options

    // 如果已经缓存，直接返回
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url))
    }

    // 如果正在加载，返回现有的Promise
    if (this.loadingQueue.has(url)) {
      return this.loadingQueue.get(url)
    }

    const loadPromise = this._loadImage(url, retry, timeout)
    this.loadingQueue.set(url, loadPromise)

    // 加载完成后缓存结果
    loadPromise.then(image => {
      this.cache.set(url, image)
      this.loadingQueue.delete(url)
    }).catch(() => {
      this.loadingQueue.delete(url)
    })

    return loadPromise
  }

  /**
   * 批量预加载图片
   * @param {Array} urls - 图片URL数组
   * @param {Object} options - 配置选项
   * @returns {Promise<Array>}
   */
  async preloadImages(urls, options = {}) {
    const {
      priority = 'normal',
      onProgress,
      maxConcurrent = this.maxConcurrent
    } = options

    if (!Array.isArray(urls) || urls.length === 0) {
      return []
    }

    // 去重
    const uniqueUrls = [...new Set(urls)]
    const results = []
    let completed = 0

    // 按优先级分组
    const highPriority = uniqueUrls.filter(url => 
      url.includes('bgUrl') || url.includes('background')
    )
    const normalPriority = uniqueUrls.filter(url => 
      !highPriority.includes(url)
    )

    // 先加载高优先级图片
    const priorityUrls = [...highPriority, ...normalPriority]

    // 分批加载
    for (let i = 0; i < priorityUrls.length; i += maxConcurrent) {
      const batch = priorityUrls.slice(i, i + maxConcurrent)
      const batchPromises = batch.map(url => 
        this.preloadImage(url, { ...options, priority })
      )

      try {
        const batchResults = await Promise.allSettled(batchPromises)
        
        batchResults.forEach((result, index) => {
          const url = batch[index]
          if (result.status === 'fulfilled') {
            results.push({ url, success: true, image: result.value })
          } else {
            results.push({ url, success: false, error: result.reason })
          }
          completed++
          
          // 进度回调
          if (onProgress) {
            onProgress({
              completed,
              total: priorityUrls.length,
              progress: Math.round((completed / priorityUrls.length) * 100),
              current: url
            })
          }
        })
      } catch (error) {
        console.warn('批量预加载失败:', error)
      }
    }

    return results
  }

  /**
   * 内部图片加载方法
   * @private
   */
  _loadImage(url, retryCount, timeout) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      // 设置超时
      const timeoutId = setTimeout(() => {
        img.src = ''
        reject(new Error(`图片加载超时: ${url}`))
      }, timeout)

      img.onload = () => {
        clearTimeout(timeoutId)
        resolve(img)
      }

      img.onerror = () => {
        clearTimeout(timeoutId)
        
        if (retryCount > 0) {
          // 重试
          setTimeout(() => {
            this._loadImage(url, retryCount - 1, timeout)
              .then(resolve)
              .catch(reject)
          }, 1000)
        } else {
          reject(new Error(`图片加载失败: ${url}`))
        }
      }

      // 开始加载
      img.src = url
    })
  }

  /**
   * 预加载关键图片（首屏）
   * @param {Array} urls - 关键图片URL数组
   */
  preloadCriticalImages(urls) {
    if (!Array.isArray(urls) || urls.length === 0) return

    console.log(`预加载 ${urls.length} 张关键图片...`)
    this.preloadImages(urls, {
      priority: 'high',
      maxConcurrent: 2 // 关键图片限制并发数
    })
  }

  /**
   * 清理缓存
   * @param {number} maxAge - 最大缓存时间（毫秒）
   */
  clearCache(maxAge = 5 * 60 * 1000) { // 默认5分钟
    const now = Date.now()
    for (const [url, image] of this.cache) {
      if (now - image.timestamp > maxAge) {
        this.cache.delete(url)
      }
    }
  }

  /**
   * 获取缓存状态
   */
  getCacheStatus() {
    return {
      cached: this.cache.size,
      loading: this.loadingQueue.size,
      total: this.cache.size + this.loadingQueue.size
    }
  }

  /**
   * 检查图片是否已缓存
   * @param {string} url - 图片URL
   */
  isCached(url) {
    return this.cache.has(url)
  }

  /**
   * 检查图片是否正在加载
   * @param {string} url - 图片URL
   */
  isLoading(url) {
    return this.loadingQueue.has(url)
  }
}

// 创建单例实例
const imagePreloader = new ImagePreloader()

export default imagePreloader

// 导出便捷方法
export const preloadImages = (urls, options) => imagePreloader.preloadImages(urls, options)
export const preloadImage = (url, options) => imagePreloader.preloadImage(url, options)
export const preloadCriticalImages = (urls) => imagePreloader.preloadCriticalImages(urls)
