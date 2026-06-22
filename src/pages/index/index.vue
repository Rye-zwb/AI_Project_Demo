<template>
  <view class="container paper-texture">
    <!-- 顶部用户信息 -->
    <view class="header">
      <view class="user-info">
        <image class="avatar" :src="currentUser?.avatar" mode="aspectFill" />
        <view class="user-meta">
          <text class="nickname">{{ currentUser?.nickname }}</text>
          <text class="status">{{ currentUser?.status }}</text>
        </view>
      </view>
      <view class="switch-user" @tap="showUserSwitch">
        <text class="switch-text">切换身份</text>
      </view>
    </view>

    <!-- 快捷入口卡片 -->
    <view class="quick-actions">
      <view class="action-card" @tap="goToPostCreate">
        <text class="action-icon">📝</text>
        <text class="action-text">记录瞬间</text>
      </view>
      <view class="action-card" @tap="goToVlog">
        <text class="action-icon">🎬</text>
        <text class="action-text">周Vlog</text>
      </view>
      <view class="action-card" @tap="goToAchievements">
        <text class="action-icon">🏆</text>
        <text class="action-text">成就</text>
      </view>
      <view class="action-card" @tap="goToCoincidence">
        <text class="action-icon">✨</text>
        <text class="action-text">默契瞬间</text>
      </view>
    </view>

    <!-- 默契发现提醒 -->
    <view 
      v-if="coincidences.length > 0" 
      class="coincidence-alert diary-card tape-decoration"
      @tap="goToCoincidence"
    >
      <view class="alert-header">
        <text class="alert-icon">✨</text>
        <text class="alert-title">发现 {{ coincidences.length }} 个默契瞬间</text>
        <view class="badge-dot"></view>
      </view>
      <text class="alert-desc">你和好友今天有着奇妙的同步</text>
    </view>

    <!-- 今日任务 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">今日任务</text>
        <text class="section-more" @tap="goToTasks">查看全部 →</text>
      </view>
      <view 
        v-for="task in todayTasks" 
        :key="task.id"
        class="task-card diary-card"
        :class="{ 'completed': isTaskCompleted(task) }"
        @tap="goToTasks"
      >
        <view class="task-icon">{{ getTaskIcon(task.type) }}</view>
        <view class="task-info">
          <text class="task-title">{{ task.title }}</text>
          <text class="task-status">{{ isTaskCompleted(task) ? '已完成' : '待完成' }}</text>
        </view>
        <text class="task-arrow">→</text>
      </view>
    </view>

    <!-- 羁绊空间动态 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">羁绊空间</text>
        <text class="section-more" @tap="goToSpace">进入空间 →</text>
      </view>
      <view 
        v-for="post in recentPosts" 
        :key="post.id"
        class="post-preview diary-card"
        @tap="goToSpace"
      >
        <view class="post-header">
          <image class="post-avatar" :src="getUserAvatar(post.userId)" mode="aspectFill" />
          <view class="post-meta">
            <text class="post-author">{{ getUserNickname(post.userId) }}</text>
            <text class="post-time">{{ formatTime(post.createdAt) }}</text>
          </view>
        </view>
        <text class="post-content">{{ post.content }}</text>
        <view v-if="post.images.length > 0" class="post-images">
          <image 
            v-for="(img, idx) in post.images.slice(0, 3)" 
            :key="idx"
            class="post-image"
            :src="img"
            mode="aspectFill"
          />
        </view>
        <view class="post-tags">
          <text v-for="tag in post.tags" :key="tag" class="tag tag-warm">{{ tag }}</text>
        </view>
      </view>
    </view>

    <!-- 用户切换弹窗 -->
    <view v-if="showSwitch" class="modal-overlay" @tap="hideUserSwitch">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">切换身份</text>
          <text class="modal-close" @tap="hideUserSwitch">×</text>
        </view>
        <view 
          v-for="user in allUsers" 
          :key="user.id"
          class="user-option"
          :class="{ 'active': user.id === currentUser?.id }"
          @tap="switchToUser(user.id)"
        >
          <image class="option-avatar" :src="user.avatar" mode="aspectFill" />
          <view class="option-info">
            <text class="option-name">{{ user.nickname }}</text>
            <text class="option-city">{{ user.city }}</text>
          </view>
          <text v-if="user.id === currentUser?.id" class="option-check">✓</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { User, Task, Post } from '../../types';
import { 
  getCurrentUser, 
  getAllUsers, 
  switchUser, 
  getTasks, 
  getPosts, 
  findCoincidences,
  getUserFriends 
} from '../../utils/mockData';

const currentUser = ref<User | null>(null);
const allUsers = ref<User[]>([]);
const todayTasks = ref<Task[]>([]);
const recentPosts = ref<Post[]>([]);
const coincidences = ref<any[]>([]);
const showSwitch = ref(false);

onMounted(() => {
  loadData();
});

