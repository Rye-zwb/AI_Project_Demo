<template>
  <view class="container paper-texture">
    <view class="header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="header-info">
        <text class="header-title">{{ bond?.bondName || '羁绊档案' }}</text>
        <text class="header-subtitle">与 {{ friendName }} 的故事</text>
      </view>
    </view>

    <!-- 羁绊值 -->
    <view class="bond-value-card diary-card">
      <view class="value-header">
        <text class="value-label">羁绊值</text>
        <text class="value-number">{{ bond?.bondValue || 0 }}</text>
      </view>
      <view class="value-bar">
        <view class="value-fill" :style="{ width: (bond?.bondValue || 0) + '%' }"></view>
      </view>
      <view class="value-stats">
        <view class="stat-item">
          <text class="stat-value">{{ bond?.milestones.length || 0 }}</text>
          <text class="stat-label">里程碑</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ totalCoincidences }}</text>
          <text class="stat-label">默契瞬间</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ totalTasks }}</text>
          <text class="stat-label">共同任务</text>
        </view>
      </view>
    </view>

    <!-- 即将到来的纪念日 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">📅 即将到来</text>
        <text class="add-btn" @tap="showAddAnniversary">+ 添加</text>
      </view>
      
      <view v-if="upcomingAnniversaries.length > 0" class="anniversary-list">
        <view 
          v-for="item in upcomingAnniversaries" 
          :key="item.anniversary.id"
          class="anniversary-item diary-card"
        >
          <view class="anniversary-date">
            <text class="date-day">{{ getDayNumber(item.anniversary.date) }}</text>
            <text class="date-month">{{ getMonthShort(item.anniversary.date) }}</text>
          </view>
          <view class="anniversary-info">
            <text class="anniversary-name">{{ item.anniversary.name }}</text>
            <text class="anniversary-bond">{{ item.bond.bondName }}</text>
            <view class="days-left" v-if="item.daysLeft === 0">
              <text class="days-badge today">今天！🎉</text>
            </view>
            <view class="days-left" v-else>
              <text class="days-badge">{{ item.daysLeft }}天后</text>
            </view>
          </view>
        </view>
      </view>
      
      <view v-else class="empty-state-small">
        <text class="empty-icon">📅</text>
        <text class="empty-text">未来7天没有纪念日</text>
      </view>
    </view>

    <!-- 互动时间轴 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">📜 回忆时间轴</text>
      </view>
      
      <view class="timeline">
        <view 
          v-for="(item, index) in timelineItems" 
          :key="item.id"
          class="timeline-item"
        >
          <view class="timeline-marker">
            <view class="marker-icon">{{ item.icon }}</view>
            <view v-if="index < timelineItems.length - 1" class="marker-line"></view>
          </view>
          <view class="timeline-content diary-card" :class="item.type">
            <view class="timeline-header">
              <text class="timeline-date">{{ formatDate(item.date) }}</text>
              <view class="timeline-badge" :class="item.type">
                <text>{{ getTypeName(item.type) }}</text>
              </view>
            </view>
            <text class="timeline-title">{{ item.title }}</text>
            <text class="timeline-desc" v-if="item.description">{{ item.description }}</text>
          </view>
        </view>
      </view>
      
      <view v-if="!timelineItems.length" class="empty-state-small">
        <text class="empty-icon">📖</text>
        <text class="empty-text">还没有互动记录</text>
      </view>
    </view>

    <!-- 全部纪念日 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">💝 纪念日</text>
      </view>
      
      <view class="anniversary-list">
        <view 
          v-for="ann in bond?.anniversaries || []" 
          :key="ann.id"
          class="anniversary-item-simple"
        >
          <view class="anniversary-date-small">
            <text>{{ formatDateShort(ann.date) }}</text>
          </view>
          <view class="anniversary-info">
            <text class="anniversary-name">{{ ann.name }}</text>
            <text class="anniversary-desc" v-if="ann.description">{{ ann.description }}</text>
          </view>
          <view class="anniversary-actions">
            <text v-if="ann.isYearly" class="yearly-badge">每年</text>
            <text class="delete-btn" @tap="deleteAnn(ann.id)">×</text>
          </view>
        </view>
      </view>
      
      <view v-if="!bond?.anniversaries?.length" class="empty-state-small">
        <text class="empty-icon">💕</text>
        <text class="empty-text">还没有纪念日，添加一个吧</text>
      </view>
    </view>

    <!-- 添加纪念日弹窗 -->
    <view v-if="showAnniversaryModal" class="modal-overlay" @tap="closeAnniversaryModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">添加纪念日</text>
          <text class="modal-close" @tap="closeAnniversaryModal">×</text>
        </view>
        
        <view class="modal-body">
          <view class="form-item">
            <text class="form-label">名称</text>
            <input v-model="newAnniversary.name" class="form-input" placeholder="如：相识纪念日" />
          </view>
          
          <view class="form-item">
            <text class="form-label">日期</text>
            <input v-model="newAnniversary.date" class="form-input" type="date" />
          </view>
          
          <view class="form-item">
            <text class="form-label">描述（可选）</text>
            <input v-model="newAnniversary.description" class="form-input" placeholder="描述这个纪念日" />
          </view>
          
          <view class="form-item">
            <view class="checkbox-row" @tap="newAnniversary.isYearly = !newAnniversary.isYearly">
              <view class="checkbox" :class="{ checked: newAnniversary.isYearly }">
                <text v-if="newAnniversary.isYearly">✓</text>
              </view>
              <text class="checkbox-label">每年重复</text>
            </view>
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="btn-cancel" @tap="closeAnniversaryModal">取消</button>
          <button class="btn-primary" @tap="saveAnniversary">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Bond, Milestone, Anniversary } from '../../types';
