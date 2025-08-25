<!--
 * @Author: diaochan
 * @Date: 2025-08-25 20:30:00
 * @LastEditors: diaochan
 * @LastEditTime: 2025-08-25 20:30:00
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
      <!-- 标题 -->
      <div class="gallery-header">
        <h1>图片集合</h1>
        <p class="image-count">共 {{ images.length }} 张图片</p>
      </div>
      
      <!-- 操作工具栏 -->
      <div class="gallery-toolbar">
        <button @click="viewMode = 'grid'" :class="{ active: viewMode === 'grid' }">
          网格视图
        </button>
        <button @click="viewMode = 'list'" :class="{ active: viewMode === 'list' }">
          列表视图
        </button>
        <button @click="downloadAll" class="download-all-btn">
          下载全部
        </button>
      </div>
      
      <!-- 图片网格视图 -->
      <div v-if="viewMode === 'grid'" class="image-grid">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="image-item"
          @click="openLightbox(index)"
        >
          <div class="image-wrapper">
            <img 
              :src="image.url"
              :alt="image.alt || `图片 ${index + 1}`"
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
          <div class="image-info">
            <p class="image-title">图片 {{ index + 1 }}</p>
            <button @click.stop="downloadImage(image.url, index)" class="download-btn">
              下载
            </button>
          </div>
        </div>
      </div>
      
      <!-- 图片列表视图 -->
      <div v-else class="image-list">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="list-item"
          @click="openLightbox(index)"
        >
          <div class="list-image">
            <img 
              :src="image.url"
              :alt="image.alt || `图片 ${index + 1}`"
              @load="handleImageLoad(index)"
              @error="handleImageError(index)"
              :class="{ loaded: image.loaded, error: image.error }"
            />
          </div>
          <div class="list-info">
            <h3>图片 {{ index + 1 }}</h3>
            <p class="image-url">{{ image.url }}</p>
            <button @click.stop="downloadImage(image.url, index)" class="download-btn">
              下载图片
            </button>
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
    
    <!-- 图片预览弹窗 -->
    <div v-if="lightboxVisible" class="lightbox" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <button class="close-btn" @click="closeLightbox">×</button>
        <button v-if="currentImageIndex > 0" class="nav-btn prev-btn" @click="prevImage">‹</button>
        <button v-if="currentImageIndex < images.length - 1" class="nav-btn next-btn" @click="nextImage">›</button>
        
        <div class="lightbox-image">
          <img 
            :src="images[currentImageIndex]?.url"
            :alt="images[currentImageIndex]?.alt || `图片 ${currentImageIndex + 1}`"
          />
        </div>
        
        <div class="lightbox-info">
          <h3>图片 {{ currentImageIndex + 1 }} / {{ images.length }}</h3>
          <button @click="downloadImage(images[currentImageIndex]?.url, currentImageIndex)">
            下载此图片
          </button>
        </div>
      </div>
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
      images: [],
      viewMode: 'grid', // 'grid' 或 'list'
      lightboxVisible: false,
      currentImageIndex: 0
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
        
        // 获取URL参数
        const urlParams = new URLSearchParams(window.location.search);
        const imagesParam = urlParams.get('images');
        
        if (!imagesParam) {
          throw new Error('URL参数中未找到images参数');
        }
        
        // 解析图片地址
        const imageUrls = imagesParam.split(',').map(url => decodeURIComponent(url.trim())).filter(url => url);
        
        if (imageUrls.length === 0) {
          throw new Error('未找到有效的图片地址');
        }
        
        // 初始化图片对象
        this.images = imageUrls.map((url, index) => ({
          url,
          alt: `图片 ${index + 1}`,
          loaded: false,
          error: false
        }));
        
        this.loading = false;
      } catch (err) {
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
    
    // 打开图片预览
    openLightbox(index) {
      this.currentImageIndex = index;
      this.lightboxVisible = true;
      document.body.style.overflow = 'hidden';
    },
    
    // 关闭图片预览
    closeLightbox() {
      this.lightboxVisible = false;
      document.body.style.overflow = '';
    },
    
    // 上一张图片
    prevImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
    },
    
    // 下一张图片
    nextImage() {
      if (this.currentImageIndex < this.images.length - 1) {
        this.currentImageIndex++;
      }
    },
    
    // 下载单张图片
    downloadImage(url, index) {
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = `image_${index + 1}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        alert('下载失败，请手动保存图片');
      }
    },
    
    // 下载所有图片
    async downloadAll() {
      for (let i = 0; i < this.images.length; i++) {
        await new Promise(resolve => {
          setTimeout(() => {
            this.downloadImage(this.images[i].url, i);
            resolve();
          }, 500); // 间隔500ms避免浏览器限制
        });
      }
    }
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

.gallery-header {
  text-align: center;
  margin-bottom: 30px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.gallery-header h1 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 2.5em;
}

.image-count {
  color: #666;
  font-size: 1.1em;
  margin: 0;
}

/* 工具栏 */
.gallery-toolbar {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.gallery-toolbar button {
  padding: 10px 20px;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.gallery-toolbar button.active,
.gallery-toolbar button:hover {
  background: #007bff;
  color: white;
}

.download-all-btn {
  background: #28a745 !important;
  border-color: #28a745 !important;
  color: white !important;
}

.download-all-btn:hover {
  background: #1e7e34 !important;
  border-color: #1e7e34 !important;
}

/* 网格视图 */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.image-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.image-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.image-wrapper img.loaded {
  opacity: 1;
}

.image-wrapper img.error {
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

.image-info {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-title {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.download-btn {
  background: #17a2b8;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.download-btn:hover {
  background: #117a8b;
}

/* 列表视图 */
.image-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.list-item {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.list-item:hover {
  transform: translateX(5px);
}

.list-image {
  width: 150px;
  height: 100px;
  flex-shrink: 0;
}

.list-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.list-info h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.image-url {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 12px;
  word-break: break-all;
  line-height: 1.4;
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
