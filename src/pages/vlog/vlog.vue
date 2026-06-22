<template>
  <view class="container paper-texture">
    <view class="header">
      <text class="header-icon">🎬</text>
      <text class="header-title">平行世界 Vlog</text>
      <text class="header-subtitle">记录你们共同的时光，创造独特的故事</text>
    </view>

    <view class="vlog-list">
      <view 
        v-for="vlog in vlogs" 
        :key="vlog.id"
        class="vlog-card diary-card tape-decoration"
      >
        <view class="vlog-cover" @tap="playVlog(vlog)">
          <image :src="vlog.cover" mode="aspectFill" />
          <view class="play-overlay">
            <text class="play-icon">▶</text>
          </view>
          <view class="vlog-title-overlay">
            <text class="vlog-title">{{ vlog.title }}</text>
            <text class="vlog-subtitle">{{ vlog.subtitle }}</text>
          </view>
          <view class="vlog-badge" :class="vlog.bgmStyle">
            <text>{{ getBgmIcon(vlog.bgmStyle) }}</text>
          </view>
        </view>

        <view class="scenes-preview">
          <view 
            v-for="(scene, idx) in vlog.scenes.slice(0, 4)" 
            :key="idx"
            class="scene-item"
          >
            <image :src="scene.image" mode="aspectFill" />
            <view class="scene-info">
              <text class="scene-caption">{{ scene.caption }}</text>
              <text class="scene-date">{{ scene.date }}</text>
            </view>
          </view>
          <view v-if="vlog.scenes.length > 4" class="scene-more">
            <text class="more-text">+{{ vlog.scenes.length - 4 }}</text>
          </view>
        </view>

        <view class="vlog-meta">
          <view class="meta-item" @tap="likeVlog(vlog)">
            <text class="meta-icon">{{ vlog.isLiked ? '❤️' : '🤍' }}</text>
            <text class="meta-text">{{ vlog.likes }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-icon">💬</text>
            <text class="meta-text">{{ vlog.comments }}</text>
          </view>
          <view class="meta-item" @tap="shareVlog(vlog)">
            <text class="meta-icon">↗</text>
            <text class="meta-text">分享</text>
          </view>
        </view>

        <view class="vlog-actions">
          <view class="action-btn primary" @tap="playVlog(vlog)">
            <text class="action-icon">▶</text>
            <text class="action-text">播放</text>
          </view>
          <view class="action-btn" @tap="editVlog(vlog)">
            <text class="action-icon">✏️</text>
            <text class="action-text">编辑</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="vlogs.length === 0" class="empty-state">
      <text class="empty-icon">📹</text>
      <text class="empty-title">还没有 Vlog</text>
      <text class="empty-desc">记录你的精彩瞬间，生成专属周Vlog</text>
      <button class="btn-primary" @tap="createVlog">创建 Vlog</button>
    </view>

    <view v-if="showPlayer" class="player-modal" @tap="closePlayer">
      <view class="player-content" @tap.stop>
        <view class="player-header">
          <text class="player-title">{{ currentVlog?.title }}</text>
          <text class="player-close" @tap="closePlayer">×</text>
        </view>
        
        <view class="player-scenes">
          <view 
            v-for="(scene, idx) in currentVlog?.scenes" 
            :key="idx"
            class="player-scene"
            :class="{ 'active': currentScene === idx }"
            :style="{ filter: currentFilter }"
          >
            <image :src="scene.image" mode="aspectFill" />
            <view class="scene-overlay">
              <text class="scene-caption">{{ scene.caption }}</text>
              <text class="scene-date">{{ scene.date }}</text>
            </view>
          </view>
        </view>

        <view class="player-controls">
          <view class="control-left">
            <view class="filter-btn" @tap="changeFilter">
              <text class="filter-icon">🎨</text>
              <text class="filter-name">{{ currentFilterName }}</text>
            </view>
          </view>

          <view class="control-center">
            <view class="play-pause-btn" @tap="togglePlay">
              <text>{{ isPlaying ? '⏸' : '▶' }}</text>
            </view>
          </view>

          <view class="control-right">
            <view class="bgm-btn" @tap="changeBgm">
              <text class="bgm-icon">{{ getBgmIcon(currentBgmStyle) }}</text>
            </view>
          </view>
        </view>

        <view class="progress-bar">
          <view class="progress-track" @tap="seekTo">
            <view 
              class="progress-fill"
              :style="{ width: progress + '%' }"
            ></view>
            <view 
              class="progress-dot"
              :style="{ left: progress + '%' }"
            ></view>
          </view>
          <view class="progress-info">
            <text class="progress-text">{{ formatTime(currentScene * 3) }}</text>
            <text class="progress-text">{{ currentScene + 1 }} / {{ currentVlog?.scenes.length }}</text>
            <text class="progress-text">{{ formatTime(currentVlog?.scenes.length * 3 || 0) }}</text>
          </view>
        </view>

        <view class="player-footer">
          <view class="footer-action" @tap="likeVlog(currentVlog!)">
            <text class="footer-icon">{{ currentVlog?.isLiked ? '❤️' : '🤍' }}</text>
            <text class="footer-text">{{ currentVlog?.likes }}</text>
          </view>
          <view class="footer-action" @tap="showComments">
            <text class="footer-icon">💬</text>
            <text class="footer-text">{{ currentVlog?.comments }}</text>
          </view>
          <view class="footer-action" @tap="shareVlog(currentVlog!)">
            <text class="footer-icon">↗</text>
            <text class="footer-text">分享</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="showCommentsModal" class="modal-overlay" @tap="hideCommentsModal">
      <view class="modal-content comments-modal" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">评论 ({{ currentVlog?.comments }})</text>
          <text class="modal-close" @tap="hideCommentsModal">×</text>
        </view>
        <scroll-view class="comments-list" scroll-y>
          <view 
            v-for="(comment, idx) in mockComments" 
            :key="idx"
            class="comment-item"
          >
            <image class="comment-avatar" :src="comment.avatar" mode="aspectFill" />
            <view class="comment-body">
              <view class="comment-header">
                <text class="comment-name">{{ comment.name }}</text>
                <text class="comment-time">{{ comment.time }}</text>
              </view>
              <text class="comment-content">{{ comment.content }}</text>
            </view>
          </view>
        </scroll-view>
        <view class="comment-input-area">
          <input v-model="newComment" class="comment-input" placeholder="写下你的评论..." />
          <button class="send-btn" @tap="sendComment">发送</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Vlog } from '../../types';
