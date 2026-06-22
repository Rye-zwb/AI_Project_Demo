<template>
  <view class="container paper-texture">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="header-title">羁绊空间</text>
      <text class="header-subtitle">记录生活，分享心情</text>
    </view>

    <!-- 发布按钮 -->
    <view class="publish-btn" @tap="goToPublish">
      <text class="publish-icon">+</text>
      <text class="publish-text">发布动态</text>
    </view>

    <!-- 动态列表 -->
    <view class="posts-list">
      <view 
        v-for="post in posts" 
        :key="post.id"
        class="post-card diary-card tape-decoration"
      >
        <!-- 帖子头部 -->
        <view class="post-header">
          <image class="post-avatar" :src="getUserAvatar(post.userId)" mode="aspectFill" />
          <view class="post-meta">
            <text class="post-author">{{ getUserNickname(post.userId) }}</text>
            <text class="post-time">{{ formatTime(post.createdAt) }}</text>
          </view>
          <view v-if="post.userId === currentUser?.id" class="post-actions">
            <text class="action-btn-text" @tap="editPost(post)">编辑</text>
            <text class="action-btn-text delete" @tap="deletePost(post.id)">删除</text>
          </view>
        </view>

        <!-- 帖子内容 -->
        <view class="post-body">
          <text class="post-content">{{ post.content }}</text>
          
          <!-- 图片 -->
          <view v-if="post.images.length > 0" class="post-images">
            <image 
              v-for="(img, idx) in post.images" 
              :key="idx"
              class="post-image"
              :src="img"
              mode="aspectFill"
              @error="onImageError($event, idx)"
              @tap="previewImage(post.images, idx)"
            />
          </view>

          <!-- 心情和标签 -->
          <view class="post-footer">
            <view class="post-mood">
              <text class="mood-icon">{{ getMoodIcon(post.mood) }}</text>
              <text class="mood-text">{{ post.mood }}</text>
            </view>
            <view class="post-tags">
              <text v-for="tag in post.tags" :key="tag" class="tag tag-warm">{{ tag }}</text>
            </view>
          </view>
        </view>

        <!-- 互动区域 -->
        <view class="post-interactions">
          <view class="interaction-btn" @tap="likePost(post)">
            <text class="interaction-icon">{{ post.likes > 0 ? '❤️' : '🤍' }}</text>
            <text class="interaction-count">{{ post.likes }}</text>
          </view>
          <view class="interaction-btn">
            <text class="interaction-icon">💬</text>
            <text class="interaction-count">留言</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 编辑弹窗 -->
    <view v-if="showEdit" class="modal-overlay" @tap="cancelEdit">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">编辑动态</text>
          <text class="modal-close" @tap="cancelEdit">×</text>
        </view>
        <textarea 
          v-model="editContent"
          class="edit-textarea"
          placeholder="分享你的心情..."
        />
        <view class="modal-actions">
          <button class="btn-secondary" @tap="cancelEdit">取消</button>
          <button class="btn-primary" @tap="saveEdit">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User, Post } from '../types';
import { 
  getCurrentUser, 
  getAllUsers, 
  getPosts, 
  deletePost as deletePostData,
  addPost 
} from '../utils/mockData';

const currentUser = ref<User | null>(null);
const allUsers = ref<User[]>([]);
const posts = ref<Post[]>([]);
const showEdit = ref(false);
const editContent = ref('');
const editPostId = ref('');

onMounted(() => {
  loadData();
});

const loadData = () => {
  currentUser.value = getCurrentUser();
  allUsers.value = getAllUsers();
  posts.value = getPosts();
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

const getMoodIcon = (mood: string) => {
  const icons: Record<string, string> = {
    '开心': '😊',
    '平静': '😌',
    '满足': '🥰',
    '疲惫': '😔',
    '无奈': '😅',
    '兴奋': '🤩',
    '难过': '😢',
  };
  return icons[mood] || '😐';
};

const previewImage = (images: string[], index: number) => {
  uni.previewImage({
    urls: images,
    current: images[index],
  });
};

const onImageError = (e: any, index: number) => {
  console.warn('图片加载失败:', e);
};

const likePost = (post: Post) => {
  post.likes++;
  // 更新存储
  const allPosts = getPosts();
  const target = allPosts.find(p => p.id === post.id);
  if (target) {
    target.likes = post.likes;
    uni.setStorageSync('pt_posts', allPosts);
  }
};

const deletePost = (postId: string) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条动态吗？',
    success: (res) => {
      if (res.confirm) {
        deletePostData(postId);
        loadData();
      }
    },
  });
};

const editPost = (post: Post) => {
  editPostId.value = post.id;
  editContent.value = post.content;
  showEdit.value = true;
};

const cancelEdit = () => {
  showEdit.value = false;
  editContent.value = '';
  editPostId.value = '';
};

const saveEdit = () => {
  if (!editContent.value.trim()) {
    uni.showToast({ title: '内容不能为空', icon: 'none' });
    return;
  }
  
  const allPosts = getPosts();
  const target = allPosts.find(p => p.id === editPostId.value);
  if (target) {
    target.content = editContent.value;
    uni.setStorageSync('pt_posts', allPosts);
    loadData();
  }
  
  showEdit.value = false;
  editContent.value = '';
  editPostId.value = '';
};

const goToPublish = () => {
  uni.navigateTo({ url: '/pages/post-create/post-create' });
};
</script>

<style lang="scss">
@import '../styles/variables.scss';

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

.publish-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  color: white;
  padding: $spacing-md $spacing-xl;
  border-radius: $radius-xl;
  margin-bottom: $spacing-xl;
  box-shadow: $shadow-soft;
}

.publish-icon {
  font-size: 24px;
  font-weight: 300;
}

.publish-text {
  font-size: $font-size-md;
  font-weight: 600;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.post-card {
  position: relative;
}

.post-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.post-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid $accent-warm;
}

.post-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-author {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
}

.post-time {
  font-size: $font-size-xs;
  color: $text-muted;
}

.post-actions {
  display: flex;
  gap: $spacing-md;
}

.action-btn-text {
  font-size: $font-size-sm;
  color: $accent-warm;

  &.delete {
    color: $accent-coral;
  }
}

.post-body {
  margin-bottom: $spacing-md;
}

.post-content {
  font-size: $font-size-md;
  color: $text-primary;
  line-height: 1.7;
  margin-bottom: $spacing-md;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.post-image {
  width: 100%;
  height: 100px;
  border-radius: $radius-sm;
  display: block;
  background-color: $bg-tertiary;
  object-fit: cover;
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.post-mood {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.mood-icon {
  font-size: 18px;
}

.mood-text {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.post-interactions {
  display: flex;
  gap: $spacing-xl;
  padding-top: $spacing-md;
  border-top: 1px solid $border-color;
}

.interaction-btn {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.interaction-icon {
  font-size: 18px;
}

.interaction-count {
  font-size: $font-size-sm;
  color: $text-muted;
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
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: $bg-primary;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  width: 85%;
  max-width: 400px;
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

.edit-textarea {
  width: 100%;
  min-height: 120px;
  background: $bg-secondary;
  border: 2px solid $border-color;
  border-radius: $radius-md;
  padding: $spacing-md;
  font-size: $font-size-md;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.modal-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: flex-end;
}
</style>
