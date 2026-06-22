<template>
  <view class="container paper-texture">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="header-left">
        <text class="header-title">地球Online任务</text>
        <text class="header-subtitle">发现生活中的小美好</text>
      </view>
      <view class="settings-btn" @tap="goToPreferences">
        <text>⚙️</text>
      </view>
    </view>

    <!-- 功能按钮 -->
    <view class="action-buttons">
      <view class="action-btn primary" @tap="showCustomTaskModal">
        <text class="action-icon">✏️</text>
        <text class="action-text">自定义任务</text>
      </view>
      <view class="action-btn secondary" @tap="generateRandomTasks">
        <text class="action-icon">🎲</text>
        <text class="action-text">随机任务</text>
      </view>
    </view>

    <!-- 今日推荐任务 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">今日推荐</text>
        <text class="section-tip">任务只是建议，可以忽略不做</text>
      </view>
      
      <!-- 常规任务 -->
      <view 
        v-for="task in regularTasks" 
        :key="task.id"
        class="task-card diary-card"
        :class="{ 
          'completed': isTaskCompleted(task),
          'ignored': isTaskIgnored(task),
          'challenge': task.isChallenge 
        }"
      >
        <!-- 挑战任务标记 -->
        <view v-if="task.isChallenge" class="challenge-badge">
          <text>⚡ 挑战任务</text>
        </view>
        
        <view class="task-header">
          <view class="task-type-icon">{{ getTaskIcon(task.type) }}</view>
          <view class="task-info">
            <text class="task-title">{{ task.title }}</text>
            <text class="task-desc">{{ task.description }}</text>
            <!-- 挑战奖励 -->
            <view v-if="task.isChallenge && task.challengeReward" class="challenge-reward">
              <text>🎁 完成后获得：{{ task.challengeReward }}</text>
            </view>
          </view>
        </view>

        <view class="task-actions">
          <view 
            v-if="!isTaskCompleted(task) && !isTaskIgnored(task)"
            class="action-row"
          >
            <view class="ignore-btn" @tap="ignoreTaskHandler(task.id)">
              <text>忽略</text>
            </view>
            <view class="complete-btn" @tap="completeTaskHandler(task.id)">
              <text class="btn-text">完成</text>
            </view>
          </view>
          <view v-else-if="isTaskIgnored(task)" class="ignored-badge">
            <text>已忽略</text>
          </view>
          <view v-else class="completed-badge">
            <text class="badge-text">✓ 已完成</text>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="regularTasks.length === 0" class="empty-state">
        <text class="empty-icon">🎯</text>
        <text class="empty-text">今天还没有推荐任务</text>
        <text class="empty-sub">点击上方按钮创建自定义任务或随机生成</text>
      </view>
    </view>

    <!-- 随机任务弹框 -->
    <view v-if="showRandomModal" class="modal-overlay" @tap="closeRandomModal">
      <view class="modal-content random-modal" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">🎲 随机任务</text>
          <text class="modal-close" @tap="closeRandomModal">×</text>
        </view>
        
        <view class="modal-intro">
          <text>选择喜欢的任务加入，或者换一批</text>
        </view>

        <scroll-view class="random-task-list" scroll-y>
          <view 
            v-for="task in randomTasks" 
            :key="task.id"
            class="random-task-item"
          >
            <view class="task-header">
              <view class="task-type-icon">{{ getTaskIcon(task.type) }}</view>
              <view class="task-info">
                <text class="task-title">{{ task.title }}</text>
                <text class="task-desc">{{ task.description }}</text>
              </view>
            </view>

            <view class="task-actions">
              <view 
                v-if="!isRandomTaskAdded(task.id)"
                class="add-btn"
                @tap="addRandomTask(task)"
              >
                <text>+ 加入任务</text>
              </view>
              <view v-else class="added-badge">
                <text>✓ 已加入</text>
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="modal-footer">
          <button class="refresh-btn-large" @tap="generateRandomTasks">
            🔄 换一批
          </button>
          <button class="done-btn" @tap="closeRandomModal">
            完成
          </button>
        </view>
      </view>
    </view>

    <!-- 自定义任务 -->
    <view v-if="customTasks.length > 0" class="section">
      <view class="section-header">
        <text class="section-title">我的任务</text>
      </view>
      <view 
        v-for="task in customTasks" 
        :key="task.id"
        class="task-card diary-card custom-task"
      >
        <view class="task-header">
          <view class="task-type-icon">{{ getTaskIcon(task.type) }}</view>
          <view class="task-info">
            <text class="task-title">{{ task.title }}</text>
            <text class="task-desc">{{ task.description }}</text>
            <view v-if="task.invitedUsers && task.invitedUsers.length > 0" class="invited-info">
              <text>👥 已邀请 {{ task.invitedUsers.length }} 位朋友</text>
            </view>
          </view>
        </view>

        <view class="task-actions">
          <view 
            v-if="!isTaskCompleted(task)"
            class="complete-btn"
            @tap="completeTaskHandler(task.id)"
          >
            <text class="btn-text">完成</text>
          </view>
          <view v-else class="completed-badge">
            <text class="badge-text">✓ 已完成</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 自定义任务弹窗 -->
    <view v-if="showCustomModal" class="modal-overlay" @tap="hideCustomModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">创建自定义任务</text>
          <text class="modal-close" @tap="hideCustomModal">×</text>
        </view>
        
        <view class="form-item">
          <text class="form-label">任务标题</text>
          <input v-model="customTaskTitle" class="form-input" placeholder="比如：和好友一起看电影" />
        </view>
        
        <view class="form-item">
          <text class="form-label">任务描述</text>
          <textarea v-model="customTaskDesc" class="form-textarea" placeholder="详细描述一下这个任务..." />
        </view>
        
        <view class="form-item">
          <text class="form-label">任务类型</text>
          <view class="type-selector">
            <view 
              v-for="type in taskTypes" 
              :key="type.value"
              class="type-item"
              :class="{ 'active': customTaskType === type.value }"
              @tap="customTaskType = type.value"
            >
              <text class="type-icon">{{ type.icon }}</text>
              <text class="type-name">{{ type.name }}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">邀请朋友（可选）</text>
          <view class="friend-selector">
            <view 
              v-for="friend in allUsers.filter(u => u.id !== currentUser?.id)" 
              :key="friend.id"
              class="friend-item"
              :class="{ 'selected': selectedFriends.includes(friend.id) }"
              @tap="toggleFriend(friend.id)"
            >
              <image class="friend-avatar" :src="friend.avatar" mode="aspectFill" />
              <text class="friend-name">{{ friend.nickname }}</text>
            </view>
          </view>
          <text class="form-hint">不限时间，随时可以完成</text>
        </view>
        
        <button class="btn-primary" @tap="createCustomTask">创建任务</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { User, Task } from '../../types';
