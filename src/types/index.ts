// 用户
export interface User {
  id: string;
  nickname: string;
  avatar: string;
  city: string;
  status: string;
  tags: string[];
  createdAt: string;
  ipLocation?: string;
  occupation?: string;
  birthdaySolar?: string;
  birthdayLunar?: string;
  gender?: 'male' | 'female' | 'other';
}

// 印象
export interface Impression {
  tags: string[];
  description: string;
}

// 里程碑
export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'system' | 'custom'; // 系统生成 or 用户自定义
}

// 纪念日
export interface Anniversary {
  id: string;
  date: string;
  name: string;
  description?: string;
  isYearly: boolean; // 是否每年重复
  type: 'know' | 'meet' | 'milestone' | 'custom'; // 相识/相遇/里程碑/自定义
}

// 羁绊关系
export interface Bond {
  id: string;
  userId1: string;
  userId2: string;
  bondName: string; // 羁绊名称，如"大学同学"、"发小"、"富婆们"等
  createdAt: string;
  bondValue: number;
  impressions: Record<string, Impression>;
  milestones: Milestone[];
  anniversaries: Anniversary[];
}

// 羁绊空间帖子
export interface Post {
  id: string;
  userId: string;
  content: string;
  images: string[];
  mood: string;
  tags: string[];
  createdAt: string;
  likes: number;
  isSnapshot: boolean;
  visibility: 'public' | 'friends' | 'bond' | 'private'; // 公开/好友/指定羁绊/仅自己
  visibleBondIds?: string[]; // 当visibility为bond时，指定可见的羁绊ID列表
}

// 任务
export interface Task {
  id: string;
  type: 'text' | 'photo' | 'voice' | 'creative' | 'explore';
  title: string;
  description: string;
  completed: boolean;
  completedBy: string[]; // 已完成的用户ID列表
  ignoredBy: string[]; // 忽略的用户ID列表
  createdAt: string;
  deadline?: string; // 可选，不限时间
  isChallenge?: boolean; // 是否是挑战任务
  challengeReward?: string; // 挑战奖励描述
  createdBy: string; // 创建者ID
  invitedUsers?: string[]; // 邀请参与的用户ID列表
  isCustom?: boolean; // 是否是自定义任务
  isRandom?: boolean; // 是否是随机生成的任务
}

// 任务偏好设置
export interface TaskPreference {
  userId: string;
  preferredTypes: ('text' | 'photo' | 'voice' | 'creative' | 'explore')[];
  difficulty: 'easy' | 'medium' | 'hard' | 'random';
  frequency: 'daily' | 'weekly' | 'custom';
}

// 成就
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  total: number;
  isHidden?: boolean; // 是否是隐藏成就
  reward?: string; // 奖励描述
}

// Vlog场景
export interface VlogScene {
  image: string;
  caption: string;
  date: string;
}

// Vlog
export interface Vlog {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  scenes: VlogScene[];
  bgm: string;
  bgmStyle: 'happy' | 'calm' | 'energetic' | 'romantic';
  likes: number;
  comments: number;
  createdAt: string;
  userId: string;
}

// 默契发现
export interface Coincidence {
  id: string;
  type: 'keyword' | 'mood' | 'behavior' | 'theme';
  title: string;
  description: string;
  myPost: Post;
  friendPost: Post;
  friend: User;
  createdAt: string;
}
