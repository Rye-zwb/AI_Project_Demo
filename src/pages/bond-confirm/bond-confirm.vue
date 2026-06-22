<template>
  <view class="container paper-texture">
    <!-- 顶部装饰 -->
    <view class="header-decoration">
      <text class="decor-icon">🔗</text>
    </view>

    <!-- 羁绊邀请卡片 -->
    <view class="invite-card diary-card tape-decoration">
      <view class="invite-header">
        <text class="invite-title">收到羁绊邀请</text>
        <text class="invite-subtitle">有人想与你建立羁绊关系</text>
      </view>

      <!-- 羁绊名称 -->
      <view class="bond-name-section">
        <text class="bond-name-label">羁绊名称</text>
        <text class="bond-name">{{ bondName }}</text>
      </view>

      <!-- 发起人信息 -->
      <view class="initiator-section">
        <text class="initiator-label">发起羁绊的人</text>
        <view class="initiator-info">
          <image class="initiator-avatar" :src="initiator?.avatar" mode="aspectFill" />
          <view class="initiator-meta">
            <text class="initiator-name">{{ initiator?.nickname }}</text>
            <text class="initiator-city">{{ initiator?.city }}</text>
          </view>
        </view>
      </view>

      <!-- 提示 -->
      <view class="invite-tip">
        <text>建立羁绊后，你们可以：</text>
        <view class="tip-list">
          <text>✨ 发现彼此的默契瞬间</text>
          <text>📝 共享羁绊空间动态</text>
          <text>🎯 一起完成同步任务</text>
          <text>🎬 生成平行世界Vlog</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <view class="action-btn reject" @tap="rejectBond">
        <text>拒绝</text>
      </view>
      <view class="action-btn accept" @tap="acceptBond">
        <text>确认建立羁绊</text>
      </view>
    </view>

    <!-- 已处理提示 -->
    <view v-if="showResult" class="result-modal">
      <view class="result-card diary-card">
        <text class="result-icon">{{ isAccepted ? '🎉' : '😔' }}</text>
        <text class="result-title">{{ isAccepted ? '羁绊建立成功！' : '已拒绝羁绊邀请' }}</text>
        <text class="result-desc">{{ isAccepted ? '快去发现你们的默契瞬间吧' : '对方不会收到通知' }}</text>
        <view class="result-btn" @tap="goHome">
          <text>返回首页</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User, Bond } from '../../types';
import { getAllUsers, generateId } from '../../utils/mockData';

const initiator = ref<User | null>(null);
const bondName = ref('');
const initiatorId = ref('');
const showResult = ref(false);
const isAccepted = ref(false);

onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = (currentPage as any)?.options || {};
  
  bondName.value = options.bondName || '平行旅人';
  initiatorId.value = options.initiatorId || '';
  
  if (initiatorId.value) {
    const users = getAllUsers();
    initiator.value = users.find(u => u.id === initiatorId.value) || null;
  }
});

const acceptBond = () => {
  const currentUser = uni.getStorageSync('pt_current_user');
  
  if (!currentUser || !initiatorId.value) {
    uni.showToast({ title: '信息不完整', icon: 'none' });
    return;
  }
  
  const newBond: Bond = {
    id: `bond_${generateId()}`,
    userId1: initiatorId.value,
    userId2: currentUser.id,
    bondName: bondName.value,
    createdAt: new Date().toISOString(),
    bondValue: 0,
    impressions: {},
    milestones: [
      { 
        date: new Date().toISOString().split('T')[0], 
        title: '羁绊建立', 
        description: '成为了平行旅人' 
      },
    ],
  };
  
  const allBonds: Bond[] = uni.getStorageSync('pt_bonds') || [];
  allBonds.push(newBond);
  uni.setStorageSync('pt_bonds', allBonds);
  
  isAccepted.value = true;
  showResult.value = true;
};

const rejectBond = () => {
  isAccepted.value = false;
  showResult.value = true;
};

const goHome = () => {
  uni.switchTab({ url: '/pages/index/index' });
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.container {
  min-height: 100vh;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.header-decoration {
  text-align: center;
  margin-bottom: $spacing-xl;
}

.decor-icon {
  font-size: 64px;
}

.invite-card {
  width: 100%;
  padding: $spacing-xxl;
  margin-bottom: $spacing-xl;
}

.invite-header {
  text-align: center;
  margin-bottom: $spacing-xl;
}

.invite-title {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $text-primary;
  font-family: $font-serif;
  display: block;
}

.invite-subtitle {
  font-size: $font-size-sm;
  color: $text-muted;
  margin-top: $spacing-sm;
  display: block;
}

.bond-name-section {
  text-align: center;
  padding: $spacing-lg;
  background: rgba($accent-warm, 0.1);
  border-radius: $radius-lg;
  margin-bottom: $spacing-xl;
}

.bond-name-label {
  font-size: $font-size-xs;
  color: $text-muted;
  display: block;
  margin-bottom: $spacing-xs;
}

.bond-name {
  font-size: $font-size-xxl;
  font-weight: 700;
  color: $accent-warm;
  font-family: $font-serif;
}

.initiator-section {
  margin-bottom: $spacing-xl;
}

.initiator-label {
  font-size: $font-size-sm;
  color: $text-muted;
  display: block;
  margin-bottom: $spacing-md;
}

.initiator-info {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-md;
}

.initiator-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid $accent-warm;
}

.initiator-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.initiator-name {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-primary;
}

.initiator-city {
  font-size: $font-size-sm;
  color: $text-muted;
  margin-top: $spacing-xs;
}

.invite-tip {
  background: $bg-secondary;
  border-radius: $radius-md;
  padding: $spacing-md;
}

.invite-tip text:first-child {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: $spacing-sm;
}

.tip-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.tip-list text {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.action-buttons {
  display: flex;
  gap: $spacing-md;
  width: 100%;
}

.action-btn {
  flex: 1;
  padding: $spacing-lg;
  border-radius: $radius-md;
  text-align: center;
  font-size: $font-size-md;
  font-weight: 600;
  
  &.reject {
    background: $bg-tertiary;
    color: $text-muted;
  }
  
  &.accept {
    background: linear-gradient(135deg, $accent-warm, $accent-coral);
    color: white;
  }
}

/* 结果弹窗 */
.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($bg-primary, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-lg;
  z-index: 1000;
}

.result-card {
  text-align: center;
  padding: $spacing-xxl;
  width: 100%;
}

.result-icon {
  font-size: 64px;
  display: block;
  margin-bottom: $spacing-lg;
}

.result-title {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $text-primary;
  font-family: $font-serif;
  display: block;
}

.result-desc {
  font-size: $font-size-sm;
  color: $text-muted;
  margin-top: $spacing-sm;
  display: block;
}

.result-btn {
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  color: white;
  padding: $spacing-md $spacing-xl;
  border-radius: $radius-xl;
  margin-top: $spacing-xl;
  font-size: $font-size-md;
  font-weight: 600;
  display: inline-block;
}
</style>