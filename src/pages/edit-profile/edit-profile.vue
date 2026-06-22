<template>
  <view class="container paper-texture">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="header-title">编辑个人信息</text>
      <text class="header-subtitle">完善你的个人资料</text>
    </view>

    <!-- 头像设置 -->
    <view class="form-card diary-card">
      <text class="form-section-title">头像</text>
      <view class="avatar-section">
        <image class="current-avatar" :src="userForm.avatar" mode="aspectFill" />
        <view class="avatar-actions">
          <view class="avatar-btn" @tap="chooseAvatar">
            <text>📷 更换头像</text>
          </view>
          <view class="avatar-btn" @tap="resetAvatar">
            <text>🔄 重置</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 基本信息 -->
    <view class="form-card diary-card">
      <text class="form-section-title">基本信息</text>
      
      <view class="form-item">
        <text class="form-label">昵称</text>
        <input v-model="userForm.nickname" class="form-input" placeholder="请输入昵称" />
      </view>

      <view class="form-item">
        <text class="form-label">性别</text>
        <view class="gender-selector">
          <view 
            v-for="g in genderOptions" 
            :key="g.value"
            class="gender-item"
            :class="{ 'active': userForm.gender === g.value }"
            @tap="userForm.gender = g.value"
          >
            <text class="gender-icon">{{ g.icon }}</text>
            <text class="gender-name">{{ g.name }}</text>
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">职业</text>
        <input v-model="userForm.occupation" class="form-input" placeholder="请输入职业" />
      </view>

      <view class="form-item">
        <text class="form-label">IP属地</text>
        <input v-model="userForm.ipLocation" class="form-input" placeholder="请输入IP属地" />
      </view>
    </view>

    <!-- 生日设置 -->
    <view class="form-card diary-card">
      <text class="form-section-title">生日设置</text>
      <text class="form-tip">设置生日后，会在生日前提醒你的羁绊好友</text>
      
      <view class="form-item">
        <text class="form-label">公历生日</text>
        <picker mode="date" :value="userForm.birthdaySolar" @change="onSolarBirthdayChange">
          <view class="picker-input">
            <text>{{ userForm.birthdaySolar || '请选择公历生日' }}</text>
            <text class="picker-arrow">→</text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">农历生日</text>
        <picker mode="date" :value="userForm.birthdayLunar" @change="onLunarBirthdayChange">
          <view class="picker-input">
            <text>{{ userForm.birthdayLunar || '请选择农历生日' }}</text>
            <text class="picker-arrow">→</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 个性标签 -->
    <view class="form-card diary-card">
      <view class="section-header-row">
        <text class="form-section-title">个性标签</text>
        <view class="impression-btn" @tap="showImpressions">
          <text>👀 看看好友印象</text>
        </view>
      </view>
      
      <view class="tag-list">
        <view 
          v-for="(tag, idx) in userForm.tags" 
          :key="idx"
          class="tag-item"
        >
          <text>{{ tag }}</text>
          <text class="tag-remove" @tap="removeTag(idx)">×</text>
        </view>
      </view>
      
      <view class="tag-input-area">
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

    <!-- 个性签名 -->
    <view class="form-card diary-card">
      <text class="form-section-title">个性签名</text>
      <textarea 
        v-model="userForm.status"
        class="status-textarea"
        placeholder="写一句你想说的话..."
        maxlength="50"
      />
      <text class="char-count">{{ userForm.status.length }}/50</text>
    </view>

    <!-- 保存按钮 -->
    <button class="btn-primary submit-btn" @tap="saveProfile">
      保存修改
    </button>

    <!-- 好友印象弹窗 -->
    <view v-if="showImpressionModal" class="modal-overlay" @tap="closeImpressionModal">
      <view class="modal-content impression-modal" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">好友印象</text>
          <text class="modal-close" @tap="closeImpressionModal">×</text>
        </view>
        
        <view class="impression-intro">
          <text class="intro-text">你的羁绊好友是这样看你的：</text>
        </view>

        <scroll-view class="impression-list" scroll-y>
          <view 
            v-for="(impression, idx) in impressions" 
            :key="idx"
            class="impression-item"
          >
            <view class="impression-header">
              <image class="impression-avatar" :src="impression.friendAvatar" mode="aspectFill" />
              <view class="impression-info">
                <text class="impression-name">{{ impression.friendName }}</text>
                <text class="impression-date">{{ impression.date }}</text>
              </view>
            </view>
            <view class="impression-tags">
              <text 
                v-for="tag in impression.tags" 
                :key="tag"
                class="impression-tag"
              >
                {{ tag }}
              </text>
            </view>
            <text class="impression-comment">{{ impression.comment }}</text>
          </view>

          <view v-if="impressions.length === 0" class="empty-impression">
            <text class="empty-icon">💭</text>
            <text class="empty-title">暂无好友印象</text>
            <text class="empty-desc">告诉你的羁绊好友，让他们评价一下你吧！</text>
          </view>
        </scroll-view>

        <view class="invite-btn-area">
          <button class="invite-btn" @tap="inviteFriends">
            邀请好友评价
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { User } from '../../types';
import { getCurrentUser, getAllUsers, switchUser, getUserImpressions } from '../../utils/mockData';

