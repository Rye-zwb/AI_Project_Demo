<template>
  <view class="container paper-texture">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="header-title">我的名片</text>
      <text class="header-subtitle">展示你的独特个性</text>
    </view>

    <!-- 用户名片卡片 -->
    <view class="profile-card diary-card tape-decoration">
      <view class="profile-header">
        <image class="profile-avatar" :src="currentUser?.avatar" mode="aspectFill" />
        <view class="profile-info">
          <text class="profile-name">{{ currentUser?.nickname }}</text>
          <view class="profile-location">
            <text class="location-icon">📍</text>
            <text class="location-text">{{ currentUser?.city }}</text>
            <text v-if="currentUser?.ipLocation" class="location-text">· {{ currentUser.ipLocation }}</text>
          </view>
        </view>
        <view class="edit-btn" @tap="goToEditProfile">
          <text>✏️</text>
        </view>
      </view>
      
      <view class="profile-status">
        <text class="status-quote">"</text>
        <text class="status-text">{{ currentUser?.status }}</text>
        <text class="status-quote">"</text>
      </view>

      <view class="profile-tags">
        <text v-for="tag in currentUser?.tags" :key="tag" class="tag tag-warm">{{ tag }}</text>
      </view>
    </view>

    <!-- 羁绊关系 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">我的羁绊</text>
        <view class="add-bond-btn" @tap="showBondModal">
          <text>+ 添加羁绊</text>
        </view>
      </view>
      
      <!-- 有羁绊时显示 -->
      <view v-if="friends.length > 0">
        <view 
          v-for="friend in friends" 
          :key="friend.id"
          class="friend-card diary-card"
          @tap="viewBond(friend.id)"
        >
          <image class="friend-avatar" :src="friend.avatar" mode="aspectFill" />
          <view class="friend-info">
            <text class="friend-name">{{ friend.nickname }}</text>
            <text class="friend-bond-name">{{ getBondName(friend.id) }}</text>
          </view>
          <view class="bond-value">
            <text class="bond-number">{{ getBondValue(friend.id) }}</text>
            <text class="bond-label">羁绊值</text>
          </view>
        </view>
      </view>
      
      <!-- 无羁绊时显示 -->
      <view v-else class="empty-bonds">
        <text class="empty-icon">🤝</text>
        <text class="empty-text">还没有羁绊关系</text>
        <text class="empty-sub">点击上方按钮添加羁绊</text>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-menu">
      <view class="menu-item" @tap="goToAchievements">
        <text class="menu-icon">🏆</text>
        <text class="menu-text">成就徽章</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item" @tap="goToVlog">
        <text class="menu-icon">🎬</text>
        <text class="menu-text">平行世界Vlog</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item" @tap="switchUser">
        <text class="menu-icon">🔄</text>
        <text class="menu-text">切换身份</text>
        <text class="menu-arrow">→</text>
      </view>
    </view>

    <!-- 添加羁绊弹窗 -->
    <view v-if="showBondModalFlag" class="modal-overlay" @tap="hideBondModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">添加羁绊</text>
          <text class="modal-close" @tap="hideBondModal">×</text>
        </view>
        
        <view class="form-item">
          <text class="form-label">给这段羁绊起个名字</text>
          <input v-model="bondName" class="form-input" placeholder="比如：大学同学、发小、富婆们..." />
          <text class="form-hint">用你们独特的称呼来标记这段关系</text>
        </view>
        
        <view class="form-item">
          <text class="form-label">选择好友</text>
          <view class="friend-list">
            <view 
              v-for="user in availableUsers" 
              :key="user.id"
              class="friend-option"
              :class="{ 'selected': selectedBondUserId === user.id }"
              @tap="selectedBondUserId = user.id"
            >
              <image class="option-avatar" :src="user.avatar" mode="aspectFill" />
              <text class="option-name">{{ user.nickname }}</text>
            </view>
          </view>
        </view>
        
        <button class="btn-primary" @tap="shareBondInvite">发送邀请</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { User, Bond } from '../../types';
import { getCurrentUser, getUserFriends, getAllUsers, switchUser as switchUserData, generateId } from '../../utils/mockData';

const currentUser = ref<User | null>(null);
const friends = ref<User[]>([]);
const bonds = ref<Bond[]>([]);
const allUsers = ref<User[]>([]);

// 添加羁绊弹窗
const showBondModalFlag = ref(false);
const selectedBondUserId = ref('');
const bondName = ref('');

const availableUsers = computed(() => {
  const currentId = currentUser.value?.id;
  const bondedUserIds = bonds.value
    .filter(b => b.userId1 === currentId || b.userId2 === currentId)
    .map(b => b.userId1 === currentId ? b.userId2 : b.userId1);
  
  return allUsers.value.filter(u => 
    u.id !== currentId && !bondedUserIds.includes(u.id)
  );
});

onMounted(() => {
  loadData();
});

const loadData = () => {
  currentUser.value = getCurrentUser();
  allUsers.value = getAllUsers();
  if (currentUser.value) {
    friends.value = getUserFriends(currentUser.value.id);
    bonds.value = uni.getStorageSync('pt_bonds') || [];
  }
};

const getBondValue = (friendId: string) => {
  const bond = bonds.value.find(b => 
    (b.userId1 === currentUser.value?.id && b.userId2 === friendId) ||
    (b.userId2 === currentUser.value?.id && b.userId1 === friendId)
  );
  return bond?.bondValue || 0;
};

const getBondName = (friendId: string) => {
  const bond = bonds.value.find(b => 
    (b.userId1 === currentUser.value?.id && b.userId2 === friendId) ||
    (b.userId2 === currentUser.value?.id && b.userId1 === friendId)
  );
  return bond?.bondName || '平行旅人';
};