import { getBondById, getUserBonds, getBondFriend, addAnniversary, deleteAnniversary, getUpcomingAnniversaries } from '../../utils/mockData';
import { getCurrentUser } from '../../utils/mockData';

const bondId = ref('');
const bond = ref<Bond | null>(null);
const friendName = ref('');
const upcomingAnniversaries = ref<{ bond: Bond; anniversary: Anniversary; daysLeft: number }[]>([]);
const showAnniversaryModal = ref(false);

const newAnniversary = ref({
  name: '',
  date: '',
  description: '',
  isYearly: true,
});

const totalCoincidences = ref(3); // 模拟数据
const totalTasks = ref(12); // 模拟数据

// 互动时间轴
interface TimelineItem {
  id: string;
  type: 'post' | 'coincidence' | 'task' | 'milestone' | 'anniversary';
  date: string;
  title: string;
  description?: string;
  image?: string;
  icon: string;
}

const timelineItems = ref<TimelineItem[]>([]);

const sortedMilestones = computed(() => {
  if (!bond.value) return [];
  return [...bond.value.milestones].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = (currentPage as any)?.options || {};
  
  bondId.value = options.bondId || '';
  const currentUser = getCurrentUser();
  
  if (bondId.value) {
    bond.value = getBondById(bondId.value);
    if (bond.value && currentUser) {
      const friend = getBondFriend(bond.value, currentUser.id);
      friendName.value = friend?.nickname || '好友';
      
      // 加载互动时间轴
      loadTimeline(currentUser.id);
    }
  }
  
  if (currentUser) {
    upcomingAnniversaries.value = getUpcomingAnniversaries(currentUser.id);
  }
});

