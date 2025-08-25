<!--
 * @Author: diaochan
 * @Date: 2025-08-25 20:30:00
 * @LastEditors: diaochan
 * @LastEditTime: 2025-08-26 00:31:52
 * @Description: 图片集合页面 - 用于二维码扫描后展示多张图片
-->
<template>
  <div class="gallery-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>正在加载图片...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <div class="error-icon">⚠️</div>
      <h2>加载失败</h2>
      <p>{{ error }}</p>
      <button @click="retry" class="retry-btn">重新加载</button>
    </div>
    
    <!-- 图片展示 -->
    <div v-else-if="images.length > 0" class="gallery-content">
      
      <!-- 图片网格 -->
      <div class="image-grid">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="image-item"
        >
          <img 
            :src="image.url"
            :alt="`图片 ${index + 1}`"
            @load="handleImageLoad(index)"
            @error="handleImageError(index)"
            :class="{ loaded: image.loaded, error: image.error }"
          />
          <div v-if="!image.loaded && !image.error" class="image-loading">
            <div class="image-spinner"></div>
          </div>
          <div v-if="image.error" class="image-error">
            <span>❌</span>
            <p>加载失败</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">🖼️</div>
      <h2>暂无图片</h2>
      <p>URL参数中没有找到有效的图片地址</p>
    </div>
    

  </div>
</template>

<script>
export default {
  name: 'GalleryView',
  data() {
    return {
      loading: true,
      error: null,
      images: []
    };
  },
  mounted() {
    this.loadImages();
  },
  methods: {
    // 从URL参数加载图片列表
    loadImages() {
      try {
        this.loading = true;
        this.error = null;
        
        // 获取URL参数 - 兼容Hash路由模式
        let imagesParam = null;
        
        // 方法1: 从hash中获取参数 (#/gallery?images=...)
        const hash = window.location.hash;
        if (hash.includes('?')) {
          const queryString = hash.split('?')[1];
          const urlParams = new URLSearchParams(queryString);
          imagesParam = urlParams.get('images');
        }
        
        // 方法2: 如果hash中没有，从search中获取 (?images=...)
        if (!imagesParam) {
          const urlParams = new URLSearchParams(window.location.search);
          imagesParam = urlParams.get('images');
        }
        
        // 方法3: 从sessionStorage中获取（解决长URL问题）
        if (!imagesParam) {
          const sessionKey = new URLSearchParams(window.location.search).get('session') || 
                            (hash.includes('?') ? new URLSearchParams(hash.split('?')[1]).get('session') : null);
          if (sessionKey) {
            const sessionData = sessionStorage.getItem(`gallery_images_${sessionKey}`);
            if (sessionData) {
              try {
                const parsedData = JSON.parse(sessionData);
                imagesParam = parsedData.images;
                console.log('从sessionStorage获取图片数据:', parsedData.count, '张图片');
              } catch (e) {
                console.warn('SessionStorage数据解析失败:', e);
              }
            }
          }
        }
        
        if (!imagesParam) {
          throw new Error('URL参数中未找到images参数');
        }
        
        console.log('成功获取images参数:', imagesParam);
        
        // 解析图片地址
        const imageUrls = imagesParam.split(',').map(url => decodeURIComponent(url.trim())).filter(url => url);
        
        if (imageUrls.length === 0) {
          throw new Error('未找到有效的图片地址');
        }
        
        console.log('成功解析图片URL:', imageUrls.length, '张图片');
        
        // 初始化图片对象
        this.images = imageUrls.map((url, index) => ({
          url,
          alt: `图片 ${index + 1}`,
          loaded: false,
          error: false
        }));
        
        // 如果图片数量达到限制，显示提示信息
        if (imageUrls.length >= 10) {
          console.log('注意：图片数量较多，只显示前10张图片');
        }
        
        this.loading = false;
      } catch (err) {
        console.error('图片加载失败:', err);
        this.error = err.message;
        this.loading = false;
      }
    },
    
    // 重试加载
    retry() {
      this.loadImages();
    },
    
    // 图片加载成功
    handleImageLoad(index) {
      if (this.images[index]) {
        this.images[index].loaded = true;
      }
    },
    
    // 图片加载失败
    handleImageError(index) {
      if (this.images[index]) {
        this.images[index].error = true;
      }
    },
    

  }
};
</script>

<style scoped>
.gallery-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 加载状态 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error {
  text-align: center;
  padding: 50px 20px;
  color: #d9534f;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.retry-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.retry-btn:hover {
  background: #0056b3;
}

/* 图片集合内容 */
.gallery-content {
  max-width: 1200px;
  margin: 0 auto;
}

.image-count {
  color: #666;
  font-size: 1.1em;
  margin: 0;
}



/* 图片网格 */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.image-item {
  position: relative;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-item img {
  width: 100%;
  height: auto;
  display: block;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.image-item img.loaded {
  opacity: 1;
}

.image-item img.error {
  display: none;
}

.image-loading,
.image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  min-height: 200px;
}

.image-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.image-error span {
  font-size: 24px;
  margin-bottom: 10px;
}



/* 空状态 */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  color: #666;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

/* 灯箱效果 */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001;
}

.prev-btn {
  left: 15px;
}

.next-btn {
  right: 15px;
}

.lightbox-image {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.lightbox-image img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.lightbox-info {
  padding: 20px;
  text-align: center;
  background: #f8f9fa;
}

.lightbox-info h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.lightbox-info button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.lightbox-info button:hover {
  background: #0056b3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gallery-container {
    padding: 15px;
  }
  
  .image-grid {
    grid-template-columns: 1fr;
  }
  
  .list-item {
    flex-direction: column;
  }
  
  .list-image {
    width: 100%;
    height: 200px;
  }
  
  .gallery-toolbar {
    flex-direction: column;
    align-items: center;
  }
  
  .gallery-header h1 {
    font-size: 2em;
  }
}

@media (max-width: 480px) {
  .gallery-container {
    padding: 10px;
  }
  
  .gallery-header {
    padding: 20px 15px;
  }
  
  .lightbox-content {
    max-width: 95vw;
    max-height: 95vh;
  }
}
</style>
