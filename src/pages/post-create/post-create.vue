<template>
  <view class="container paper-texture">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="header-title">记录瞬间</text>
      <text class="header-subtitle">分享你今天的故事</text>
    </view>

    <!-- 发布表单 -->
    <view class="form-card diary-card">
      <!-- 内容输入 -->
      <view class="form-item">
        <text class="form-label">今天发生了什么？</text>
        <textarea 
          v-model="content"
          class="content-input"
          placeholder="今天吃了麦当劳的新品汉堡，味道还不错..."
          maxlength="500"
        />
        <text class="char-count">{{ content.length }}/500</text>
      </view>

      <!-- 图片上传 -->
      <view class="form-item">
        <text class="form-label">添加照片</text>
        <view class="image-upload">
          <view 
            v-for="(img, idx) in images" 
            :key="idx"
            class="uploaded-image"
          >
            <image :src="img" mode="aspectFill" />
            <text class="remove-btn" @tap="removeImage(idx)">×</text>
          </view>
          <view v-if="images.length < 9" class="upload-btn" @tap="chooseImage">
            <text class="upload-icon">+</text>
          </view>
        </view>
      </view>

      <!-- 心情选择 -->
      <view class="form-item">
        <text class="form-label">今天的心情</text>
        <view class="mood-selector">
          <view 
            v-for="mood in moods" 
            :key="mood.name"
            class="mood-item"
            :class="{ 'active': selectedMood === mood.name }"
            @tap="selectMood(mood.name)"
          >
            <text class="mood-emoji">{{ mood.icon }}</text>
            <text class="mood-name">{{ mood.name }}</text>
          </view>
        </view>
      </view>

      <!-- 标签 -->
      <view class="form-item">
        <text class="form-label">添加标签</text>
        <view class="tag-input-area">
          <view class="tag-list">
            <view 
              v-for="(tag, idx) in tags" 
              :key="idx"
              class="tag-item"
            >
              <text>{{ tag }}</text>
              <text class="tag-remove" @tap="removeTag(idx)">×</text>
            </view>
          </view>
          <input 
            v-model="tagInput"
            class="tag-input"
            placeholder="输入标签，按回车添加"
            @confirm="addTag"
          />
        </view>
        <view class="quick-tags">
          <text 
            v-for="tag in quickTags" 
            :key="tag"
            class="quick-tag"
            @tap="quickAddTag(tag)"
          >
            {{ tag }}
          </text>
        </view>
      </view>

      <!-- 查看范围 -->
      <view class="form-item">
        <text class="form-label">谁可以看到</text>
        <view class="visibility-selector">
          <view 
            v-for="option in visibilityOptions" 
            :key="option.value"
            class="visibility-item"
            :class="{ 'active': selectedVisibility === option.value }"
            @tap="selectVisibility(option.value)"
          >
            <text class="visibility-icon">{{ option.icon }}</text>
            <text class="visibility-name">{{ option.name }}</text>
          </view>
        </view>
        
        <!-- 选择指定羁绊 -->
        <view v-if="selectedVisibility === 'bond'" class="bond-selector">
          <text class="bond-label">选择羁绊：</text>
          <view class="bond-list">
            <view 
              v-for="bond in userBonds" 
              :key="bond.id"
              class="bond-item"
              :class="{ 'selected': selectedBondIds.includes(bond.id) }"
              @tap="toggleBond(bond.id)"
            >
              <text>{{ bond.bondName }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 发布按钮 -->
      <button 
        class="btn-primary submit-btn"
        :disabled="!canSubmit"
        @tap="submitPost"
      >
        发布到羁绊空间
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Bond } from '../../types';
import { getCurrentUser, addPost, generateId, getUserBonds } from '../../utils/mockData';

const content = ref('');
const images = ref<string[]>([]);
const selectedMood = ref('');
const tags = ref<string[]>([]);
const tagInput = ref('');
const selectedVisibility = ref<'public' | 'friends' | 'bond' | 'private'>('public');
const selectedBondIds = ref<string[]>([]);
const userBonds = ref<Bond[]>([]);

const moods = [
  { name: '开心', icon: '😊' },
  { name: '平静', icon: '😌' },
  { name: '满足', icon: '🥰' },
  { name: '兴奋', icon: '🤩' },
  { name: '疲惫', icon: '😔' },
  { name: '无奈', icon: '😅' },
  { name: '难过', icon: '😢' },
  { name: '生气', icon: '😠' },
];

const quickTags = ['美食', '咖啡', '加班', '周末', '电影', '音乐', '旅行', '阅读'];

const visibilityOptions = [
  { value: 'public', name: '公开', icon: '🌍' },
  { value: 'friends', name: '好友可见', icon: '👥' },
  { value: 'bond', name: '指定羁绊', icon: '🔗' },
  { value: 'private', name: '仅自己', icon: '🔒' },
];

const canSubmit = computed(() => {
  const hasContent = content.value.trim().length > 0;
  const hasMood = selectedMood.value !== '';
  const hasVisibility = selectedVisibility.value !== 'bond' || selectedBondIds.value.length > 0;
  return hasContent && hasMood && hasVisibility;
});

