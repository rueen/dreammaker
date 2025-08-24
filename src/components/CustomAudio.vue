<!--
 * @Author: diaochan
 * @Date: 2024-06-15 18:02:21
 * @LastEditors: diaochan
 * @LastEditTime: 2025-08-24 15:53:24
 * @Description: 音频
-->
<template>
  <!-- 场景音频元素 -->
  <audio ref="sceneAudioElement" loop v-if="sceneAudioSrc" :src="sceneAudioSrc">
  </audio>
  <!-- 剧情音频元素 -->
  <audio ref="plotAudioElement" loop v-if="plotAudioSrc" :src="plotAudioSrc">
  </audio>
  <div class="controls" v-if="isShowControls">
    <div class="bar-container" @click="handlePause" v-if="isPlay">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <div class="bar-container bar-container-paused" @click="handlePlay" v-else>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomAudio',
  data() {
    return {
      isPlay: true,
      isShowControls: false,
      sceneAudioSrc: null, // 场景音频源
      plotAudioSrc: null,  // 剧情音频源
      sceneAudio: null,    // 场景音频元素引用
      plotAudio: null,     // 剧情音频元素引用
      currentAudioLevel: 0 // 当前音频权重
    };
  },
  mounted() {
    // 监听音频元素的变化并初始化引用
    this.$nextTick(() => {
      this.updateAudioReferences();
    });
  },
  updated() {
    // 当组件更新时重新获取音频元素引用
    this.$nextTick(() => {
      this.updateAudioReferences();
    });
  },
  methods: {
    // 更新音频元素引用
    updateAudioReferences() {
      if (this.$refs.sceneAudioElement) {
        this.sceneAudio = this.$refs.sceneAudioElement;
      }
      if (this.$refs.plotAudioElement) {
        this.plotAudio = this.$refs.plotAudioElement;
      }
    },
    
    // 根据权重计算播放策略
    getPlayStrategy() {
      const hasSceneAudio = !!this.sceneAudioSrc && !!this.sceneAudio;
      const hasPlotAudio = !!this.plotAudioSrc && !!this.plotAudio;
      
      let playScene = false;
      let playPlot = false;
      
      if (this.currentAudioLevel === 0) {
        // 场景音频优先：优先播放场景音频，如果没有则播放剧情音频
        playScene = hasSceneAudio;
        playPlot = !hasSceneAudio && hasPlotAudio;
      } else if (this.currentAudioLevel === 1) {
        // 剧情音频优先：优先播放剧情音频，如果没有则播放场景音频
        playPlot = hasPlotAudio;
        playScene = !hasPlotAudio && hasSceneAudio;
      } else if (this.currentAudioLevel === 2) {
        // 同时播放：播放所有存在的音频
        playScene = hasSceneAudio;
        playPlot = hasPlotAudio;
      }
      
      return { playScene, playPlot };
    },
    
    // 统一的音频控制方法
    controlAudio(audioElement, shouldPlay, audioName) {
      if (!audioElement) return;
      
      try {
        if (shouldPlay) {
          // 如果音频已经在播放，避免重复调用 play()
          if (audioElement.paused) {
            audioElement.play().catch(err => {
              // 忽略 AbortError，这通常是由于快速切换导致的正常中断
              if (err.name !== 'AbortError') {
                console.warn(`${audioName}播放失败:`, err);
              }
            });
          }
        } else {
          if (!audioElement.paused) {
            audioElement.pause();
          }
        }
      } catch (error) {
        console.warn(`${audioName}控制失败:`, error);
      }
    },
    
    // 初始化音频播放（双音频元素架构）
    init(sceneAudio, plotAudio, audioLevel = 0) {
      // 先停止所有正在播放的音频
      this.stopAllAudios();
      
      this.isShowControls = true;
      this.currentAudioLevel = audioLevel;
      
      // 设置音频源
      this.sceneAudioSrc = sceneAudio;
      this.plotAudioSrc = plotAudio;
      
      // 等待DOM更新后启动音频
      this.$nextTick(() => {
        this.updateAudioReferences();
        this.startAudioPlayback();
      });
    },
    
    // 根据音频权重启动音频播放
    startAudioPlayback() {
      if (!this.isPlay) return;
      
      const { playScene, playPlot } = this.getPlayStrategy();
      this.controlAudio(this.sceneAudio, playScene, '场景音频');
      this.controlAudio(this.plotAudio, playPlot, '剧情音频');
    },
    
    // 暂停音频（暂停当前活跃的音频）
    handlePause(isShowControls = true) {
      const { playScene, playPlot } = this.getPlayStrategy();
      
      if (playScene) this.controlAudio(this.sceneAudio, false, '场景音频');
      if (playPlot) this.controlAudio(this.plotAudio, false, '剧情音频');
      
      this.isPlay = false;
      this.isShowControls = isShowControls;
    },
    
    // 播放音频（播放当前活跃的音频）
    handlePlay(isShowControls = true) {
      this.isPlay = true;
      this.isShowControls = isShowControls;
      
      // 重新启动音频播放
      try {
        this.startAudioPlayback();
      } catch (error) {
        console.warn('音频播放启动失败:', error);
      }
    },
    

    
    // 停止所有音频（初始化时清理）
    stopAllAudios() {
      // 确保当前音频元素存在且正在播放才暂停
      if (this.sceneAudio && !this.sceneAudio.paused) {
        this.controlAudio(this.sceneAudio, false, '场景音频');
      }
      
      if (this.plotAudio && !this.plotAudio.paused) {
        this.controlAudio(this.plotAudio, false, '剧情音频');
      }
      
      // 重置播放状态，确保新音频能正确开始
      this.isPlay = true;
    }
  }
}
</script>

<style scoped>
.controls{
  position: fixed;
  right: 0;
  top: 0;
  z-index: 2;
  cursor: pointer;
  padding: 20px 30px;
}
.bar-container {
  display: flex;
  align-items: flex-end;
}
.bar {
  width: 4px;
  height: 22px; /* 初始高度 */
  margin: 0 2px;
  background-color: rgba(255,255,255,.4);
  border-radius: 2px;
  animation: jump 1.5s ease-in-out infinite; /* 性能优化：减缓动画频率 */
  will-change: transform; /* 启用硬件加速 */
}
.bar:nth-child(1) {
  animation-delay: 0s;
}
.bar:nth-child(2) {
  animation-delay: 0.2s;
}
.bar:nth-child(3) {
  animation-delay: 0.4s;
}
.bar-container-paused .bar{
  animation: none
}
.bar-container-paused .bar:nth-child(1) {
  height: 14px;
}
.bar-container-paused .bar:nth-child(2) {
  height: 18px;
}
@keyframes jump {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}
</style>