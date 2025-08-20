/**
 * Service Worker for Face-API.js model caching
 * @description 缓存Face-API.js模型文件，提升加载速度
 */

const CACHE_NAME = 'faceapi-models-v1';
const MODEL_CACHE_NAME = 'faceapi-models-cache-v1';

// 需要缓存的文件
const STATIC_CACHE_URLS = [
  '/dreammaker/models/tiny_face_detector_model-weights_manifest.json',
  '/dreammaker/models/tiny_face_detector_model.bin'
];

// CDN模型文件（作为备用）
const CDN_MODEL_URLS = [
  'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/tiny_face_detector_model-weights_manifest.json',
  'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/tiny_face_detector_model.bin'
];

/**
 * Service Worker 安装事件
 */
self.addEventListener('install', event => {
  console.log('Face-API Service Worker 安装中...');
  
  event.waitUntil(
    Promise.all([
      // 缓存静态资源
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(STATIC_CACHE_URLS).catch(error => {
          console.warn('静态资源缓存失败:', error);
        });
      }),
      // 预缓存CDN模型（可选）
      caches.open(MODEL_CACHE_NAME).then(cache => {
        return Promise.allSettled(
          CDN_MODEL_URLS.map(url => 
            fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response.clone());
              }
            }).catch(error => {
              console.warn(`CDN模型缓存失败 ${url}:`, error);
            })
          )
        );
      })
    ]).then(() => {
      console.log('Face-API Service Worker 安装完成');
      // 强制激活新的 Service Worker
      return self.skipWaiting();
    })
  );
});

/**
 * Service Worker 激活事件
 */
self.addEventListener('activate', event => {
  console.log('Face-API Service Worker 激活中...');
  
  event.waitUntil(
    // 清理旧缓存
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== MODEL_CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Face-API Service Worker 激活完成');
      // 立即控制所有客户端
      return self.clients.claim();
    })
  );
});

/**
 * 网络请求拦截
 */
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // 只处理模型相关的请求
  if (isModelRequest(url)) {
    event.respondWith(handleModelRequest(event.request));
  }
});

/**
 * 判断是否为模型请求
 * @param {string} url 
 * @returns {boolean}
 */
function isModelRequest(url) {
  return url.includes('/models/') || 
         url.includes('face-api') && url.includes('model') ||
         url.includes('tiny_face_detector');
}

/**
 * 处理模型请求 - 缓存优先策略
 * @param {Request} request 
 * @returns {Promise<Response>}
 */
async function handleModelRequest(request) {
  try {
    // 1. 先尝试从缓存获取
    const cachedResponse = await getCachedResponse(request);
    if (cachedResponse) {
      console.log('从缓存获取模型:', request.url);
      return cachedResponse;
    }

    // 2. 缓存未命中，从网络获取
    console.log('从网络获取模型:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 3. 缓存网络响应
      await cacheResponse(request, networkResponse.clone());
      return networkResponse;
    } else {
      throw new Error(`网络请求失败: ${networkResponse.status}`);
    }
    
  } catch (error) {
    console.error('模型请求失败:', error);
    
    // 4. 网络失败时，尝试从备用缓存获取
    const fallbackResponse = await getFallbackResponse(request);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    
    // 5. 返回错误响应
    return new Response('模型加载失败', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

/**
 * 从缓存获取响应
 * @param {Request} request 
 * @returns {Promise<Response|null>}
 */
async function getCachedResponse(request) {
  // 尝试主缓存
  const cache = await caches.open(CACHE_NAME);
  let response = await cache.match(request);
  
  if (!response) {
    // 尝试模型缓存
    const modelCache = await caches.open(MODEL_CACHE_NAME);
    response = await modelCache.match(request);
  }
  
  return response;
}

/**
 * 缓存响应
 * @param {Request} request 
 * @param {Response} response 
 */
async function cacheResponse(request, response) {
  try {
    const cache = await caches.open(MODEL_CACHE_NAME);
    await cache.put(request, response);
    console.log('模型已缓存:', request.url);
  } catch (error) {
    console.warn('缓存失败:', error);
  }
}

/**
 * 获取备用响应
 * @param {Request} request 
 * @returns {Promise<Response|null>}
 */
async function getFallbackResponse(request) {
  // 如果是本地模型请求失败，尝试CDN
  if (request.url.includes('/models/')) {
    const filename = request.url.split('/').pop();
    const cdnUrl = `https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/${filename}`;
    
    try {
      const fallbackResponse = await fetch(cdnUrl);
      if (fallbackResponse.ok) {
        // 缓存CDN响应
        await cacheResponse(request, fallbackResponse.clone());
        return fallbackResponse;
      }
    } catch (error) {
      console.warn('CDN备用请求失败:', error);
    }
  }
  
  return null;
}

/**
 * 消息处理
 */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_MODELS') {
    event.waitUntil(cacheModels());
  }
});

/**
 * 主动缓存模型
 */
async function cacheModels() {
  try {
    const cache = await caches.open(MODEL_CACHE_NAME);
    
    // 缓存本地模型
    for (const url of STATIC_CACHE_URLS) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
          console.log('已缓存本地模型:', url);
        }
      } catch (error) {
        console.warn('本地模型缓存失败:', url, error);
      }
    }
    
    // 缓存CDN模型作为备用
    for (const url of CDN_MODEL_URLS) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
          console.log('已缓存CDN模型:', url);
        }
      } catch (error) {
        console.warn('CDN模型缓存失败:', url, error);
      }
    }
    
  } catch (error) {
    console.error('模型缓存失败:', error);
  }
}