const showBondModal = () => {
  showBondModalFlag.value = true;
  selectedBondUserId.value = '';
  bondName.value = '';
};

const hideBondModal = () => {
  showBondModalFlag.value = false;
};

const shareBondInvite = () => {
  if (!currentUser.value) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }
  
  if (!bondName.value.trim()) {
    uni.showToast({ title: '请输入羁绊名称', icon: 'none' });
    return;
  }
  
  if (!selectedBondUserId.value) {
    uni.showToast({ title: '请选择好友', icon: 'none' });
    return;
  }
  
  const shareUrl = `${window.location.origin}/pages/bond-confirm/bond-confirm?bondName=${encodeURIComponent(bondName.value.trim())}&initiatorId=${currentUser.value.id}`;
  
  uni.showModal({
    title: '分享邀请',
    content: `羁绊名称：${bondName.value}\n\n将邀请链接分享给好友，对方确认后即可建立羁绊关系。\n\n链接：${shareUrl}`,
    confirmText: '复制链接',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        uni.setClipboardData({
          data: shareUrl,
          success: () => {
            uni.showToast({ title: '链接已复制', icon: 'success' });
          },
        });
      }
    },
  });
};

const viewBond = (friendId: string) => {
  uni.navigateTo({ 
    url: `/pages/bond/bond?friendId=${friendId}` 
  });
};

const goToAchievements = () => {
  uni.navigateTo({ url: '/pages/achievements/achievements' });
};

const goToEditProfile = () => {
  uni.navigateTo({ url: '/pages/edit-profile/edit-profile' });
};

const goToVlog = () => {
  uni.navigateTo({ url: '/pages/vlog/vlog' });
};

const switchUser = () => {
  const currentId = currentUser.value?.id;
  const otherUsers = allUsers.value.filter(u => u.id !== currentId);
  
  if (otherUsers.length > 0) {
    uni.showActionSheet({
      itemList: otherUsers.map(u => u.nickname),
      success: (res) => {
        switchUserData(otherUsers[res.tapIndex].id);
        loadData();
        uni.showToast({
          title: `已切换为 ${otherUsers[res.tapIndex].nickname}`,
          icon: 'none',
        });
      },
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

.header {
  text-align: center;
  margin-bottom: $spacing-xl;
  padding: $spacing-lg 0;
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

.profile-card {
  text-align: center;
  padding: $spacing-xl;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.edit-btn {
  margin-left: auto;
  width: 40px;
  height: 40px;
  background: $bg-secondary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid $accent-warm;
  margin-bottom: $spacing-md;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-name {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.profile-location {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.location-icon {
  font-size: 16px;
}

.location-text {
  font-size: $font-size-sm;
  color: $text-muted;
}

.profile-status {
  margin-bottom: $spacing-lg;
  padding: $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-md;
}

.status-quote {
  font-size: $font-size-lg;
  color: $accent-warm;
  font-family: $font-serif;
}

.status-text {
  font-size: $font-size-md;
  color: $text-secondary;
  font-style: italic;
}

.profile-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: $spacing-sm;
}

.section {
  margin-top: $spacing-xl;
  margin-bottom: $spacing-xl;
}

.friend-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
}

.friend-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid $accent-warm;
}

.friend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.friend-name {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
}

.friend-city {
  font-size: $font-size-sm;
  color: $text-muted;
}

.bond-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
}

.bond-number {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $accent-warm;
}

.bond-label {
  font-size: $font-size-xs;
  color: $text-muted;
}

.quick-menu {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  background: $bg-secondary;
  border-radius: $radius-md;
}

.menu-icon {
  font-size: 24px;
}

.menu-text {
  flex: 1;
  font-size: $font-size-md;
  color: $text-primary;
}

.menu-arrow {
  font-size: $font-size-lg;
  color: $text-muted;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-primary;
  font-family: $font-serif;
}

.add-bond-btn {
  background: $accent-warm;
  color: white;
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
}

.empty-bonds {
  text-align: center;
  padding: $spacing-xxl;
  background: $bg-secondary;
  border-radius: $radius-md;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: $spacing-md;
}

.empty-text {
  font-size: $font-size-md;
  color: $text-secondary;
  display: block;
}

.empty-sub {
  font-size: $font-size-sm;
  color: $text-muted;
  margin-top: $spacing-sm;
  display: block;
}

.friend-bond-name {
  font-size: $font-size-xs;
  color: $accent-warm;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: $bg-primary;
  border-radius: $radius-lg $radius-lg 0 0;
  padding: $spacing-xl;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-xl;
}

.modal-title {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-primary;
}

.modal-close {
  font-size: $font-size-xl;
  color: $text-muted;
}

.form-item {
  margin-bottom: $spacing-lg;
}

.form-label {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: $spacing-sm;
}

.friend-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.friend-option {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-md;
  border: 2px solid transparent;

  &.selected {
    border-color: $accent-warm;
    background: rgba($accent-warm, 0.1);
  }
}

.option-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.option-name {
  font-size: $font-size-md;
  color: $text-primary;
}

.form-input {
  width: 100%;
  padding: $spacing-md;
  background: $bg-secondary;
  border: 2px solid $border-color;
  border-radius: $radius-md;
  font-size: $font-size-md;
  color: $text-primary;
}

.form-hint {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $spacing-sm;
  display: block;
}

.btn-primary {
  width: 100%;
  margin-top: $spacing-lg;
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  color: white;
  padding: $spacing-md;
  border-radius: $radius-md;
  font-size: $font-size-md;
  font-weight: 600;
  border: none;
}
</style>