import { getVlogs } from '../../utils/mockData';

const vlogs = ref<Vlog[]>([]);
const showPlayer = ref(false);
const currentVlog = ref<Vlog | null>(null);
const currentScene = ref(0);
const isPlaying = ref(false);
const progress = ref(0);
const currentFilter = ref('none');
const currentFilterName = ref('原图');
const currentBgmStyle = ref<'happy' | 'calm' | 'energetic' | 'romantic'>('happy');
const showCommentsModal = ref(false);
const newComment = ref('');
const mockComments = ref([
  { avatar: '/static/avatars/friend1.svg', name: '小明', time: '2小时前', content: '好有感觉！' },
  { avatar: '/static/avatars/friend2.svg', name: '小红', time: '5小时前', content: '这个滤镜好好看' },
  { avatar: '/static/avatars/friend3.svg', name: '阿杰', time: '昨天', content: '默契满分！' },
]);

const filters = [
  { name: '原图', value: 'none' },
  { name: '复古', value: 'sepia(0.3)' },
  { name: '清新', value: 'saturate(1.5) brightness(1.1)' },
  { name: '黑白', value: 'grayscale(1)' },
  { name: '暖色', value: 'warmsepia(0.5)' },
];

let playInterval: any = null;
let filterIndex = 0;

onMounted(() => {
  loadData();
});

const loadData = () => {
  vlogs.value = getVlogs().map(v => ({ ...v, isLiked: false }));
};