onMounted(() => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    userBonds.value = getUserBonds(currentUser.id);
  }
});

const chooseImage = () => {
  uni.chooseImage({
    count: 9 - images.value.length,
    success: (res) => {
      images.value.push(...res.tempFilePaths);
    },
  });
};

const removeImage = (index: number) => {
  images.value.splice(index, 1);
};

const selectMood = (mood: string) => {
  selectedMood.value = mood;
};

const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag);
    tagInput.value = '';
  }
};

const removeTag = (index: number) => {
  tags.value.splice(index, 1);
};

const quickAddTag = (tag: string) => {
  if (!tags.value.includes(tag)) {
    tags.value.push(tag);
  }
};

const selectVisibility = (value: 'public' | 'friends' | 'bond' | 'private') => {
  selectedVisibility.value = value;
};

const toggleBond = (bondId: string) => {
  const index = selectedBondIds.value.indexOf(bondId);
  if (index > -1) {
    selectedBondIds.value.splice(index, 1);
  } else {
    selectedBondIds.value.push(bondId);
  }
};

const submitPost = () => {
  if (!canSubmit.value) {
    if (selectedVisibility.value === 'bond' && selectedBondIds.value.length === 0) {
      uni.showToast({ title: '请选择至少一个羁绊', icon: 'none' });
    }
    return;
  }

  const currentUser = getCurrentUser();
  if (!currentUser) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }

  const post = {
    id: `post_${generateId()}`,
    userId: currentUser.id,
    content: content.value.trim(),
    images: images.value,
    mood: selectedMood.value,
    tags: tags.value,
    createdAt: new Date().toISOString(),
    likes: 0,
    isSnapshot: true,
    visibility: selectedVisibility.value,
    visibleBondIds: selectedVisibility.value === 'bond' ? selectedBondIds.value : undefined,
  };

  addPost(post);

  uni.showToast({
    title: '发布成功',
    icon: 'success',
  });

  setTimeout(() => {
    uni.navigateBack();
  }, 1500);
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

.form-card {
  padding: $spacing-xl;
}

.form-item {
  margin-bottom: $spacing-xl;
}

.form-label {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: $spacing-md;
}

.content-input {
  width: 100%;
  min-height: 120px;
  background: $bg-secondary;
  border: 2px solid $border-color;
  border-radius: $radius-md;
  padding: $spacing-md;
  font-size: $font-size-md;
  color: $text-primary;
}

.char-count {
  font-size: $font-size-xs;
  color: $text-muted;
  text-align: right;
  display: block;
  margin-top: $spacing-xs;
}

.image-upload {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.uploaded-image {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: $radius-sm;
  overflow: hidden;

  image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.upload-btn {
  width: 80px;
  height: 80px;
  border: 2px dashed $border-color;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 32px;
  color: $text-muted;
}

.mood-selector {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.mood-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-md;
  border-radius: $radius-md;
  background: $bg-secondary;
  border: 2px solid transparent;
  min-width: 60px;

  &.active {
    border-color: $accent-warm;
    background: rgba($accent-warm, 0.1);
  }
}

.mood-emoji {
  font-size: 28px;
}

.mood-name {
  font-size: $font-size-xs;
  color: $text-secondary;
}

.tag-input-area {
  background: $bg-secondary;
  border: 2px solid $border-color;
  border-radius: $radius-md;
  padding: $spacing-md;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
  margin-bottom: $spacing-sm;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-sm;
  background: rgba($accent-warm, 0.15);
  color: $accent-warm;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
}

.tag-remove {
  font-size: 14px;
  cursor: pointer;
}

.tag-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: $font-size-sm;
  color: $text-primary;

  &::placeholder {
    color: $text-muted;
  }
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-top: $spacing-sm;
}

.quick-tag {
  padding: $spacing-xs $spacing-md;
  background: $bg-tertiary;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.submit-btn {
  width: 100%;
  margin-top: $spacing-xl;
}

.visibility-selector {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.visibility-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-md;
  border-radius: $radius-md;
  background: $bg-secondary;
  border: 2px solid transparent;
  flex: 1;
  min-width: 70px;
  justify-content: center;

  &.active {
    border-color: $accent-warm;
    background: rgba($accent-warm, 0.1);
  }
}

.visibility-icon {
  font-size: 20px;
}

.visibility-name {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.bond-selector {
  margin-top: $spacing-md;
  padding: $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-md;
}

.bond-label {
  font-size: $font-size-sm;
  color: $text-secondary;
  display: block;
  margin-bottom: $spacing-sm;
}

.bond-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.bond-item {
  padding: $spacing-sm $spacing-md;
  background: $bg-tertiary;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
  color: $text-secondary;
  border: 2px solid transparent;

  &.selected {
    background: rgba($accent-warm, 0.15);
    color: $accent-warm;
    border-color: $accent-warm;
  }
}
</style>