import { 
  getCurrentUser, 
  getAllUsers,
  getTasks, 
  completeTask as mockCompleteTask,
  ignoreTask as mockIgnoreTask,
  createCustomTask as mockCreateCustomTask,
  getRandomTasks,
  generateId
} from '../../utils/mockData';

const currentUser = ref<User | null>(null);
const allUsers = ref<User[]>([]);
const tasks = ref<Task[]>([]);
const randomTasks = ref<Task[]>([]);

// 自定义任务弹窗
const showCustomModal = ref(false);
const customTaskTitle = ref('');
const customTaskDesc = ref('');
const customTaskType = ref<'text' | 'photo' | 'voice' | 'creative' | 'explore'>('text');
const selectedFriends = ref<string[]>([]);

// 随机任务弹窗
const showRandomModal = ref(false);

const taskTypes = [
  { value: 'text', name: '文字', icon: '📝' },
  { value: 'photo', name: '拍照', icon: '📸' },
  { value: 'voice', name: '语音', icon: '🎤' },
  { value: 'creative', name: '创意', icon: '🎨' },
  { value: 'explore', name: '探索', icon: '🗺️' },
];

onMounted(() => {
  loadData();
});

const loadData = () => {
  currentUser.value = getCurrentUser();
  allUsers.value = getAllUsers();
  tasks.value = getTasks();
};

const regularTasks = computed(() => {
  return tasks.value.filter(t => !t.isCustom && !t.isRandom);
});

const customTasks = computed(() => {
  return tasks.value.filter(t => t.isCustom);
});

