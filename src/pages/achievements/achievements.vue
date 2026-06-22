<template>
  <view class="container paper-texture">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="header-icon">🏆</text>
      <text class="header-title">成就徽章</text>
      <text class="header-subtitle">记录你的每一个里程碑</text>
    </view>

    <!-- 统计概览 -->
    <view class="stats-overview diary-card">
      <view class="stat-circle">
        <text class="circle-number">{{ unlockedCount }}</text>
        <text class="circle-label">已解锁</text>
      </view>
      <view class="stat-detail">
        <view class="detail-item">
          <text class="detail-number">{{ achievements.length }}</text>
          <text class="detail-label">总成就</text>
        </view>
        <view class="detail-item">
          <text class="detail-number">{{ completionPercentage }}%</text>
          <text class="detail-label">完成度</text>
        </view>
      </view>
    </view>

    <!-- 成就列表 -->
    <view class="achievements-list">
      <view 
        v-for="ach in achievements" 
        :key="ach.id"
        class="achievement-card diary-card"
        :class="{ 'unlocked': ach.unlocked, 'locked': !ach.unlocked }"
      >
        <view class="achievement-icon">{{ ach.icon }}</view>
        <view class="achievement-info">
          <view class="achievement-header">
            <text class="achievement-title">{{ ach.title }}</text>
            <text v-if="ach.unlocked" class="achievement-badge">已解锁</text>
          </view>
          <text class="achievement-desc">{{ ach.description }}</text>
          
          <!-- 进度条 -->
          <view class="achievement-progress">
            <view class="progress-track">
              <view 
                class="progress-fill"
                :style="{ width: (ach.progress / ach.total * 100) + '%' }"
              ></view>
            </view>
            <text class="progress-text">{{ ach.progress }}/{{ ach.total }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Achievement } from '../../types';
import { getAchievements } from '../../utils/mockData';

const achievements = ref<Achievement[]>([]);

onMounted(() => {
  loadData();
});

const loadData = () => {
  achievements.value = getAchievements();
};

const unlockedCount = computed(() => {
  return achievements.value.filter(a => a.unlocked).length;
});

const completionPercentage = computed(() => {
  if (achievements.value.length === 0) return 0;
  return Math.round((unlockedCount.value / achievements.value.length) * 100);
});
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

.stats-overview {
  display: flex;
  align-items: center;
  gap: $spacing-xl;
  padding: $spacing-xl;
  margin-bottom: $spacing-xl;
}

.stat-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.circle-number {
  font-size: 32px;
  font-weight: 700;
  color: white;
}

.circle-label {
  font-size: $font-size-xs;
  color: rgba(255, 255, 255, 0.8);
}

.stat-detail {
  flex: 1;
  display: flex;
  gap: $spacing-xl;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.detail-number {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $accent-warm;
}

.detail-label {
  font-size: $font-size-sm;
  color: $text-muted;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.achievement-card {
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;
  padding: $spacing-lg;

  &.unlocked {
    border-left: 4px solid $accent-warm;
  }

  &.locked {
    opacity: 0.7;
    .achievement-icon {
      filter: grayscale(1);
    }
  }
}

.achievement-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.achievement-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.achievement-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-xs;
}

.achievement-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
}

.achievement-badge {
  font-size: $font-size-xs;
  color: $accent-warm;
  background: rgba($accent-warm, 0.15);
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-xl;
}

.achievement-desc {
  font-size: $font-size-sm;
  color: $text-muted;
  margin-bottom: $spacing-sm;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.progress-track {
  flex: 1;
  height: 6px;
  background: $bg-tertiary;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $accent-warm, $accent-coral);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: $font-size-xs;
  color: $text-muted;
  flex-shrink: 0;
}
</style>