const userForm = reactive<User>({
  id: '',
  nickname: '',
  avatar: '',
  city: '',
  status: '',
  tags: [],
  createdAt: '',
});

const tagInput = ref('');
const showImpressionModal = ref(false);
const impressions = ref<any[]>([]);

const genderOptions = [
  { value: 'male', name: '男', icon: '👨' },
  { value: 'female', name: '女', icon: '👩' },
  { value: 'other', name: '其他', icon: '🧑' },
];

const quickTags = ['咖啡依赖', '美食猎人', '摄影爱好者', '旅行达人', '阅读控', '游戏玩家', '运动健将', '音乐发烧友'];

interface Impression {
  friendName: string;
  friendAvatar: string;
  friendId: string;
  tags: string[];
  comment: string;
  date: string;
}

onMounted(() => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    Object.assign(userForm, currentUser);
  }
});

const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      userForm.avatar = res.tempFilePaths[0];
    },
  });
};

const resetAvatar = () => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    userForm.avatar = currentUser.avatar || `/static/avatars/${userForm.nickname}.svg`;
  }
};

const onSolarBirthdayChange = (e: any) => {
  userForm.birthdaySolar = e.detail.value;
};

const onLunarBirthdayChange = (e: any) => {
  userForm.birthdayLunar = e.detail.value;
};

const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !userForm.tags.includes(tag)) {
    userForm.tags.push(tag);
    tagInput.value = '';
  }
};

const removeTag = (index: number) => {
  userForm.tags.splice(index, 1);
};

const quickAddTag = (tag: string) => {
  if (!userForm.tags.includes(tag)) {
    userForm.tags.push(tag);
  }
};

const showImpressions = () => {
  impressions.value = getUserImpressions(userForm.id);
  showImpressionModal.value = true;
};

const closeImpressionModal = () => {
  showImpressionModal.value = false;
};

const inviteFriends = () => {
  uni.showModal({
    title: '邀请好友评价',
    content: '将链接分享给羁绊好友，让他们为你留下印象评价！',
    confirmText: '复制链接',
    success: (res) => {
      if (res.confirm) {
        uni.setClipboardData({
          data: `快来评价一下我在地球Online中的印象吧！`,
          success: () => {
            uni.showToast({ title: '链接已复制', icon: 'success' });
          },
        });
      }
    },
  });
};

const saveProfile = () => {
  const allUsers: User[] = getAllUsers();
  const userIndex = allUsers.findIndex(u => u.id === userForm.id);
  
  if (userIndex > -1) {
    allUsers[userIndex] = { ...userForm };
    uni.setStorageSync('pt_users', allUsers);
    switchUser(userForm.id);
    
    uni.showToast({
      title: '保存成功',
      icon: 'success',
    });
    
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.container {
  min-height: 100vh;
  padding: $spacing-lg;
  padding-bottom: 120px;
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
  margin-bottom: $spacing-lg;
}

.form-section-title {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-primary;
  font-family: $font-serif;
  margin-bottom: $spacing-lg;
  display: block;
}

.form-tip {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-bottom: $spacing-md;
  display: block;
}

.form-item {
  margin-bottom: $spacing-lg;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  display: block;
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

/* 头像设置 */
.avatar-section {
  text-align: center;
}

.current-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid $accent-warm;
  margin-bottom: $spacing-lg;
}

.avatar-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
}

.avatar-btn {
  background: $bg-secondary;
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
  color: $text-secondary;
}

/* 性别选择 */
.gender-selector {
  display: flex;
  gap: $spacing-md;
}

.gender-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-md;
  border: 2px solid transparent;
  
  &.active {
    border-color: $accent-warm;
    background: rgba($accent-warm, 0.1);
  }
}