const completedTasks = computed(() => {
  return tasks.value.filter(t => t.completed);
});

const isTaskCompleted = (task: Task) => {
  return currentUser.value ? task.completedBy.includes(currentUser.value.id) : false;
};

const isTaskIgnored = (task: Task) => {
  return currentUser.value ? task.ignoredBy?.includes(currentUser.value.id) : false;
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

const completeTaskHandler = (taskId: string) => {
  if (!currentUser.value) return;
  
  mockCompleteTask(taskId, currentUser.value.id);
  
  uni.showToast({
    title: '任务完成',
    icon: 'success',
  });
  
  loadData();
};

const ignoreTaskHandler = (taskId: string) => {
  if (!currentUser.value) return;
  
  mockIgnoreTask(taskId, currentUser.value.id);
  
  uni.showToast({
    title: '已忽略',
    icon: 'success',
  });
  
  loadData();
};

const generateRandomTasks = () => {
  randomTasks.value = getRandomTasks();
  showRandomModal.value = true;
};

const closeRandomModal = () => {
  showRandomModal.value = false;
};

const goToPreferences = () => {
  uni.navigateTo({
    url: '/pages/task-preferences/task-preferences',
  });
};

const isRandomTaskAdded = (taskId: string) => {
  return tasks.value.some(t => t.id === taskId);
};

const addRandomTask = (task: Task) => {
  const exists = tasks.value.find(t => t.id === task.id);
  if (!exists) {
    const allTasks: Task[] = uni.getStorageSync('pt_tasks') || [];
    allTasks.push({ ...task });
    uni.setStorageSync('pt_tasks', allTasks);
    loadData();
    uni.showToast({
      title: '任务已加入',
      icon: 'success',
    });
  }
};

const showCustomTaskModal = () => {
  showCustomModal.value = true;
  customTaskTitle.value = '';
  customTaskDesc.value = '';
  customTaskType.value = 'text';
  selectedFriends.value = [];
};

const hideCustomModal = () => {
  showCustomModal.value = false;
};

const toggleFriend = (friendId: string) => {
  const index = selectedFriends.value.indexOf(friendId);
  if (index > -1) {
    selectedFriends.value.splice(index, 1);
  } else {
    selectedFriends.value.push(friendId);
  }
};

const createCustomTask = () => {
  if (!currentUser.value || !customTaskTitle.value.trim()) {
    uni.showToast({ title: '请输入任务标题', icon: 'none' });
    return;
  }
  
  const newTask: Task = {
    id: `custom_task_${generateId()}`,
    type: customTaskType.value,
    title: customTaskTitle.value.trim(),
    description: customTaskDesc.value.trim() || '自定义任务',
    completed: false,
    completedBy: [],
    ignoredBy: [],
    createdBy: currentUser.value.id,
    createdAt: new Date().toISOString(),
    isCustom: true,
    isChallenge: false,
    invitedUsers: selectedFriends.value.length > 0 ? selectedFriends.value : undefined,
  };
  
  mockCreateCustomTask(newTask);
  
  uni.showToast({
    title: '任务创建成功',
    icon: 'success',
  });
  
  hideCustomModal();
  loadData();
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
  justify-content: space-between;
  margin-bottom: $spacing-xl;
  padding: $spacing-lg 0;
}

.header-left {
  text-align: center;
  flex: 1;
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
  margin-top: $spacing-xs;
  display: block;
}

.settings-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-secondary;
  border-radius: 50%;
  font-size: 20px;
}

.action-buttons {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  
  &.primary {
    background: linear-gradient(135deg, $accent-warm, $accent-coral);
    color: white;
  }
  
  &.secondary {
    background: $bg-secondary;
    color: $text-primary;
  }
}

.action-icon {
  font-size: 20px;
}

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

.section-tip {
  font-size: $font-size-xs;
  color: $text-muted;
}

.refresh-btn {
  font-size: $font-size-sm;
  color: $accent-warm;
}

.task-card {
  margin-bottom: $spacing-md;
  position: relative;
  
  &.completed {
    opacity: 0.7;
  }
  
  &.ignored {
    opacity: 0.5;
  }
  
  &.challenge {
    border: 2px solid $accent-coral;
  }
  
  &.random-task {
    border-left: 4px solid $accent-green;
  }
  
  &.custom-task {
    border-left: 4px solid $accent-warm;
  }
}

