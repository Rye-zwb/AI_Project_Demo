<template>
  <view class="container paper-texture">
    <!-- 顶部返回 -->
    <view class="nav-header">
      <text class="back-btn" @tap="goBack">← 返回</text>
    </view>

    <!-- 羁绊信息 -->
    <view v-if="bond && friend" class="bond-content">
      <!-- 双方头像 -->
      <view class="bond-avatars">
        <view class="avatar-item">
          <image :src="currentUser?.avatar" mode="aspectFill" />
          <text class="avatar-name">{{ currentUser?.nickname }}</text>
        </view>
        <view class="bond-connection">
          <text class="connection-icon">💫</text>
          <text class="bond-value">{{ bond.bondValue }}</text>
        </view>
        <view class="avatar-item">
          <image :src="friend.avatar" mode="aspectFill" />
          <text class="avatar-name">{{ friend.nickname }}</text>
        </view>
      </view>

      <!-- 羁绊契约 -->
      <view class="contract-card diary-card">
        <view class="contract-header">
          <text class="contract-title">{{ bond.bondName || '羁绊' }}</text>
          <text class="contract-date">{{ formatDate(bond.createdAt) }} 建立</text>
        </view>
        
        <view class="view-archive-btn" @tap="goToArchive">
          <text>📖 查看完整档案</text>
        </view>
        
        <view class="impressions">
          <view class="impression-side">
            <text class="impression-label">{{ currentUser?.nickname }} 眼中的 {{ friend.nickname }}</text>
            <view class="impression-tags">
              <text 
                v-for="tag in bond.impressions[currentUser?.id || '']?.tags" 
                :key="tag"
                class="tag tag-warm"
              >
                {{ tag }}
              </text>
            </view>
            <text class="impression-desc">{{ bond.impressions[currentUser?.id || '']?.description }}</text>
          </view>
          
          <view class="impression-divider"></view>
          
          <view class="impression-side">
            <text class="impression-label">{{ friend.nickname }} 眼中的 {{ currentUser?.nickname }}</text>
            <view class="impression-tags">
              <text 
                v-for="tag in bond.impressions[friend.id]?.tags" 
                :key="tag"
                class="tag tag-green"
              >
                {{ tag }}
              </text>
            </view>
            <text class="impression-desc">{{ bond.impressions[friend.id]?.description }}</text>
          </view>
        </view>
      </view>

      <!-- 里程碑 -->
      <view class="section">
        <text class="section-title">羁绊里程碑</text>
        <view class="timeline">
          <view 
            v-for="(milestone, idx) in bond.milestones" 
            :key="idx"
            class="timeline-item"
          >
            <view class="timeline-dot"></view>
            <view class="timeline-content diary-card">
              <text class="timeline-date">{{ milestone.date }}</text>
              <text class="timeline-title">{{ milestone.title }}</text>
              <text class="timeline-desc">{{ milestone.description }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User, Bond } from '../../types';
import { getCurrentUser, getAllUsers } from '../../utils/mockData';

const currentUser = ref<User | null>(null);
const friend = ref<User | null>(null);
const bond = ref<Bond | null>(null);

onMounted(() => {
  loadData();
});

const loadData = () => {
  currentUser.value = getCurrentUser();
  
  // 获取URL参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const friendId = (currentPage as any).options?.friendId;
  
  if (friendId) {
    const allUsers = getAllUsers();
    friend.value = allUsers.find(u => u.id === friendId) || null;
    
    const bonds: Bond[] = uni.getStorageSync('pt_bonds') || [];
    bond.value = bonds.find(b => 
      (b.userId1 === currentUser.value?.id && b.userId2 === friendId) ||
      (b.userId2 === currentUser.value?.id && b.userId1 === friendId)
    ) || null;
  }
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

const goBack = () => {
  uni.navigateBack();
};

const goToArchive = () => {
  if (bond.value) {
    uni.navigateTo({
      url: `/pages/bond-archive/bond-archive?bondId=${bond.value.id}`,
    });
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

.nav-header {
  padding: $spacing-md 0;
  margin-bottom: $spacing-md;
}

.back-btn {
  font-size: $font-size-md;
  color: $accent-warm;
}

.bond-avatars {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xl;
  margin-bottom: $spacing-xl;
}

.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;

  image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid $accent-warm;
  }
}

.avatar-name {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-primary;
}

.bond-connection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.connection-icon {
  font-size: 32px;
}

.bond-value {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $accent-warm;
}

.contract-card {
  padding: $spacing-xl;
  margin-bottom: $spacing-xl;
}

.contract-header {
  text-align: center;
  margin-bottom: $spacing-lg;
}

.view-archive-btn {
  text-align: center;
  padding: $spacing-sm $spacing-md;
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  color: white;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
  margin-bottom: $spacing-lg;
  display: inline-block;
  margin: 0 auto $spacing-lg;
  width: 100%;
}

.contract-title {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-primary;
  font-family: $font-serif;
  display: block;
}

.contract-date {
  font-size: $font-size-sm;
  color: $text-muted;
  margin-top: $spacing-xs;
  display: block;
}

.impressions {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.impression-side {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.impression-label {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-secondary;
}

.impression-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.impression-desc {
  font-size: $font-size-sm;
  color: $text-muted;
  font-style: italic;
}

.impression-divider {
  height: 1px;
  background: $border-color;
  margin: $spacing-sm 0;
}

.section {
  margin-bottom: $spacing-xl;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-md;
  font-family: $font-serif;
  display: block;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding-left: $spacing-lg;
  border-left: 2px solid $border-color;
}

.timeline-item {
  position: relative;
}

.timeline-dot {
  position: absolute;
  left: -$spacing-lg - 6px;
  top: $spacing-md;
  width: 12px;
  height: 12px;
  background: $accent-warm;
  border-radius: 50%;
  border: 2px solid $bg-primary;
}

.timeline-content {
  padding: $spacing-md;
}

.timeline-date {
  font-size: $font-size-xs;
  color: $text-muted;
  display: block;
  margin-bottom: $spacing-xs;
}

.timeline-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: $spacing-xs;
}

.timeline-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
}
</style>