const loadTimeline = (userId: string) => {
  if (!bond.value) return;
  
  const items: TimelineItem[] = [];
  
  // 添加里程碑
  bond.value.milestones.forEach(ms => {
    items.push({
      id: ms.id,
      type: 'milestone',
      date: ms.date,
      title: ms.title,
      description: ms.description,
      icon: '🏆',
    });
  });
  
  // 添加纪念日
  bond.value.anniversaries.forEach(ann => {
    items.push({
      id: ann.id,
      type: 'anniversary',
      date: ann.date,
      title: ann.name,
      description: ann.description,
      icon: '💝',
    });
  });
  
  // 模拟：添加一些默契瞬间
  items.push({
    id: 'coin_1',
    type: 'coincidence',
    date: '2026-02-14',
    title: '默契瞬间',
    description: '同一天都吃了火锅',
    icon: '✨',
  });
  
  items.push({
    id: 'coin_2',
    type: 'coincidence',
    date: '2026-03-15',
    title: '默契瞬间',
    description: '同一天都拍了天空',
    icon: '✨',
  });
  
  // 模拟：添加一些共同任务
  items.push({
    id: 'task_1',
    type: 'task',
    date: '2026-02-01',
    title: '完成共同任务',
    description: '拍摄今天的早餐',
    icon: '✅',
  });
  
  items.push({
    id: 'task_2',
    type: 'task',
    date: '2026-03-01',
    title: '完成共同任务',
    description: '记录一件开心的事',
    icon: '✅',
  });
  
  // 按日期排序
  timelineItems.value = items.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

const goBack = () => {
  uni.navigateBack();
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

const formatDateShort = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const getDayNumber = (dateStr: string) => {
  return new Date(dateStr).getDate();
};

const getTypeName = (type: string) => {
  const names: Record<string, string> = {
    post: '📷 动态',
    coincidence: '✨ 默契',
    task: '✅ 任务',
    milestone: '🏆 里程碑',
    anniversary: '💝 纪念日',
  };
  return names[type] || type;
};

const getMonthShort = (dateStr: string) => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  return months[new Date(dateStr).getMonth()];
};

const showAddAnniversary = () => {
  newAnniversary.value = { name: '', date: '', description: '', isYearly: true };
  showAnniversaryModal.value = true;
};

const closeAnniversaryModal = () => {
  showAnniversaryModal.value = false;
};

const saveAnniversary = () => {
  if (!newAnniversary.value.name || !newAnniversary.value.date) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' });
    return;
  }
  
  if (!bondId.value) return;
  
  const ann: Anniversary = {
    id: `ann_${Date.now()}`,
    name: newAnniversary.value.name,
    date: newAnniversary.value.date,
    description: newAnniversary.value.description,
    isYearly: newAnniversary.value.isYearly,
    type: 'custom',
  };
  
  addAnniversary(bondId.value, ann);
  
  // 刷新数据
  bond.value = getBondById(bondId.value);
  const currentUser = getCurrentUser();
  if (currentUser) {
    upcomingAnniversaries.value = getUpcomingAnniversaries(currentUser.id);
  }
  
  closeAnniversaryModal();
  uni.showToast({ title: '添加成功', icon: 'success' });
};

