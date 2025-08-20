/**
 * 视频预加载工具类
 * @description 用于预加载视频文件，提升用户体验
 * @author diaochan
 */

class VideoPreloader {
  constructor() {
    this.cache = new Map()
    this.loadingQueue = new Map()
    this.maxConcurrent = 2 // 最大并发加载数（视频文件较大，限制并发）
    this.retryCount = 1 // 重试次数
  }

  /**
   * 预加载单个视频
   * @param {string} url - 视频URL
   * @param {Object} options - 配置选项
   * @returns {Promise<HTMLVideoElement>}
   */
  preloadVideo(url, options = {}) {
    const {
      retry = this.retryCount,
      timeout = 30000, // 视频加载超时时间更长
      preload = 'metadata' // 预加载策略：metadata, auto, none
    } = options

    // 如果已经缓存，直接返回
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url))
    }

    // 如果正在加载，返回现有的Promise
    if (this.loadingQueue.has(url)) {
      return this.loadingQueue.get(url)
    }

    const loadPromise = this._loadVideo(url, retry, timeout, preload)
    this.loadingQueue.set(url, loadPromise)

    // 加载完成后缓存结果
    loadPromise.then(video => {
      this.cache.set(url, video)
      this.loadingQueue.delete(url)
    }).catch(() => {
      this.loadingQueue.delete(url)
    })

    return loadPromise
  }

  /**
   * 批量预加载视频
   * @param {Array} urls - 视频URL数组
   * @param {Object} options - 配置选项
   * @returns {Promise<Array>}
   */
  async preloadVideos(urls, options = {}) {
    const {
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

    // 分批加载
    for (let i = 0; i < uniqueUrls.length; i += maxConcurrent) {
      const batch = uniqueUrls.slice(i, i + maxConcurrent)
      const batchPromises = batch.map(url => 
        this.preloadVideo(url, options)
      )

      try {
        const batchResults = await Promise.allSettled(batchPromises)
        
        batchResults.forEach((result, index) => {
          const url = batch[index]
          if (result.status === 'fulfilled') {
            results.push({ url, success: true, video: result.value })
          } else {
            results.push({ url, success: false, error: result.reason })
          }
          completed++
          
          // 进度回调
          if (onProgress) {
            onProgress({
              completed,
              total: uniqueUrls.length,
              progress: Math.round((completed / uniqueUrls.length) * 100),
              current: url
            })
          }
        })
      } catch (error) {
        console.warn('批量预加载视频失败:', error)
      }
    }

    return results
  }

  /**
   * 预加载关键视频（首屏）
   * @param {Array} urls - 关键视频URL数组
   */
  preloadCriticalVideos(urls) {
    if (!Array.isArray(urls) || urls.length === 0) return

    console.log(`预加载 ${urls.length} 个关键视频...`)
    this.preloadVideos(urls, {
      priority: 'high',
      maxConcurrent: 1 // 关键视频限制并发数为1
    })
  }

  /**
   * 内部视频加载方法
   * @private
   */
  _loadVideo(url, retryCount, timeout, preload) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      
      // 设置视频属性
      video.preload = preload
      video.muted = true // 静音预加载，避免自动播放问题
      video.playsInline = true
      
      // 设置超时
      const timeoutId = setTimeout(() => {
        video.src = ''
        reject(new Error(`视频加载超时: ${url}`))
      }, timeout)

      // 监听加载事件
      const handleCanPlay = () => {
        clearTimeout(timeoutId)
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
        resolve(video)
      }

      const handleError = () => {
        clearTimeout(timeoutId)
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
        
        if (retryCount > 0) {
          // 重试
          setTimeout(() => {
            this._loadVideo(url, retryCount - 1, timeout, preload)
              .then(resolve)
              .catch(reject)
          }, 1000)
        } else {
          reject(new Error(`视频加载失败: ${url}`))
        }
      }

      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('error', handleError)
      
      // 开始加载
      video.src = url
    })
  }

  /**
   * 清理缓存
   * @param {number} maxAge - 最大缓存时间（毫秒）
   */
  clearCache(maxAge = 10 * 60 * 1000) { // 默认10分钟（视频缓存时间更长）
    const now = Date.now()
    for (const [url, video] of this.cache) {
      if (now - video.timestamp > maxAge) {
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
   * 检查视频是否已缓存
   * @param {string} url - 视频URL
   */
  isCached(url) {
    return this.cache.has(url)
  }

  /**
   * 检查视频是否正在加载
   * @param {string} url - 视频URL
   */
  isLoading(url) {
    return this.loadingQueue.has(url)
  }

  /**
   * 预加载混合资源（图片+视频）
   * @param {Object} resources - 资源对象
   */
  preloadMixedResources(resources) {
    const { images = [], videos = [] } = resources
    
    // 同时预加载图片和视频
    if (images.length > 0) {
      import('@/utils/imagePreloader').then(({ preloadCriticalImages }) => {
        preloadCriticalImages(images)
      })
    }
    
    if (videos.length > 0) {
      this.preloadCriticalVideos(videos)
    }
  }
}

// 创建单例实例
const videoPreloader = new VideoPreloader()

export default videoPreloader

// 导出便捷方法
export const preloadVideos = (urls, options) => videoPreloader.preloadVideos(urls, options)
export const preloadVideo = (url, options) => videoPreloader.preloadVideo(url, options)
export const preloadCriticalVideos = (urls) => videoPreloader.preloadCriticalVideos(urls)
export const preloadMixedResources = (resources) => videoPreloader.preloadMixedResources(resources)