.gender-icon {
  font-size: 28px;
}

.gender-name {
  font-size: $font-size-sm;
  color: $text-secondary;
}

/* 日期选择器 */
.picker-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  background: $bg-secondary;
  border: 2px solid $border-color;
  border-radius: $radius-md;
  font-size: $font-size-md;
  color: $text-primary;
}

.picker-arrow {
  font-size: $font-size-lg;
  color: $text-muted;
}

/* 标签 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-md;
  background: rgba($accent-warm, 0.15);
  color: $accent-warm;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
}

.tag-remove {
  font-size: 16px;
}

.tag-input-area {
  margin-bottom: $spacing-md;
}

.tag-input {
  width: 100%;
  padding: $spacing-md;
  background: $bg-secondary;
  border: 2px solid $border-color;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  color: $text-primary;
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.quick-tag {
  padding: $spacing-xs $spacing-md;
  background: $bg-tertiary;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
}

.impression-btn {
  padding: $spacing-xs $spacing-md;
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  border-radius: $radius-xl;
  font-size: $font-size-xs;
  color: white;
}

/* 个性签名 */
.status-textarea {
  width: 100%;
  min-height: 80px;
  padding: $spacing-md;
  background: $bg-secondary;
  border: 2px solid $border-color;
  border-radius: $radius-md;
  font-size: $font-size-md;
  color: $text-primary;
}

.char-count {
  font-size: $font-size-xs;
  color: $text-muted;
  text-align: right;
  margin-top: $spacing-xs;
  display: block;
}

/* 保存按钮 */
.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  color: white;
  padding: $spacing-lg;
  border-radius: $radius-md;
  font-size: $font-size-lg;
  font-weight: 700;
  border: none;
}

/* 弹窗基础样式 */
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
  width: 90%;
  max-width: 400px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  border-bottom: 1px solid $border-color;
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

/* 好友印象弹窗 */
.impression-modal {
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.impression-intro {
  padding: $spacing-md;
  background: rgba($accent-warm, 0.1);
  margin: 0 $spacing-md;
  border-radius: $radius-md;
}

.intro-text {
  font-size: $font-size-sm;
  color: $accent-warm;
  text-align: center;
}

.impression-list {
  flex: 1;
  padding: $spacing-md;
  max-height: 400px;
}

.impression-item {
  background: $bg-secondary;
  border-radius: $radius-md;
  padding: $spacing-md;
  margin-bottom: $spacing-md;
}

.impression-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.impression-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.impression-info {
  flex: 1;
}

.impression-name {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-primary;
  display: block;
}

.impression-date {
  font-size: $font-size-xs;
  color: $text-muted;
}

.impression-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
  margin-bottom: $spacing-sm;
}

.impression-tag {
  padding: $spacing-xs $spacing-sm;
  background: rgba($accent-green, 0.15);
  color: $accent-green;
  border-radius: $radius-xl;
  font-size: $font-size-xs;
}

.impression-comment {
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: 1.5;
}

.empty-impression {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xl;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: $spacing-md;
}

.empty-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.empty-desc {
  font-size: $font-size-sm;
  color: $text-muted;
  text-align: center;
}

.invite-btn-area {
  padding: $spacing-md;
  border-top: 1px solid $border-color;
}

.invite-btn {
  width: 100%;
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  color: white;
  padding: $spacing-md;
  border-radius: $radius-md;
  font-size: $font-size-md;
  font-weight: 600;
  border: none;
}
</style>