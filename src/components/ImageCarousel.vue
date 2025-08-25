<!--
 * @Author: diaochan
 * @Date: 2024-12-19 16:30:00
 * @LastEditors: diaochan
 * @LastEditTime: 2025-08-25 20:24:31
 * @Description: 队列式3D图片轮播组件 - 队列推进效果
-->
<template>
  <div class="image-carousel" :style="typeof containerHeight === 'number' ? { height: containerHeight + 'px' } : {}" ref="carouselContainer">
    <!-- 真正的DOM元素位置移动 -->
    <div class="carousel-queue" ref="carouselQueue">
      <div
        v-for="item in carouselItems"
        :key="item.id"
        class="queue-item"
        :class="{ 
          'first': item.position === 0
        }"
        :style="getItemPositionStyle(item)"
        @click="handleItemClick(item)"
      >
        <div class="item-frame">
          <img 
            :src="item.src" 
            alt="" 
            class="item-image"
            @load="handleImageLoad"
            @error="handleImageError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageCarousel',
  props: {
    images: {
      type: Array,
      default: () => [],
      validator: (value) => value.length >= 1
    },
    autoPlayInterval: {
      type: Number,
      default: 4000
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    height: {
      type: [Number, String],
      default: 400
    },
    // 队列中可见的图片数量
    visibleCount: {
      type: Number,
      default: 5
    }
  },
  emits: ['change', 'click'],
  data() {
    return {
      autoPlayTimer: null,
      containerHeight: 400,
      loadedImages: 0,
      // 轮播项目数组 - 每个项目都有自己的DOM元素和位置
      carouselItems: [],
      currentIndex: 0, // 当前第一张图片的索引
      isFastForwarding: false, // 快速推进状态标识
      isAnimating: false // 动画执行状态标识
    }
  },
  computed: {
    totalImages() {
      return this.images.length;
    },
    
    // 实际显示的图片数量（考虑visibleCount和images.length的最小值）
    actualVisibleCount() {
      return Math.min(this.visibleCount, this.images.length);
    },
    
    // 是否有足够的图片进行轮播
    canAutoPlay() {
      return this.autoPlay && this.totalImages > 1 && this.actualVisibleCount > 0;
    }
  },
  mounted() {
    this.init();
    // 添加窗口大小变化监听
    this.addResizeListener();
  },
  beforeUnmount() {
    this.stopAutoPlay();
    this.removeResizeListener();
  },
  watch: {
    images: {
      handler() {
        this.reset();
        this.init();
      },
      deep: true
    },
    autoPlay(newVal) {
      if (newVal) {
        this.startAutoPlay();
      } else {
        this.stopAutoPlay();
      }
    }
  },
  methods: {
    init() {
      if (this.images.length === 0) {
        console.warn('ImageCarousel: No images provided');
        return;
      }
      
      // 检查visibleCount是否合理
      if (this.visibleCount <= 0) {
        console.warn('ImageCarousel: visibleCount must be greater than 0');
        return;
      }
      
      this.calculateContainerHeight();
      this.initCarouselItems();
      
      // 在图片初始化后更新高度
      if (this.height === 'auto') {
        this.$nextTick(() => {
          // 延迟执行，等待图片开始加载
          setTimeout(() => {
            this.updateAutoHeight();
          }, 100);
        });
      }
      
      // 直接开始自动播放
      this.startAutoPlay();
    },
    
    reset() {
      this.stopAutoPlay();
      this.loadedImages = 0;
      this.carouselItems = [];
      this.currentIndex = 0;
      this.isFastForwarding = false;
      this.isAnimating = false;
    },
    
    // 初始化轮播项目
    initCarouselItems() {
      this.carouselItems = [];
      
      for (let i = 0; i < this.actualVisibleCount; i++) {
        this.carouselItems.push({
          id: `item-${Date.now()}-${i}`,
          src: this.images[i % this.totalImages],
          originalIndex: i % this.totalImages,
          position: i, // 在队列中的位置：0=第一张，1=第二张...
          isVisible: true
        });
      }
    },
    
    calculateContainerHeight() {
      if (typeof this.height === 'number') {
        this.containerHeight = this.height;
      } else if (this.height === 'auto') {
        // 自动计算实际需要的高度
        this.updateAutoHeight();
      } else {
        this.containerHeight = parseInt(this.height) || 400;
      }
    },
    
    // 更新自动高度 - 基于实际DOM元素
    async updateAutoHeight() {
      if (this.height !== 'auto') return;
      
      await this.$nextTick(); // 等待DOM更新
      
      // 获取所有queue-item元素
      const queueItems = this.$refs.carouselQueue?.querySelectorAll('.queue-item');
      if (!queueItems || queueItems.length === 0) {
        this.containerHeight = 400;
        return;
      }
      
      // 计算所有元素的最大底部位置
      let maxBottom = 0;
      
      queueItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const containerRect = this.$refs.carouselContainer?.getBoundingClientRect();
        
        if (rect.height > 0 && containerRect) {
          // 计算相对于容器的底部位置
          const relativeBottom = rect.bottom - containerRect.top;
          maxBottom = Math.max(maxBottom, relativeBottom);
        }
      });
      
      // 设置容器高度，添加一些padding
      if (maxBottom > 0) {
        this.containerHeight = Math.max(400, maxBottom + 50);
      } else {
        this.containerHeight = 400;
      }
    },
    
    // 获取每个项目的位置样式 - 使用百分比定位
    getItemPositionStyle(item) {
      if (!item.isVisible) {
        return {
          opacity: 0,
          visibility: 'hidden'
        };
      }
      
      const position = item.position;
      const { leftPercent, topPercent } = this.getPositionPercent(position);
      const { widthPercent } = this.getSizePercent(position);
      const zIndex = this.getZIndex(position);
      
      return {
        left: leftPercent + '%',
        top: topPercent + '%',
        width: widthPercent + '%',
        // 不设置height，让图片自动撑开高度
        zIndex: zIndex,
        opacity: 1
      };
    },
    
    // 计算位置百分比 - 基于左上角定位
    getPositionPercent(position) {
      // 改为左上角定位，不再使用中心点计算
      // 第1张图片：(30%, 30%) 
      // 第2张图片：(20%, 20%)
      // 第3张图片：(10%, 10%)
      // 以此类推...
      
      const baseLeftPercent = 30; // 第一张图片左上角X百分比
      const baseTopPercent = 30; // 第一张图片左上角Y百分比
      const stepPercent = 10; // 每层偏移10%
      
      const leftPercent = Math.max(0, baseLeftPercent - position * stepPercent);
      const topPercent = Math.max(0, baseTopPercent - position * stepPercent);
      
      return { leftPercent, topPercent };
    },
    
    // 计算宽度百分比 - 只计算宽度，高度由图片自动撑开
    getSizePercent(position) {
      // 响应式基准宽度：根据屏幕大小调整
      let baseWidthPercent = 35; // 默认35%
      
      // 小屏幕适配
      if (typeof window !== 'undefined') {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 480) {
          baseWidthPercent = 45; // 小屏幕上增大基准尺寸
        } else if (screenWidth <= 768) {
          baseWidthPercent = 40; // 中等屏幕
        }
      }
      
      const scaleStep = 0.15; // 每层缩小15%
      const scale = Math.max(0.25, 1 - position * scaleStep);
      const finalWidthPercent = baseWidthPercent * scale;
      
      return {
        widthPercent: finalWidthPercent
        // 不再计算heightPercent，让图片自动撑开高度
      };
    },
    
    // 计算Z-index
    getZIndex(position) {
      return 100 - position;
    },
    
    // 队列推进动画 - 流畅无卡顿的动画效果
    async pushQueue() {
      if (this.carouselItems.length === 0 || this.totalImages === 0) return;
      
      // 如果正在执行动画，等待完成
      if (this.isAnimating) {
        await new Promise(resolve => {
          const checkAnimation = () => {
            if (!this.isAnimating) {
              resolve();
            } else {
              setTimeout(checkAnimation, 50);
            }
          };
          checkAnimation();
        });
      }
      
      this.isAnimating = true;
      
      // 准备新图片数据（在动画开始前就添加）
      // 确保在visibleCount > images.length的情况下也能正确计算
      const currentFirstIndex = this.carouselItems[0]?.originalIndex || 0;
      const newImageIndex = (currentFirstIndex + this.carouselItems.length) % this.totalImages;
      const newItem = {
        id: `item-${Date.now()}-new`,
        src: this.images[newImageIndex],
        originalIndex: newImageIndex,
        position: this.carouselItems.length, // 新图片在最后位置
        isVisible: true
      };
      
      // 立即添加新图片到数组，触发DOM更新
      this.carouselItems.push(newItem);
      
      // 等待DOM更新完成后开始动画
      await this.$nextTick();
      
      // 同时为所有元素添加动画类，包括新图片
      const queueItems = this.$refs.carouselQueue?.querySelectorAll('.queue-item');
      if (queueItems) {
        queueItems.forEach((element, index) => {
          const item = this.carouselItems[index];
          if (item.position === 0) {
            // 第一张图片：加速移出 + 变大
            element.classList.add('accelerate-out');
          } else {
            const prevElem = element.previousElementSibling;
            element.style.setProperty('--final-left', prevElem.style.left);
            element.style.setProperty('--final-top', prevElem.style.top);
            element.style.setProperty('--final-width', prevElem.style.width);
            // 不设置 --final-height，让高度自动调整
            element.classList.add('move-forward');
          }
        });
      }
      
      // 等待所有动画完成后一次性更新
      setTimeout(() => {
        // 同时进行：移除动画类 + 更新数据
        // 这样可以在移除动画类的同一帧内应用新的位置
        
        // 1. 准备新的数据结构
        const newCarouselItems = [];
        this.carouselItems.forEach(item => {
          if (item.position === 0) {
            // 第一张图片已移出，不添加到新数组
            return;
          } else {
            // 所有图片位置前移一位
            newCarouselItems.push({
              ...item,
              position: item.position - 1
            });
          }
        });
        
        // 2. 先更新数据，让getItemPositionStyle计算出正确的最终位置
        this.carouselItems = newCarouselItems;
        
        // 3. 等待DOM更新后，在移除动画类之前先应用最终样式
        this.$nextTick(() => {
          const currentQueueItems = this.$refs.carouselQueue?.querySelectorAll('.queue-item');
          if (currentQueueItems) {
            currentQueueItems.forEach(element => {
              element.classList.remove('accelerate-out', 'move-forward');
            });
          }
        })
        
        // 更新当前索引
        this.currentIndex = this.carouselItems[0]?.originalIndex || 0;
        this.$emit('change', this.currentIndex);
        
        // 重置动画状态
        this.isAnimating = false;
      }, 800);
    },
    
    startAutoPlay() {
      // 使用computed属性判断是否可以自动播放
      if (!this.canAutoPlay) return;
      
      this.stopAutoPlay();
      this.autoPlayTimer = setInterval(() => {
        this.pushQueue();
      }, this.autoPlayInterval);
    },
    
    stopAutoPlay() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = null;
      }
    },
    
    // 下一张
    next() {
      this.pushQueue();
      if (this.autoPlay) {
        this.startAutoPlay(); // 重新开始自动播放
      }
    },
    
    // 上一张（暂不支持，可通过多次next实现）
    prev() {
      console.warn('prev() is not implemented yet');
    },
    
    // 跳转到指定幻灯片（暂不支持，可通过多次next实现）
    goToSlide() {
      console.warn('goToSlide() is not implemented yet');
    },
    
    // 处理项目点击
    handleItemClick(item) {
      if (!item) return;
      
      this.$emit('click', item.originalIndex, item.src);
      
      if (item.position === 0) {
        // 点击第一张图片，正常推进
        this.stopAutoPlay();
        this.next();
      } else {
        // 点击非第一张图片，快速推进到该图片
        this.stopAutoPlay();
        this.fastForwardToItem(item);
      }
    },
    
    // 快速推进到指定项目
    async fastForwardToItem(targetItem) {
      const steps = targetItem.position;
      if (steps === 0) return;
      
      // 防止并发执行
      if (this.isFastForwarding) return;
      this.isFastForwarding = true;
      
      try {
        // 执行多次推进
        for (let i = 0; i < steps; i++) {
          await this.pushQueue();
          // 等待动画完成，确保与pushQueue的setTimeout时间一致
          await new Promise(resolve => setTimeout(resolve, 850)); // 稍微多一点确保动画完成
          
          // 等待DOM完全稳定
          await this.$nextTick();
        }
      } finally {
        this.isFastForwarding = false;
        
        // 快速推进完成后，重新计算容器高度
        if (this.height === 'auto') {
          this.$nextTick(() => {
            this.updateAutoHeight();
          });
        }
      }
    },
    
    handleImageLoad() {
      this.loadedImages++;
      // 图片加载完成后，重新计算容器高度
      if (this.height === 'auto') {
        this.$nextTick(() => {
          this.updateAutoHeight();
        });
      }
    },
    
    handleImageError(event) {
      console.warn('Image load error:', event.target.src);
    },
    
    // 响应式支持
    addResizeListener() {
      this.resizeHandler = this.throttle(() => {
        if (this.height === 'auto') {
          this.updateAutoHeight();
        }
      }, 100);
      window.addEventListener('resize', this.resizeHandler);
    },
    
    removeResizeListener() {
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler);
        this.resizeHandler = null;
      }
    },
    
    // 节流函数
    throttle(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  }
}
</script>