const getBgmIcon = (style: string) => {
  const icons: Record<string, string> = {
    happy: '😊',
    calm: '🌿',
    energetic: '⚡',
    romantic: '💕',
  };
  return icons[style] || '🎵';
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

const playVlog = (vlog: Vlog) => {
  currentVlog.value = vlog;
  currentScene.value = 0;
  progress.value = 0;
  currentBgmStyle.value = vlog.bgmStyle || 'happy';
  showPlayer.value = true;
  startPlayback();
};

const startPlayback = () => {
  isPlaying.value = true;
  playInterval = setInterval(() => {
    if (!currentVlog.value) return;
    
    progress.value += (100 / (currentVlog.value.scenes.length * 50));
    
    if (progress.value >= 100) {
      progress.value = 0;
      currentScene.value = (currentScene.value + 1) % currentVlog.value.scenes.length;
    }
  }, 100);
};

const stopPlayback = () => {
  isPlaying.value = false;
  if (playInterval) {
    clearInterval(playInterval);
    playInterval = null;
  }
};

const togglePlay = () => {
  if (isPlaying.value) {
    stopPlayback();
  } else {
    startPlayback();
  }
};

const closePlayer = () => {
  stopPlayback();
  showPlayer.value = false;
  currentVlog.value = null;
};

const changeFilter = () => {
  filterIndex = (filterIndex + 1) % filters.length;
  currentFilter.value = filters[filterIndex].value;
  currentFilterName.value = filters[filterIndex].name;
};

const changeBgm = () => {
  const styles: ('happy' | 'calm' | 'energetic' | 'romantic')[] = ['happy', 'calm', 'energetic', 'romantic'];
  const currentIndex = styles.indexOf(currentBgmStyle.value);
  currentBgmStyle.value = styles[(currentIndex + 1) % styles.length];
};

const seekTo = (e: any) => {
  if (!currentVlog.value) return;
  const touch = e.touches ? e.touches[0] : e;
  const rect = e.currentTarget.getBoundingClientRect?.() || { left: 0, width: 300 };
  const percent = (touch.clientX - rect.left) / rect.width;
  progress.value = Math.max(0, Math.min(100, percent * 100));
  currentScene.value = Math.floor((progress.value / 100) * currentVlog.value.scenes.length);
};

const likeVlog = (vlog: Vlog) => {
  vlog.isLiked = !vlog.isLiked;
  vlog.likes += vlog.isLiked ? 1 : -1;
};

const shareVlog = (vlog: Vlog) => {
  uni.showActionSheet({
    itemList: ['分享给好友', '分享到朋友圈', '复制链接'],
    success: (res) => {
      if (res.tapIndex === 2) {
        uni.setClipboardData({
          data: `看看我的周Vlog：${vlog.title}`,
          success: () => {
            uni.showToast({ title: '链接已复制', icon: 'success' });
          },
        });
      } else {
        uni.showToast({ title: '分享成功', icon: 'success' });
      }
    },
  });
};

const showComments = () => {
  showCommentsModal.value = true;
};

const hideCommentsModal = () => {
  showCommentsModal.value = false;
};

const sendComment = () => {
  if (!newComment.value.trim()) return;
  mockComments.value.unshift({
    avatar: '/static/avatars/me.svg',
    name: '我',
    time: '刚刚',
    content: newComment.value.trim(),
  });
  currentVlog.value!.comments += 1;
  newComment.value = '';
  uni.showToast({ title: '评论成功', icon: 'success' });
};

const editVlog = (vlog: Vlog) => {
  uni.showToast({ title: '编辑功能开发中', icon: 'none' });
};

const createVlog = () => {
  uni.showToast({ title: '创建功能开发中', icon: 'none' });
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.container {
  min-height: 100vh;
  padding: $spacing-lg;
  padding-bottom: 100px;
}

.header {
  text-align: center;
  margin-bottom: $spacing-xl;
  padding: $spacing-lg 0;
}

.header-icon {
  font-size: 48px;
  display: block;
  margin-bottom: $spacing-md;
}

.header-title {
  font-size: $font-size-xxl;
  font-weight: 700;
  color: $text-primary;
  font-family: $font-serif;
  display: block;
}

.header-subtitle {
  font-size: $font-size-sm;
  color: $text-muted;
  margin-top: $spacing-sm;
  display: block;
}

.vlog-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.vlog-card {
  overflow: hidden;
}

.vlog-cover {
  position: relative;
  width: 100%;
  height: 220px;
  border-radius: $radius-md $radius-md 0 0;
  overflow: hidden;

  image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon {
  font-size: 56px;
  color: white;
  opacity: 0.9;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.vlog-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-lg;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.vlog-title {
  font-size: $font-size-lg;
  font-weight: 700;
  color: white;
  display: block;
}

.vlog-subtitle {
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.8);
  margin-top: $spacing-xs;
  display: block;
}

.vlog-badge {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-sm;
  font-size: $font-size-xs;
  
  &.happy { background: rgba(255, 193, 7, 0.9); color: white; }
  &.calm { background: rgba(76, 175, 80, 0.9); color: white; }
  &.energetic { background: rgba(255, 87, 34, 0.9); color: white; }
  &.romantic { background: rgba(233, 30, 99, 0.9); color: white; }
}

.scenes-preview {
  display: flex;
  gap: $spacing-xs;
  padding: $spacing-md;
}

.scene-item {
  flex: 1;
  border-radius: $radius-sm;
  overflow: hidden;

  image {
    width: 100%;
    height: 80px;
    object-fit: cover;
  }
}

.scene-info {
  padding: $spacing-xs;
}

.scene-caption {
  font-size: $font-size-xs;
  color: $text-primary;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scene-date {
  font-size: $font-size-xs;
  color: $text-muted;
}

.scene-more {
  width: 80px;
  height: 80px;
  border-radius: $radius-sm;
  background: $bg-tertiary;
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-text {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-muted;
}

.vlog-meta {
  display: flex;
  gap: $spacing-lg;
  padding: 0 $spacing-md;
  margin-bottom: $spacing-sm;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.meta-icon {
  font-size: 20px;
}

.meta-text {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.vlog-actions {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  border-top: 1px solid $border-color;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  padding: $spacing-sm;
  background: $bg-secondary;
  border-radius: $radius-md;

  &.primary {
    background: linear-gradient(135deg, $accent-warm, $accent-coral);
    
    .action-text {
      color: white;
    }
  }
}

.action-icon {
  font-size: 18px;
}

.action-text {
  font-size: $font-size-sm;
  color: $text-primary;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xxl * 2 0;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: $spacing-lg;
}

.empty-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.empty-desc {
  font-size: $font-size-sm;
  color: $text-muted;
  text-align: center;
  margin-bottom: $spacing-xl;
}

.player-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.player-content {
  width: 95%;
  max-width: 420px;
  background: $bg-primary;
  border-radius: $radius-lg;
  overflow: hidden;
}

.player-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  border-bottom: 1px solid $border-color;
}

.player-title {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-primary;
}

.player-close {
  font-size: $font-size-xl;
  color: $text-muted;
}

.player-scenes {
  position: relative;
  width: 100%;
  height: 320px;
  background: #000;
}

.player-scene {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.5s ease;

  &.active {
    opacity: 1;
  }

  image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.scene-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-lg;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  border-bottom: 1px solid $border-color;
}

.control-left,
.control-right {
  width: 100px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm;
  background: $bg-secondary;
  border-radius: $radius-md;
}

.filter-icon {
  font-size: 18px;
}

.filter-name {
  font-size: $font-size-xs;
  color: $text-secondary;
}

.play-pause-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.bgm-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: $bg-secondary;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.bgm-icon {
  font-size: 20px;
}

.progress-bar {
  padding: $spacing-md $spacing-lg;
}

.progress-track {
  position: relative;
  width: 100%;
  height: 6px;
  background: $bg-tertiary;
  border-radius: 3px;
  overflow: visible;
  margin-bottom: $spacing-xs;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $accent-warm, $accent-coral);
  border-radius: 3px;
  transition: width 0.1s linear;
}

.progress-dot {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background: white;
  border: 2px solid $accent-warm;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.progress-info {
  display: flex;
  justify-content: space-between;
}

.progress-text {
  font-size: $font-size-xs;
  color: $text-muted;
}

.player-footer {
  display: flex;
  justify-content: center;
  gap: $spacing-xl;
  padding: $spacing-lg;
  border-top: 1px solid $border-color;
}

.footer-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.footer-icon {
  font-size: 24px;
}

.footer-text {
  font-size: $font-size-xs;
  color: $text-secondary;
}

.comments-modal {
  width: 90%;
  max-width: 400px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.comments-list {
  flex: 1;
  padding: $spacing-md;
}

.comment-item {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-xs;
}

.comment-name {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-primary;
}

.comment-time {
  font-size: $font-size-xs;
  color: $text-muted;
}

.comment-content {
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: 1.5;
}

.comment-input-area {
  display: flex;
  gap: $spacing-sm;
  padding: $spacing-md;
  border-top: 1px solid $border-color;
}

.comment-input {
  flex: 1;
  padding: $spacing-sm $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
}

.send-btn {
  padding: $spacing-sm $spacing-lg;
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  color: white;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
}
</style>
