<template>
  <view class="container paper-texture">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">任务偏好</text>
    </view>

    <!-- 任务类型偏好 -->
    <view class="section">
      <text class="section-title">🎯 喜欢的任务类型</text>
      <text class="section-desc">选择你喜欢的任务类型，我们会优先推送相关任务</text>
      
      <view class="type-grid">
        <view 
          v-for="type in taskTypes" 
          :key="type.value"
          class="type-card"
          :class="{ selected: preferences.preferredTypes.includes(type.value) }"
          @tap="toggleType(type.value)"
        >
          <text class="type-icon">{{ type.icon }}</text>
          <text class="type-name">{{ type.name }}</text>
          <text class="type-desc">{{ type.desc }}</text>
          <view class="type-check" v-if="preferences.preferredTypes.includes(type.value)">
            <text>✓</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 难度偏好 -->
    <view class="section">
      <text class="section-title">⚡ 任务难度</text>
      <text class="section-desc">选择你喜欢的任务挑战程度</text>
      
      <view class="difficulty-options">
        <view 
          v-for="diff in difficulties" 
          :key="diff.value"
          class="difficulty-option"
          :class="{ selected: preferences.difficulty === diff.value }"
          @tap="preferences.difficulty = diff.value"
        >
          <text class="diff-icon">{{ diff.icon }}</text>
          <text class="diff-name">{{ diff.name }}</text>
          <text class="diff-desc">{{ diff.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 推送频率 -->
    <view class="section">
      <text class="section-title">📅 任务频率</text>
      <text class="section-desc">设置你希望接收任务推送的频率</text>
      
      <view class="frequency-options">
        <view 
          v-for="freq in frequencies" 
          :key="freq.value"
          class="frequency-option"
          :class="{ selected: preferences.frequency === freq.value }"
          @tap="preferences.frequency = freq.value"
        >
          <text class="freq-name">{{ freq.name }}</text>
          <text class="freq-desc">{{ freq.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 隐藏惊喜 -->
    <view class="section">
      <text class="section-title">🎁 隐藏惊喜</text>
      <view class="surprise-card diary-card">
        <view class="surprise-header">
          <text class="surprise-icon">🔮</text>
          <view class="surprise-info">
            <text class="surprise-title">随机惊喜任务</text>
            <text class="surprise-desc">开启后，可能随机收到隐藏任务</text>
          </view>
          <view class="switch" :class="{ on: showSurprise }" @tap="showSurprise = !showSurprise">
            <view class="switch-dot"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 保存按钮 -->
    <button class="save-btn" @tap="savePreferences">
      保存设置
    </button>

    <!-- 预览 -->
    <view class="section">
      <text class="section-title">👀 任务预览</text>
      <text class="section-desc">根据你的偏好生成的任务示例</text>
      
      <view class="preview-list">
        <view 
          v-for="task in previewTasks" 
          :key="task.id"
          class="preview-item diary-card"
        >
          <view class="task-icon">{{ getTaskIcon(task.type) }}</view>
          <view class="task-info">
            <text class="task-title">{{ task.title }}</text>
            <text class="task-desc">{{ task.description }}</text>
          </view>
        </view>
      </view>
      
      <button class="refresh-preview-btn" @tap="generatePreview">
        🔄 换一批
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import type { TaskPreference } from '../../types';
import { getRandomTasks } from '../../utils/mockData';

const showSurprise = ref(true);
const previewTasks = ref<any[]>([]);

const preferences = reactive<TaskPreference>({
  userId: '',
  preferredTypes: ['photo', 'text'],
  difficulty: 'medium',
  frequency: 'daily',
});

const taskTypes = [
  { value: 'text' as const, icon: '📝', name: '文字记录', desc: '用文字记录心情' },
  { value: 'photo' as const, icon: '📷', name: '拍照任务', desc: '拍摄有趣的事物' },
  { value: 'voice' as const, icon: '🎤', name: '语音任务', desc: '录制声音或语音' },
  { value: 'creative' as const, icon: '🎨', name: '创意任务', desc: '发挥创意完成' },
  { value: 'explore' as const, icon: '🧭', name: '探索任务', desc: '发现新地方' },
];

const difficulties = [
  { value: 'easy' as const, icon: '🌱', name: '轻松', desc: '5分钟内完成' },
  { value: 'medium' as const, icon: '⭐', name: '适中', desc: '需要一点时间' },
  { value: 'hard' as const, icon: '🔥', name: '挑战', desc: '需要花费精力' },
  { value: 'random' as const, icon: '🎲', name: '随机', desc: '混合各种难度' },
];

const frequencies = [
  { value: 'daily' as const, name: '每日任务', desc: '每天推送新的任务' },
  { value: 'weekly' as const, name: '每周任务', desc: '每周集中推送' },
  { value: 'custom' as const, name: '自定义', desc: '手动触发获取' },
];

onMounted(() => {
  // 加载已保存的偏好
  const saved = uni.getStorageSync('pt_task_preference');
  if (saved) {
    Object.assign(preferences, saved);
  }
  preferences.userId = uni.getStorageSync('pt_current_user') || '';
  
  generatePreview();
});

const toggleType = (type: 'text' | 'photo' | 'voice' | 'creative' | 'explore') => {
  const index = preferences.preferredTypes.indexOf(type);
  if (index > -1) {
    preferences.preferredTypes.splice(index, 1);
  } else {
    preferences.preferredTypes.push(type);
  }
  generatePreview();
};

const generatePreview = () => {
  const allTasks = getRandomTasks();
  // 根据偏好筛选
  let filtered = allTasks.filter(t => preferences.preferredTypes.includes(t.type));
  if (filtered.length < 3) {
    filtered = allTasks;
  }
  previewTasks.value = filtered.slice(0, 3);
};

const getTaskIcon = (type: string) => {
  const icons: Record<string, string> = {
    text: '📝',
    photo: '📷',
    voice: '🎤',
    creative: '🎨',
    explore: '🧭',
  };
  return icons[type] || '📋';
};

const savePreferences = () => {
  uni.setStorageSync('pt_task_preference', preferences);
  uni.showToast({
    title: '设置已保存',
    icon: 'success',
  });
};

const goBack = () => {
  uni.navigateBack();
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
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-secondary;
  border-radius: 50%;
}

.back-icon {
  font-size: 20px;
}

.header-title {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $text-primary;
}

.section {
  margin-bottom: $spacing-xl;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-primary;
  display: block;
  margin-bottom: $spacing-sm;
}

.section-desc {
  font-size: $font-size-sm;
  color: $text-muted;
  display: block;
  margin-bottom: $spacing-md;
}

/* 任务类型选择 */
.type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
}

.type-card {
  position: relative;
  padding: $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-md;
  border: 2px solid transparent;
  transition: all 0.2s;
  
  &.selected {
    border-color: $accent-warm;
    background: rgba($accent-warm, 0.05);
  }
}

.type-icon {
  font-size: 32px;
  display: block;
  margin-bottom: $spacing-xs;
}

.type-name {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
  display: block;
}

.type-desc {
  font-size: $font-size-xs;
  color: $text-muted;
  display: block;
  margin-top: 2px;
}

.type-check {
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
  width: 24px;
  height: 24px;
  background: $accent-warm;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

/* 难度选择 */
.difficulty-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-sm;
}

.difficulty-option {
  text-align: center;
  padding: $spacing-md $spacing-sm;
  background: $bg-secondary;
  border-radius: $radius-md;
  border: 2px solid transparent;
  
  &.selected {
    border-color: $accent-warm;
    background: rgba($accent-warm, 0.05);
  }
}

.diff-icon {
  font-size: 24px;
  display: block;
  margin-bottom: $spacing-xs;
}

.diff-name {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-primary;
  display: block;
}

.diff-desc {
  font-size: $font-size-xs;
  color: $text-muted;
  display: block;
  margin-top: 2px;
}

/* 频率选择 */
.frequency-options {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.frequency-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-md;
  border: 2px solid transparent;
  
  &.selected {
    border-color: $accent-warm;
    background: rgba($accent-warm, 0.05);
  }
}

.freq-name {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
}

.freq-desc {
  font-size: $font-size-sm;
  color: $text-muted;
}

/* 隐藏惊喜 */
.surprise-card {
  padding: $spacing-lg;
}

.surprise-header {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.surprise-icon {
  font-size: 32px;
}

.surprise-info {
  flex: 1;
}

.surprise-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
  display: block;
}

.surprise-desc {
  font-size: $font-size-sm;
  color: $text-muted;
}

.switch {
  width: 50px;
  height: 28px;
  background: $bg-tertiary;
  border-radius: 14px;
  position: relative;
  transition: background 0.2s;
  
  &.on {
    background: $accent-warm;
  }
}

.switch-dot {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: left 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  
  .switch.on & {
    left: 24px;
  }
}

/* 保存按钮 */
.save-btn {
  width: 100%;
  padding: $spacing-md;
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  color: white;
  border-radius: $radius-md;
  font-size: $font-size-md;
  font-weight: 600;
  border: none;
  margin-bottom: $spacing-xl;
}

/* 预览 */
.preview-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
}

.preview-item {
  display: flex;
  gap: $spacing-md;
  align-items: center;
}

.task-icon {
  font-size: 28px;
}

.task-info {
  flex: 1;
}

.task-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
  display: block;
}

.task-desc {
  font-size: $font-size-sm;
  color: $text-muted;
  display: block;
}

.refresh-preview-btn {
  width: 100%;
  padding: $spacing-sm;
  background: $bg-secondary;
  border: 2px solid $accent-warm;
  border-radius: $radius-md;
  color: $accent-warm;
  font-size: $font-size-sm;
  font-weight: 600;
}
</style>
