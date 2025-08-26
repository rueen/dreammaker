/**
 * Face-API.js 模型加载器
 * @description 用于预加载和缓存face-api.js模型，提升用户体验
 * @author diaochan
 */

import * as faceapi from 'face-api.js'

class FaceApiLoader {
  constructor() {
    this.modelsLoaded = false
    this.loadingPromise = null
    this.modelCache = new Map()
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? '/dreammaker/models' 
      : '/models'
  }

  /**
   * 预加载模型 - 支持多种模型类型
   * @param {Array} modelTypes - 要加载的模型类型 ['tinyFaceDetector', 'faceLandmark68Net', 'faceRecognitionNet']
   * @returns {Promise}
   */
  async preloadModels(modelTypes = ['tinyFaceDetector']) {
    // 如果已经在加载中，返回现有的Promise
    if (this.loadingPromise) {
      return this.loadingPromise
    }

    // 如果已经加载完成，直接返回
    if (this.modelsLoaded) {
      return Promise.resolve()
    }

    this.loadingPromise = this._loadModels(modelTypes)
    return this.loadingPromise
  }

  /**
   * 内部模型加载方法
   * @private
   */
  async _loadModels(modelTypes) {
    const loadTasks = []
    
    for (const modelType of modelTypes) {
      switch (modelType) {
        case 'tinyFaceDetector':
          loadTasks.push(this._loadTinyFaceDetector())
          break
        case 'faceLandmark68Net':
          loadTasks.push(this._loadFaceLandmark68Net())
          break
        case 'faceRecognitionNet':
          loadTasks.push(this._loadFaceRecognitionNet())
          break
        case 'faceExpressionNet':
          loadTasks.push(this._loadFaceExpressionNet())
          break
        default:
          console.warn(`未知的模型类型: ${modelType}`)
      }
    }

    try {
      // 并行加载所有模型
      await Promise.all(loadTasks)
      this.modelsLoaded = true
      console.log('Face-API.js 模型加载完成')
      return true
    } catch (error) {
      console.error('模型加载失败:', error)
      this.modelsLoaded = false
      this.loadingPromise = null
      throw error
    }
  }

  /**
   * 加载 Tiny Face Detector 模型
   * @private
   */
  async _loadTinyFaceDetector() {
    if (this.modelCache.has('tinyFaceDetector')) {
      return this.modelCache.get('tinyFaceDetector')
    }

    try {
      // 先尝试从本地加载
      await this._loadFromLocal()
      this.modelCache.set('tinyFaceDetector', true)
    } catch (localError) {
      console.warn('本地模型加载失败，尝试CDN:', localError.message)
      // 本地加载失败，使用CDN
      await this._loadFromCDN()
      this.modelCache.set('tinyFaceDetector', true)
    }
  }

  /**
   * 加载 Face Landmark 68 Net 模型
   * @private
   */
  async _loadFaceLandmark68Net() {
    if (this.modelCache.has('faceLandmark68Net')) {
      return this.modelCache.get('faceLandmark68Net')
    }

    try {
      await faceapi.nets.faceLandmark68Net.loadFromUri(this.baseUrl)
      this.modelCache.set('faceLandmark68Net', true)
    } catch (error) {
      // 如果本地失败，尝试CDN
      await faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model')
      this.modelCache.set('faceLandmark68Net', true)
    }
  }

  /**
   * 加载 Face Recognition Net 模型
   * @private
   */
  async _loadFaceRecognitionNet() {
    if (this.modelCache.has('faceRecognitionNet')) {
      return this.modelCache.get('faceRecognitionNet')
    }

    try {
      await faceapi.nets.faceRecognitionNet.loadFromUri(this.baseUrl)
      this.modelCache.set('faceRecognitionNet', true)
    } catch (error) {
      // 如果本地失败，尝试CDN
      await faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model')
      this.modelCache.set('faceRecognitionNet', true)
    }
  }

  /**
   * 加载 Face Expression Net 模型
   * @private
   */
  async _loadFaceExpressionNet() {
    if (this.modelCache.has('faceExpressionNet')) {
      return this.modelCache.get('faceExpressionNet')
    }

    try {
      await faceapi.nets.faceExpressionNet.loadFromUri(this.baseUrl)
      this.modelCache.set('faceExpressionNet', true)
    } catch (error) {
      // 如果本地失败，尝试CDN
      await faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model')
      this.modelCache.set('faceExpressionNet', true)
    }
  }

  /**
   * 从本地加载模型
   * @private
   */
  async _loadFromLocal() {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('本地模型加载超时')), 5000)
    )

    const loadPromise = faceapi.nets.tinyFaceDetector.loadFromUri(this.baseUrl)
    
    await Promise.race([loadPromise, timeout])
  }

  /**
   * 从CDN加载模型
   * @private
   */
  async _loadFromCDN() {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('CDN模型加载超时')), 8000)
    )

    const loadPromise = faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model')
    
    await Promise.race([loadPromise, timeout])
  }

  /**
   * 检查模型是否已加载
   * @returns {boolean}
   */
  isModelsLoaded() {
    return this.modelsLoaded
  }

  /**
   * 获取加载进度（模拟）
   * @returns {number} 0-100 的进度值
   */
  getLoadingProgress() {
    if (this.modelsLoaded) return 100
    if (!this.loadingPromise) return 0
    
    // 简单的进度模拟，实际项目中可以基于真实的加载状态
    return Math.min(90, Date.now() % 90)
  }

  /**
   * 预热模型 - 进行一次空的推理以初始化GPU内存
   * @param {HTMLVideoElement} video - 用于预热的视频元素
   */
  async warmupModels(video) {
    if (!this.modelsLoaded || !video) return

    try {
      // 进行一次空的检测以预热模型
      await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,
        scoreThreshold: 0.3
      }))
    } catch (error) {
      console.warn('模型预热失败:', error)
    }
  }

  /**
   * 重置加载状态 - 用于重新加载
   */
  reset() {
    this.modelsLoaded = false
    this.loadingPromise = null
    this.modelCache.clear()
  }
}

// 创建单例实例
const faceApiLoader = new FaceApiLoader()

export default faceApiLoader