const loadData = () => {
  currentUser.value = getCurrentUser();
  allUsers.value = getAllUsers();
  todayTasks.value = getTasks().slice(0, 2);
  recentPosts.value = getPosts().slice(0, 3);
  if (currentUser.value) {
    coincidences.value = findCoincidences(currentUser.value.id);
  }
};

const isTaskCompleted = (task: Task) => {
  return currentUser.value ? task.completedBy.includes(currentUser.value.id) : false;
};

const getTaskIcon = (type: string) => {
  const icons: Record<string, string> = {
    text: '📝',
    photo: '📸',
    voice: '🎤',
    creative: '🎨',
    explore: '🗺️',
  };
  return icons[type] || '📋';
};

const getUserAvatar = (userId: string) => {
  const user = allUsers.value.find(u => u.id === userId);
  return user?.avatar || '/static/avatars/default.svg';
};

const getUserNickname = (userId: string) => {
  const user = allUsers.value.find(u => u.id === userId);
  return user?.nickname || '未知用户';
};

const formatTime = (time: string) => {
  const date = new Date(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours}小时前`;
  return `${Math.floor(hours / 24)}天前`;
};

const showUserSwitch = () => {
  showSwitch.value = true;
};

const hideUserSwitch = () => {
  showSwitch.value = false;
};

const switchToUser = (userId: string) => {
  switchUser(userId);
  loadData();
  showSwitch.value = false;
};

const goToCoincidence = () => {
  uni.navigateTo({ url: '/pages/coincidence/coincidence' });
};

const goToTasks = () => {
  uni.switchTab({ url: '/pages/tasks/tasks' });
};

const goToSpace = () => {
  uni.switchTab({ url: '/posts/posts' });
};

const goToPostCreate = () => {
  uni.navigateTo({ url: '/pages/post-create/post-create' });
};

const goToVlog = () => {
  uni.navigateTo({ url: '/pages/vlog/vlog' });
};

const goToAchievements = () => {
  uni.navigateTo({ url: '/pages/achievements/achievements' });
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.container {
  min-height: 100vh;
  padding: $spacing-lg;
  padding-bottom: 120px;
}

/* 顶部用户信息 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-xl;
  padding: $spacing-lg 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid $accent-warm;
  object-fit: cover;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-primary;
}

.status {
  font-size: $font-size-sm;
  color: $text-muted;
  margin-top: 2px;
}

.switch-user {
  padding: $spacing-sm $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-xl;
  border: 2px solid $border-color;
}

.switch-text {
  font-size: $font-size-sm;
  color: $text-secondary;
}

/* 默契发现提醒 */
.coincidence-alert {
  background: linear-gradient(135deg, rgba($accent-warm, 0.1), rgba($accent-coral, 0.1));
  border-color: rgba($accent-warm, 0.3);
  margin-bottom: $spacing-xl;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.alert-icon {
  font-size: 24px;
}

.alert-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: $accent-warm;
}

.alert-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
}

/* 区块标题 */
.section {
  margin-bottom: $spacing-xl;
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

.section-more {
  font-size: $font-size-sm;
  color: $accent-warm;
}

/* 任务卡片 */
.task-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  margin-bottom: $spacing-sm;

  &.completed {
    opacity: 0.7;
    .task-title {
      text-decoration: line-through;
    }
  }
}

.task-icon {
  font-size: 28px;
}

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.task-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
}

.task-status {
  font-size: $font-size-sm;
  color: $text-muted;
  margin-top: 2px;
}

.task-arrow {
  font-size: $font-size-lg;
  color: $text-muted;
}

/* 动态预览 */
.post-preview {
  margin-bottom: $spacing-md;
}

.post-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.post-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.post-meta {
  display: flex;
  flex-direction: column;
}

.post-author {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-primary;
}

.post-time {
  font-size: $font-size-xs;
  color: $text-muted;
}

.post-content {
  font-size: $font-size-md;
  color: $text-primary;
  line-height: 1.6;
  margin-bottom: $spacing-sm;
}

.post-images {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.post-image {
  width: 80px;
  height: 80px;
  border-radius: $radius-sm;
  object-fit: cover;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

/* 快捷入口 */
.quick-actions {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg 0;
  margin-bottom: $spacing-lg;
}

.action-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-lg $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-md;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-icon {
  font-size: 28px;
}

.action-text {
  font-size: $font-size-sm;
  color: $text-secondary;
  text-align: center;
}

/* 弹窗 */
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
  max-height: 60vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
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

.user-option {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  border-radius: $radius-md;
  margin-bottom: $spacing-sm;

  &.active {
    background: rgba($accent-warm, 0.1);
  }
}

.option-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.option-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.option-name {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
}

.option-city {
  font-size: $font-size-sm;
  color: $text-muted;
}

.option-check {
  font-size: $font-size-lg;
  color: $accent-warm;
  font-weight: 700;
}
</style>