.challenge-badge {
  position: absolute;
  top: -10px;
  right: $spacing-md;
  background: $accent-coral;
  color: white;
  padding: 2px $spacing-sm;
  border-radius: $radius-xl;
  font-size: $font-size-xs;
}

.challenge-reward {
  margin-top: $spacing-xs;
  font-size: $font-size-xs;
  color: $accent-coral;
}

.task-header {
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
}

.task-type-icon {
  font-size: 32px;
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

.task-desc {
  font-size: $font-size-sm;
  color: $text-muted;
  margin-top: $spacing-xs;
}

.invited-info {
  font-size: $font-size-xs;
  color: $accent-warm;
  margin-top: $spacing-xs;
}

.task-actions {
  display: flex;
  justify-content: flex-end;
}

.action-row {
  display: flex;
  gap: $spacing-sm;
}

.ignore-btn {
  background: $bg-tertiary;
  color: $text-muted;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
}

.complete-btn {
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  color: white;
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-xl;
}

.btn-text {
  font-size: $font-size-sm;
  font-weight: 600;
}

.ignored-badge {
  background: $bg-tertiary;
  color: $text-muted;
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
}

.completed-badge {
  background: rgba($accent-green, 0.15);
  color: $accent-green;
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-xl;
}

.badge-text {
  font-size: $font-size-sm;
  font-weight: 600;
}

.add-btn {
  background: $accent-warm;
  color: white;
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
}

.added-badge {
  background: rgba($accent-green, 0.15);
  color: $accent-green;
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-xl;
  font-size: $font-size-sm;
}

.empty-state {
  text-align: center;
  padding: $spacing-xxl;
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

/* 随机任务弹框 */
.random-modal {
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-intro {
  padding: $spacing-md;
  background: rgba($accent-warm, 0.1);
  margin: 0 $spacing-md;
  border-radius: $radius-md;
  text-align: center;
  font-size: $font-size-sm;
  color: $accent-warm;
}

.random-task-list {
  flex: 1;
  padding: $spacing-md;
  max-height: 400px;
}

.random-task-item {
  background: $bg-secondary;
  border-radius: $radius-md;
  padding: $spacing-md;
  margin-bottom: $spacing-md;
  
  .task-header {
    margin-bottom: $spacing-sm;
  }
}

.modal-footer {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  border-top: 1px solid $border-color;
}

.refresh-btn-large {
  flex: 1;
  padding: $spacing-md;
  background: $bg-secondary;
  border: 2px solid $accent-warm;
  border-radius: $radius-md;
  color: $accent-warm;
  font-size: $font-size-md;
  font-weight: 600;
}

.done-btn {
  flex: 1;
  padding: $spacing-md;
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  border-radius: $radius-md;
  color: white;
  font-size: $font-size-md;
  font-weight: 600;
  border: none;
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
  max-height: 85vh;
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

.form-input {
  width: 100%;
  padding: $spacing-md;
  background: $bg-secondary;
  border: 2px solid $border-color;
  border-radius: $radius-md;
  font-size: $font-size-md;
  color: $text-primary;
}

.form-textarea {
  width: 100%;
  min-height: 80px;
  padding: $spacing-md;
  background: $bg-secondary;
  border: 2px solid $border-color;
  border-radius: $radius-md;
  font-size: $font-size-md;
  color: $text-primary;
}

.type-selector {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-md;
  border: 2px solid transparent;
  min-width: 60px;
  
  &.active {
    border-color: $accent-warm;
    background: rgba($accent-warm, 0.1);
  }
}

.type-icon {
  font-size: 24px;
}

.type-name {
  font-size: $font-size-xs;
  color: $text-secondary;
}

.friend-selector {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.friend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm;
  background: $bg-secondary;
  border-radius: $radius-md;
  border: 2px solid transparent;
  
  &.selected {
    border-color: $accent-warm;
    background: rgba($accent-warm, 0.1);
  }
}

.friend-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.friend-name {
  font-size: $font-size-xs;
  color: $text-secondary;
}

.form-hint {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $spacing-sm;
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