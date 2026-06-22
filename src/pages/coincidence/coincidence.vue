<template>
  <view class="container paper-texture">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="header-icon">✨</text>
      <text class="header-title">默契发现</text>
      <text class="header-subtitle">你们在不同的地方，却有着相似的日常</text>
    </view>

    <!-- 默契卡片列表 -->
    <view class="coincidence-list">
      <view 
        v-for="(coin, index) in coincidences" 
        :key="coin.id"
        class="coincidence-card diary-card"
        :class="{ 'flipped': flippedCards.includes(index) }"
        @tap="flipCard(index)"
      >
        <!-- 正面 -->
        <view class="card-front">
          <view class="card-decoration">
            <text class="sparkle">✨</text>
          </view>
          <text class="coincidence-type">{{ getTypeLabel(coin.type) }}</text>
          <text class="coincidence-title">{{ coin.title }}</text>
          <text class="flip-hint">点击翻转查看详情</text>
        </view>

        <!-- 背面 -->
        <view class="card-back">
          <view class="back-header">
            <text class="back-title">默契详情</text>
            <text class="back-close" @tap.stop="flipCard(index)">×</text>
          </view>
          
          <view class="coincidence-detail">
            <text class="detail-desc">{{ coin.description }}</text>
            
            <view class="posts-comparison">
              <view class="post-side">
                <view class="side-header">
                  <image class="side-avatar" :src="currentUser?.avatar" mode="aspectFill" />
                  <text class="side-name">{{ currentUser?.nickname }}</text>
                </view>
                <image v-if="coin.myPost.image" class="side-image" :src="coin.myPost.image" mode="aspectFill" />
                <text class="side-content">{{ coin.myPost.content }}</text>
                <text class="side-time">{{ formatTime(coin.myPost.createdAt) }}</text>
              </view>
              
              <view class="connection-line">
                <text class="connection-icon">💫</text>
              </view>
              
              <view class="post-side">
                <view class="side-header">
                  <image class="side-avatar" :src="coin.friend.avatar" mode="aspectFill" />
                  <text class="side-name">{{ coin.friend.nickname }}</text>
                </view>
                <image v-if="coin.friendPost.image" class="side-image" :src="coin.friendPost.image" mode="aspectFill" />
                <text class="side-content">{{ coin.friendPost.content }}</text>
                <text class="side-time">{{ formatTime(coin.friendPost.createdAt) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="coincidences.length === 0" class="empty-state">
      <text class="empty-icon">🔍</text>
      <text class="empty-title">暂无默契发现</text>
      <text class="empty-desc">多记录一些日常，AI会帮你发现与好友的奇妙同步</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User } from '../../types';
import { getCurrentUser, findCoincidences } from '../../utils/mockData';

const currentUser = ref<User | null>(null);
const coincidences = ref<any[]>([]);
const flippedCards = ref<number[]>([]);

onMounted(() => {
  loadData();
});

const loadData = () => {
  currentUser.value = getCurrentUser();
  if (currentUser.value) {
    coincidences.value = findCoincidences(currentUser.value.id);
  }
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    keyword: '关键词默契',
    mood: '情绪共振',
    behavior: '行为同步',
    theme: '主题关联',
  };
  return labels[type] || '默契发现';
};

const formatTime = (time: string) => {
  const date = new Date(time);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const flipCard = (index: number) => {
  const pos = flippedCards.value.indexOf(index);
  if (pos > -1) {
    flippedCards.value.splice(pos, 1);
  } else {
    flippedCards.value.push(index);
  }
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

.coincidence-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.coincidence-card {
  position: relative;
  min-height: 200px;
  perspective: 1000px;
  cursor: pointer;

  &.flipped {
    .card-front {
      transform: rotateY(180deg);
      opacity: 0;
    }
    .card-back {
      transform: rotateY(0deg);
      opacity: 1;
    }
  }
}

.card-front,
.card-back {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backface-visibility: hidden;
  transition: all 0.6s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
}

.card-front {
  background: linear-gradient(135deg, rgba($accent-warm, 0.1), rgba($accent-coral, 0.1));
  border-radius: $radius-lg;
}

.card-back {
  background: $bg-secondary;
  border-radius: $radius-lg;
  transform: rotateY(-180deg);
  opacity: 0;
  overflow-y: auto;
}

.card-decoration {
  margin-bottom: $spacing-md;
}

.sparkle {
  font-size: 48px;
}

.coincidence-type {
  font-size: $font-size-sm;
  color: $accent-warm;
  font-weight: 600;
  margin-bottom: $spacing-sm;
}

.coincidence-title {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-primary;
  text-align: center;
  margin-bottom: $spacing-md;
}

.flip-hint {
  font-size: $font-size-xs;
  color: $text-muted;
}

.back-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: $spacing-md;
}

.back-title {
  font-size: $font-size-md;
  font-weight: 700;
  color: $text-primary;
}

.back-close {
  font-size: $font-size-xl;
  color: $text-muted;
}

.coincidence-detail {
  width: 100%;
}

.detail-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
  text-align: center;
  margin-bottom: $spacing-lg;
  display: block;
}

.posts-comparison {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.post-side {
  background: $bg-primary;
  border-radius: $radius-md;
  padding: $spacing-md;
}

.side-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.side-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.side-name {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-primary;
}

.side-image {
  width: 100%;
  height: 120px;
  border-radius: $radius-sm;
  margin-bottom: $spacing-sm;
}

.side-content {
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: 1.5;
  display: block;
  margin-bottom: $spacing-xs;
}

.side-time {
  font-size: $font-size-xs;
  color: $text-muted;
}

.connection-line {
  display: flex;
  align-items: center;
  justify-content: center;
}

.connection-icon {
  font-size: 24px;
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
}
</style>