const deleteAnn = (anniversaryId: string) => {
  if (!bondId.value) return;
  
  uni.showModal({
    title: '删除纪念日',
    content: '确定要删除这个纪念日吗？',
    success: (res) => {
      if (res.confirm) {
        deleteAnniversary(bondId.value, anniversaryId);
        bond.value = getBondById(bondId.value);
        const currentUser = getCurrentUser();
        if (currentUser) {
          upcomingAnniversaries.value = getUpcomingAnniversaries(currentUser.id);
        }
        uni.showToast({ title: '已删除', icon: 'success' });
      }
    },
  });
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

.header-info {
  flex: 1;
}

.header-title {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $text-primary;
  font-family: $font-serif;
  display: block;
}

.header-subtitle {
  font-size: $font-size-sm;
  color: $text-muted;
}

/* 羁绊值卡片 */
.bond-value-card {
  margin-bottom: $spacing-xl;
}

.value-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.value-label {
  font-size: $font-size-md;
  color: $text-secondary;
}

.value-number {
  font-size: 32px;
  font-weight: 700;
  color: $accent-warm;
  font-family: $font-mono;
}

.value-bar {
  height: 8px;
  background: $bg-tertiary;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: $spacing-lg;
}

.value-fill {
  height: 100%;
  background: linear-gradient(90deg, $accent-warm, $accent-coral);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.value-stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $text-primary;
  display: block;
}

.stat-label {
  font-size: $font-size-xs;
  color: $text-muted;
}

/* 区块 */
.section {
  margin-bottom: $spacing-xl;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-primary;
}

.add-btn {
  font-size: $font-size-sm;
  color: $accent-warm;
  font-weight: 600;
}

/* 纪念日列表 */
.anniversary-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.anniversary-item {
  display: flex;
  gap: $spacing-md;
  align-items: center;
}

.anniversary-date {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.date-day {
  font-size: 24px;
  font-weight: 700;
}

.date-month {
  font-size: $font-size-xs;
}

.anniversary-info {
  flex: 1;
}

.anniversary-name {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
  display: block;
}

.anniversary-bond {
  font-size: $font-size-xs;
  color: $text-muted;
  display: block;
  margin-top: 2px;
}

.days-left {
  margin-top: $spacing-xs;
}

.days-badge {
  padding: 2px $spacing-sm;
  background: rgba($accent-warm, 0.15);
  color: $accent-warm;
  border-radius: $radius-xl;
  font-size: $font-size-xs;
  font-weight: 600;
  
  &.today {
    background: $accent-warm;
    color: white;
  }
}

/* 里程碑时间轴 */
.timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
}

.marker-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.marker-line {
  width: 2px;
  flex: 1;
  min-height: 20px;
  background: linear-gradient(to bottom, $border-color, transparent);
  margin-top: $spacing-xs;
}

.timeline-content {
  flex: 1;
  
  &.post { border-left: 3px solid #FFB6C1; }
  &.coincidence { border-left: 3px solid #FFD700; }
  &.task { border-left: 3px solid #90EE90; }
  &.milestone { border-left: 3px solid $accent-warm; }
  &.anniversary { border-left: 3px solid #FF69B4; }
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xs;
}

.timeline-date {
  font-size: $font-size-xs;
  color: $text-muted;
  font-family: $font-mono;
}

.timeline-badge {
  padding: 2px $spacing-sm;
  border-radius: $radius-xl;
  font-size: $font-size-xs;
  
  &.post { background: rgba(#FFB6C1, 0.2); color: #FF69B4; }
  &.coincidence { background: rgba(#FFD700, 0.2); color: #FFA500; }
  &.task { background: rgba(#90EE90, 0.2); color: $accent-green; }
  &.milestone { background: rgba($accent-warm, 0.2); color: $accent-warm; }
  &.anniversary { background: rgba(#FF69B4, 0.2); color: #FF69B4; }
}

.timeline-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
  display: block;
}

.timeline-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
  display: block;
  margin-top: $spacing-xs;
}

.milestone-date {
  font-size: $font-size-xs;
  color: $text-muted;
  font-family: $font-mono;
  display: block;
  margin-bottom: $spacing-xs;
}

.milestone-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
  display: block;
}

.milestone-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
  display: block;
  margin-top: $spacing-xs;
}

.milestone-type {
  margin-top: $spacing-sm;
  font-size: $font-size-xs;
  
  &.system {
    color: $accent-warm;
  }
  
  &.custom {
    color: $accent-green;
  }
}

/* 纪念日列表（简化版） */
.anniversary-item-simple {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-md;
  margin-bottom: $spacing-sm;
}

.anniversary-date-small {
  width: 50px;
  text-align: center;
  font-size: $font-size-sm;
  color: $text-muted;
}

.anniversary-info {
  flex: 1;
}

.anniversary-desc {
  font-size: $font-size-xs;
  color: $text-muted;
  display: block;
  margin-top: 2px;
}

.anniversary-actions {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.yearly-badge {
  padding: 2px $spacing-sm;
  background: rgba($accent-green, 0.15);
  color: $accent-green;
  border-radius: $radius-xl;
  font-size: $font-size-xs;
}

.delete-btn {
  font-size: 20px;
  color: $text-muted;
  padding: $spacing-xs;
}

/* 空状态 */
.empty-state-small {
  text-align: center;
  padding: $spacing-xl;
}

.empty-icon {
  font-size: 40px;
  display: block;
  margin-bottom: $spacing-sm;
}

.empty-text {
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

.modal-body {
  padding: $spacing-lg;
}

.form-item {
  margin-bottom: $spacing-lg;
}

.form-label {
  font-size: $font-size-sm;
  color: $text-secondary;
  display: block;
  margin-bottom: $spacing-sm;
}

.form-input {
  width: 100%;
  padding: $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-md;
  font-size: $font-size-md;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid $border-color;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.checked {
    background: $accent-warm;
    border-color: $accent-warm;
    color: white;
  }
}

.checkbox-label {
  font-size: $font-size-sm;
  color: $text-primary;
}

.modal-footer {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg;
  border-top: 1px solid $border-color;
}

.btn-cancel {
  flex: 1;
  padding: $spacing-md;
  background: $bg-secondary;
  border-radius: $radius-md;
  font-size: $font-size-md;
  color: $text-secondary;
}

.btn-primary {
  flex: 1;
  padding: $spacing-md;
  background: linear-gradient(135deg, $accent-warm, $accent-coral);
  border-radius: $radius-md;
  font-size: $font-size-md;
  font-weight: 600;
  color: white;
  border: none;
}
</style>