<style scoped>
.image-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  /* 支持自动高度 */
  min-height: 400px;
}

.carousel-queue {
  position: relative;
  width: 100%;
  /* 移除固定高度，让内容自动撑开 */
  min-height: 100%;
}

.queue-item {
  position: absolute;
  cursor: pointer;
  will-change: left, top, width, transform;
  /* 动画期间禁用默认过渡，避免冲突 */
  transition: all 0.6s linear;
  /* 高度自动，由内容撑开 */
  height: auto;
  /* 移动端优化：启用硬件加速 */
  transform: translateZ(0);
  /* 移动端优化：防止闪烁 */
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  /* 移动端优化：平滑渲染 */
  -webkit-perspective: 1000;
  perspective: 1000;
}

/* 动画期间禁用默认过渡 */
.queue-item.accelerate-out,
.queue-item.move-forward {
  transition: none !important;
  /* 移动端：确保动画期间transform优先级最高 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

/* 精确的推进动画效果 */

/* 第一张图片：加速移出 + 变大 */
.queue-item.accelerate-out {
  animation: accelerateOut 0.8s cubic-bezier(0.4, 0.0, 0.6, 1) forwards;
}

@keyframes accelerateOut {
  0% {
    -webkit-transform: translate(0, 0) scale(1);
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    /* 加速移出到显示区域外，同时变大 */
    -webkit-transform: translate(120%, 120%) scale(1.5);
    transform: translate(120%, 120%) scale(1.5);
    opacity: 0.7;
  }
}

/* 第2-5张图片：匀速前移 + 变大 */
.queue-item.move-forward {
  animation: moveForward 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes moveForward {
  100% {
    top: var(--final-top);
    left: var(--final-left);
    width: var(--final-width);
    /* 不动画height，让图片自动撑开高度 */
  }
}

.item-frame {
  width: 100%;
  /* 高度自动，由图片撑开 */
  height: auto;
  background: #fff;
  padding: 6px;
  box-sizing: border-box;
}

.item-image {
  width: 100%;
  /* 高度自动，保持图片原始比例 */
  height: auto;
  display: block;
  /* 移除固定宽高比，让图片保持原始比例 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel-queue {
    padding: 30px 20px;
  }
  
  .image-carousel {
    perspective: 800px;
  }
}

@media (max-width: 480px) {
  .carousel-queue {
    padding: 20px 15px;
  }
  
  .image-carousel {
    perspective: 600px;
  }
}
</style>
