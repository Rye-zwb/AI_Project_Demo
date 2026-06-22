// Mock数据管理
import type { User, Bond, Post, Task, Achievement, Vlog } from '../types';

// 生成唯一ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 初始化Mock数据
export const initMockData = () => {
  // 检查是否已有数据
  const hasData = uni.getStorageSync('pt_has_data');
  if (hasData) return;

  // 创建3个Demo用户
  const users: User[] = [
    {
      id: 'user_1',
      nickname: '小旅',
      avatar: '/static/avatars/xiaolv.svg',
      city: '上海',
      status: '在寻找生活中的小确幸',
      tags: ['咖啡依赖', '周末探险家', '夜猫子'],
      createdAt: new Date('2026-01-15').toISOString(),
    },
    {
      id: 'user_2',
      nickname: '阿行',
      avatar: '/static/avatars/ahxing.svg',
      city: '北京',
      status: '今天也要加油鸭',
      tags: ['美食猎人', '早起困难户', '摄影爱好者'],
      createdAt: new Date('2026-01-20').toISOString(),
    },
    {
      id: 'user_3',
      nickname: '漫漫',
      avatar: '/static/avatars/manman.svg',
      city: '成都',
      status: '慢生活，慢享受',
      tags: ['火锅控', '铲屎官', '手工达人'],
      createdAt: new Date('2026-02-01').toISOString(),
    },
  ];

  // 创建羁绊关系
  const bonds: Bond[] = [
    {
      id: 'bond_1',
      userId1: 'user_1',
      userId2: 'user_2',
      bondName: '美食搭子',
      createdAt: new Date('2026-01-25').toISOString(),
      bondValue: 78,
      impressions: {
        'user_1': { tags: ['靠谱', '幽默', '细心'], description: '总是能在最需要的时候出现' },
        'user_2': { tags: ['温暖', '有趣', '治愈'], description: '和她聊天总是很开心' },
      },
      milestones: [
        { id: 'ms_1', date: '2026-01-25', title: '羁绊建立', description: '成为了平行旅人', type: 'system' },
        { id: 'ms_2', date: '2026-02-14', title: '第一个默契发现', description: '同一天都吃了火锅', type: 'system' },
        { id: 'ms_3', date: '2026-03-01', title: '一起完成10个任务', description: '默契度提升！', type: 'system' },
      ],
      anniversaries: [
        { id: 'ann_1', date: '2026-01-25', name: '羁绊建立日', description: '我们成为平行旅人的日子', isYearly: true, type: 'know' },
        { id: 'ann_2', date: '2026-02-14', name: '第一个默契', description: '同一天都吃了火锅', isYearly: false, type: 'milestone' },
      ],
    },
    {
      id: 'bond_2',
      userId1: 'user_1',
      userId2: 'user_3',
      bondName: '手工姐妹',
      createdAt: new Date('2026-02-10').toISOString(),
      bondValue: 65,
      impressions: {
        'user_1': { tags: ['文艺', '温柔', '有才华'], description: '手工做得超棒' },
        'user_3': { tags: ['开朗', '有活力', '贴心'], description: '总是分享有趣的事情' },
      },
      milestones: [
        { id: 'ms_4', date: '2026-02-10', title: '羁绊建立', description: '成为了平行旅人', type: 'system' },
      ],
      anniversaries: [
        { id: 'ann_3', date: '2026-02-10', name: '相识纪念日', isYearly: true, type: 'know' },
      ],
    },
  ];

  // 创建羁绊空间帖子
  const posts: Post[] = [
    {
      id: 'post_1',
      userId: 'user_1',
      content: '今天路过一家很可爱的咖啡店，窗外的阳光刚刚好☕️',
      images: ['/static/posts/coffee.svg'],
      mood: '开心',
      tags: ['咖啡', '午后时光'],
      createdAt: new Date('2026-06-16T14:30:00').toISOString(),
      likes: 2,
      isSnapshot: true,
      visibility: 'public',
    },
    {
      id: 'post_2',
      userId: 'user_2',
      content: '加班到很晚，但是看到了超美的夜景🌃',
      images: ['/static/posts/night.svg'],
      mood: '平静',
      tags: ['夜景', '加班日常'],
      createdAt: new Date('2026-06-16T21:00:00').toISOString(),
      likes: 1,
      isSnapshot: true,
      visibility: 'friends',
    },
    {
      id: 'post_3',
      userId: 'user_3',
      content: '今天做了手工饼干，虽然形状有点奇怪但是很好吃🍪',
      images: ['/static/posts/cookie.svg'],
      mood: '满足',
      tags: ['烘焙', '手工'],
      createdAt: new Date('2026-06-16T16:00:00').toISOString(),
      likes: 2,
      isSnapshot: false,
      visibility: 'bond',
      visibleBondIds: ['bond_2'],
    },
    {
      id: 'post_4',
      userId: 'user_1',
      content: '今天吃了麦当劳的新品汉堡，还不错！',
      images: [],
      mood: '开心',
      tags: ['美食', '麦当劳'],
      createdAt: new Date('2026-06-17T12:00:00').toISOString(),
      likes: 0,
      isSnapshot: true,
      visibility: 'private',
    },
    {
      id: 'post_5',
      userId: 'user_2',
      content: '午餐吃了麦当劳，人好多啊',
      images: ['/static/posts/mcdonalds.svg'],
      mood: '无奈',
      tags: ['美食', '麦当劳'],
      createdAt: new Date('2026-06-17T12:30:00').toISOString(),
      likes: 1,
      isSnapshot: true,
      visibility: 'public',
    },
  ];

  // 创建任务
  const tasks: Task[] = [
    {
      id: 'task_1',
      type: 'text',
      title: '记录3件今天的小确幸',
      description: '写下今天让你开心的3件小事，无论多小都可以',
      completed: false,
      completedBy: [],
      ignoredBy: [],
      createdBy: 'system',
      createdAt: new Date('2026-06-17').toISOString(),
      deadline: new Date('2026-06-18').toISOString(),
    },
    {
      id: 'task_2',
      type: 'photo',
      title: '拍一张窗外的天空',
      description: '抬头看看天空，记录下这一刻的颜色',
      completed: false,
      completedBy: [],
      ignoredBy: [],
      createdBy: 'system',
      createdAt: new Date('2026-06-17').toISOString(),
      deadline: new Date('2026-06-18').toISOString(),
    },
    {
      id: 'task_3',
      type: 'explore',
      title: '探索一条没走过的小路',
      description: '今天回家或出门时，选择一条从未走过的小路',
      completed: false,
      completedBy: [],
      ignoredBy: [],
      createdBy: 'system',
      createdAt: new Date('2026-06-17').toISOString(),
      deadline: new Date('2026-06-20').toISOString(),
    },
    {
      id: 'task_4',
      type: 'photo',
      title: '挑战：拍摄日出或日落',
      description: '找到一处可以看到日出或日落的地方，拍下这一刻',
      completed: false,
      completedBy: [],
      ignoredBy: [],
      createdBy: 'system',
      createdAt: new Date('2026-06-17').toISOString(),
      isChallenge: true,
      challengeReward: '隐藏成就：追光者 + 限定头像框',
    },
  ];

  // 创建成就
  const achievements: Achievement[] = [
    {
      id: 'ach_1',
      title: '初次记录',
      description: '发布了第一条羁绊空间动态',
      icon: '📝',
      unlocked: true,
      unlockedAt: new Date('2026-01-25').toISOString(),
      progress: 1,
      total: 1,
    },
    {
      id: 'ach_2',
      title: '默契发现',
      description: '首次发现与好友的默契瞬间',
      icon: '✨',
      unlocked: true,
      unlockedAt: new Date('2026-02-14').toISOString(),
      progress: 1,
      total: 1,
    },
    {
      id: 'ach_3',
      title: '任务达人',
      description: '完成10个同步任务',
      icon: '🎯',
      unlocked: false,
      progress: 3,
      total: 10,
    },
    {
      id: 'ach_4',
      title: '百日羁绊',
      description: '与好友建立羁绊100天',
      icon: '💝',
      unlocked: false,
      progress: 78,
      total: 100,
    },
    {
      id: 'ach_5',
      title: '摄影师',
      description: '发布20张带图片的动态',
      icon: '📸',
      unlocked: false,
      progress: 8,
      total: 20,
    },
    {
      id: 'ach_6',
      title: '故事王',
      description: '发布50条羁绊空间动态',
      icon: '📚',
      unlocked: false,
      progress: 12,
      total: 50,
    },
    {
      id: 'ach_7',
      title: '冒险家',
      description: '完成5个探索类任务',
      icon: '🗺️',
      unlocked: false,
      progress: 1,
      total: 5,
    },
    {
      id: 'ach_8',
      title: '人气王',
      description: '获得50个点赞',
      icon: '👑',
      unlocked: false,
      progress: 15,
      total: 50,
    },
    {
      id: 'ach_9',
      title: '追光者',
      description: '???',
      icon: '🌅',
      unlocked: false,
      progress: 0,
      total: 1,
      isHidden: true,
      reward: '限定头像框：日出追逐者',
    },
  ];

  // 创建Vlog
  const vlogs: Vlog[] = [
    {
      id: 'vlog_1',
      title: '平行世界 · 第1周',
      subtitle: '2026.01.20 - 2026.01.26',
      cover: '/static/posts/vlog1.svg',
      scenes: [
        { image: '/static/posts/coffee.svg', caption: '小旅的咖啡时光', date: '01.21' },
        { image: '/static/posts/night.svg', caption: '阿行的夜景', date: '01.23' },
        { image: '/static/posts/cookie.svg', caption: '漫漫的手工饼干', date: '01.25' },
        { image: '/static/posts/sky.svg', caption: '一起看的天空', date: '01.24' },
        { image: '/static/posts/food.svg', caption: '各自的午餐', date: '01.22' },
      ],
      bgm: '轻快活泼 BGM',
      bgmStyle: 'happy',
      likes: 12,
      comments: 5,
      userId: 'user_1',
      createdAt: new Date('2026-01-27').toISOString(),
    },
    {
      id: 'vlog_2',
      title: '默契时刻 · 周末',
      subtitle: '和阿行一起的周末',
      cover: '/static/posts/vlog2.svg',
      scenes: [
        { image: '/static/posts/morning.svg', caption: '清晨的阳光', date: '01.25' },
        { image: '/static/posts/park.svg', caption: '公园散步', date: '01.25' },
        { image: '/static/posts/sunset.svg', caption: '日落时分', date: '01.25' },
        { image: '/static/posts/star.svg', caption: '夜晚的星星', date: '01.25' },
      ],
      bgm: '浪漫氛围 BGM',
      bgmStyle: 'romantic',
      likes: 28,
      comments: 12,
      userId: 'user_1',
      createdAt: new Date('2026-01-28').toISOString(),
    },
  ];

  // 创建好友印象
  const impressions: UserImpression[] = [
    {
      friendId: 'user_1',
      friendName: '小旅',
      friendAvatar: '/static/avatars/xiaolv.svg',
      tags: ['温暖', '靠谱', '美食达人'],
      comment: '每次和她聊天都很开心，是个超级温暖的人！而且她推荐的餐厅从来不会踩雷~',
      date: '2026-01-20',
    },
    {
      friendId: 'user_1',
      friendName: '漫漫',
      friendAvatar: '/static/avatars/manman.svg',
      tags: ['细心', '有才华', '艺术家气质'],
      comment: '感觉她对生活很有自己的见解，总是能发现生活中美好的一面',
      date: '2026-01-18',
    },
  ];

  // 保存到本地存储
  uni.setStorageSync('pt_users', users);
  uni.setStorageSync('pt_bonds', bonds);
  uni.setStorageSync('pt_posts', posts);
  uni.setStorageSync('pt_tasks', tasks);
  uni.setStorageSync('pt_achievements', achievements);
  uni.setStorageSync('pt_vlogs', vlogs);
  uni.setStorageSync('pt_impressions', impressions);
  uni.setStorageSync('pt_current_user', 'user_1');
  uni.setStorageSync('pt_has_data', true);
};

// 获取当前用户
export const getCurrentUser = (): User | null => {
  const userId = uni.getStorageSync('pt_current_user');
  if (!userId) return null;
  const users: User[] = uni.getStorageSync('pt_users') || [];
  return users.find(u => u.id === userId) || null;
};

// 切换当前用户
export const switchUser = (userId: string) => {
  uni.setStorageSync('pt_current_user', userId);
};

// 获取所有用户
export const getAllUsers = (): User[] => {
  return uni.getStorageSync('pt_users') || [];
};

// 获取用户的好友
export const getUserFriends = (userId: string): User[] => {
  const bonds: Bond[] = uni.getStorageSync('pt_bonds') || [];
  const users: User[] = uni.getStorageSync('pt_users') || [];
  
  const friendIds = bonds
    .filter(b => b.userId1 === userId || b.userId2 === userId)
    .map(b => b.userId1 === userId ? b.userId2 : b.userId1);
  
  return users.filter(u => friendIds.includes(u.id));
};

// 获取羁绊空间帖子
export const getPosts = (): Post[] => {
  return uni.getStorageSync('pt_posts') || [];
};

// 添加帖子
export const addPost = (post: Post) => {
  const posts: Post[] = uni.getStorageSync('pt_posts') || [];
  posts.unshift(post);
  uni.setStorageSync('pt_posts', posts);
};

// 删除帖子
export const deletePost = (postId: string) => {
  const posts: Post[] = uni.getStorageSync('pt_posts') || [];
  const filtered = posts.filter(p => p.id !== postId);
  uni.setStorageSync('pt_posts', filtered);
};

// 获取任务
export const getTasks = (): Task[] => {
  return uni.getStorageSync('pt_tasks') || [];
};

// 完成任务
export const completeTask = (taskId: string, userId: string) => {
  const tasks: Task[] = uni.getStorageSync('pt_tasks') || [];
  const task = tasks.find(t => t.id === taskId);
  if (task && !task.completedBy.includes(userId)) {
    task.completedBy.push(userId);
    task.completed = true;
    uni.setStorageSync('pt_tasks', tasks);
  }
};

// 忽略任务
export const ignoreTask = (taskId: string, userId: string) => {
  const tasks: Task[] = uni.getStorageSync('pt_tasks') || [];
  const task = tasks.find(t => t.id === taskId);
  if (task && !task.ignoredBy.includes(userId)) {
    task.ignoredBy.push(userId);
    uni.setStorageSync('pt_tasks', tasks);
  }
};

// 创建自定义任务
export const createCustomTask = (task: Task) => {
  const tasks: Task[] = uni.getStorageSync('pt_tasks') || [];
  tasks.push(task);
  uni.setStorageSync('pt_tasks', tasks);
};

// 获取随机任务
export const getRandomTasks = (): Task[] => {
  const randomTaskPool = [
    { type: 'photo', title: '拍摄一处让你感到平静的角落', description: '可以是窗台、书桌、小植物...记录让你安心的瞬间' },
    { type: 'photo', title: '拍下今天的午餐', description: '不管吃的什么，认真拍一张' },
    { type: 'explore', title: '去便利店逛逛', description: '看看有没有什么新品或者有趣的小东西' },
    { type: 'text', title: '写下最近让你感恩的一件小事', description: '感恩日记，让生活更美好' },
    { type: 'creative', title: '用手机拍一张创意照片', description: '尝试不同的角度、光影、构图' },
    { type: 'explore', title: '找一家没去过的咖啡店坐坐', description: '探索你所在城市的小角落' },
    { type: 'photo', title: '记录天空的颜色', description: '日出、日落、蓝天、白云...今天的云像什么？' },
    { type: 'text', title: '给未来的自己写一句话', description: '可以是鼓励、期待、或者任何想说的话' },
    { type: 'creative', title: '尝试一道新菜谱', description: '哪怕只是一道简单的料理' },
    { type: 'explore', title: '在附近散步30分钟', description: '不走熟悉的路线，发现新风景' },
    { type: 'photo', title: '拍一张自拍照', description: '今天状态怎么样？记录下来' },
    { type: 'text', title: '联系一个很久没联系的朋友', description: '发一条消息，问问近况' },
  ];
  
  // 随机选择3个任务
  const shuffled = [...randomTaskPool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  
  return selected.map((t, idx) => ({
    ...t,
    id: `random_task_${generateId()}`,
    completed: false,
    completedBy: [],
    ignoredBy: [],
    createdBy: 'random',
    createdAt: new Date().toISOString(),
    isRandom: true,
    isChallenge: false,
  }));
};

// 获取用户的所有羁绊
export const getUserBonds = (userId: string): Bond[] => {
  const bonds: Bond[] = uni.getStorageSync('pt_bonds') || [];
  return bonds.filter(b => b.userId1 === userId || b.userId2 === userId);
};

// 根据ID获取羁绊
export const getBondById = (bondId: string): Bond | null => {
  const bonds: Bond[] = uni.getStorageSync('pt_bonds') || [];
  return bonds.find(b => b.id === bondId) || null;
};

// 获取羁绊好友
export const getBondFriend = (bond: Bond, currentUserId: string): User | null => {
  const friendId = bond.userId1 === currentUserId ? bond.userId2 : bond.userId1;
  const users: User[] = uni.getStorageSync('pt_users') || [];
  return users.find(u => u.id === friendId) || null;
};

// 获取羁绊名称（根据用户ID获取对应的羁绊名称）
export const getBondName = (bond: Bond, userId: string): string => {
  return bond.bondName || '平行旅人';
};

// 添加纪念日
export const addAnniversary = (bondId: string, anniversary: Anniversary): boolean => {
  const bonds: Bond[] = uni.getStorageSync('pt_bonds') || [];
  const bondIndex = bonds.findIndex(b => b.id === bondId);
  if (bondIndex === -1) return false;
  
  bonds[bondIndex].anniversaries.push(anniversary);
  uni.setStorageSync('pt_bonds', bonds);
  return true;
};

// 删除纪念日
export const deleteAnniversary = (bondId: string, anniversaryId: string): boolean => {
  const bonds: Bond[] = uni.getStorageSync('pt_bonds') || [];
  const bondIndex = bonds.findIndex(b => b.id === bondId);
  if (bondIndex === -1) return false;
  
  bonds[bondIndex].anniversaries = bonds[bondIndex].anniversaries.filter(a => a.id !== anniversaryId);
  uni.setStorageSync('pt_bonds', bonds);
  return true;
};

// 获取即将到来的纪念日（未来7天）
export const getUpcomingAnniversaries = (userId: string): { bond: Bond; anniversary: Anniversary; daysLeft: number }[] => {
  const bonds = getUserBonds(userId);
  const today = new Date();
  const upcoming: { bond: Bond; anniversary: Anniversary; daysLeft: number }[] = [];
  
  bonds.forEach(bond => {
    bond.anniversaries.forEach(ann => {
      let anniversaryDate = new Date(ann.date);
      if (ann.isYearly) {
        anniversaryDate.setFullYear(today.getFullYear());
        if (anniversaryDate < today) {
          anniversaryDate.setFullYear(today.getFullYear() + 1);
        }
      }
      
      const daysLeft = Math.ceil((anniversaryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft >= 0 && daysLeft <= 7) {
        upcoming.push({ bond, anniversary: ann, daysLeft });
      }
    });
  });
  
  return upcoming.sort((a, b) => a.daysLeft - b.daysLeft);
};

// 添加里程碑
export const addMilestone = (bondId: string, milestone: Milestone): boolean => {
  const bonds: Bond[] = uni.getStorageSync('pt_bonds') || [];
  const bondIndex = bonds.findIndex(b => b.id === bondId);
  if (bondIndex === -1) return false;
  
  bonds[bondIndex].milestones.push(milestone);
  // 更新羁绊值
  bonds[bondIndex].bondValue = Math.min(100, bonds[bondIndex].bondValue + 5);
  uni.setStorageSync('pt_bonds', bonds);
  return true;
};

// 获取成就
export const getAchievements = (): Achievement[] => {
  return uni.getStorageSync('pt_achievements') || [];
};

// 获取Vlog
export const getVlogs = (): Vlog[] => {
  return uni.getStorageSync('pt_vlogs') || [];
};

// 获取用户的好友印象
export interface UserImpression {
  friendId: string;
  friendName: string;
  friendAvatar: string;
  tags: string[];
  comment: string;
  date: string;
}

export const getUserImpressions = (userId: string): UserImpression[] => {
  const impressions: UserImpression[] = uni.getStorageSync('pt_impressions') || [];
  return impressions.filter(i => i.friendId !== userId);
};

// 设置用户对某人的印象
export const setImpression = (targetUserId: string, fromUserId: string, tags: string[], comment: string) => {
  const impressions: UserImpression[] = uni.getStorageSync('pt_impressions') || [];
  const users: User[] = uni.getStorageSync('pt_users') || [];
  const fromUser = users.find(u => u.id === fromUserId);
  
  if (!fromUser) return false;
  
  const existingIndex = impressions.findIndex(i => i.friendId === targetUserId && i.friendName === fromUser.nickname);
  
  const newImpression: UserImpression = {
    friendId: targetUserId,
    friendName: fromUser.nickname,
    friendAvatar: fromUser.avatar,
    tags,
    comment,
    date: new Date().toISOString().split('T')[0],
  };
  
  if (existingIndex > -1) {
    impressions[existingIndex] = newImpression;
  } else {
    impressions.push(newImpression);
  }
  
  uni.setStorageSync('pt_impressions', impressions);
  return true;
};

// AI默契发现（规则模拟）
export const findCoincidences = (userId: string): any[] => {
  const posts: Post[] = uni.getStorageSync('pt_posts') || [];
  const bonds: Bond[] = uni.getStorageSync('pt_bonds') || [];
  const users: User[] = uni.getStorageSync('pt_users') || [];
  
  const userBonds = bonds.filter(b => b.userId1 === userId || b.userId2 === userId);
  const coincidences: any[] = [];
  
  userBonds.forEach(bond => {
    const friendId = bond.userId1 === userId ? bond.userId2 : bond.userId1;
    const friend = users.find(u => u.id === friendId);
    
    const myPosts = posts.filter(p => p.userId === userId);
    const friendPosts = posts.filter(p => p.userId === friendId);
    
    // 关键词匹配
    const keywords = ['麦当劳', '咖啡', '火锅', '电影', '音乐', '加班'];
    keywords.forEach(keyword => {
      const myMatch = myPosts.find(p => p.content.includes(keyword) || p.tags.includes(keyword));
      const friendMatch = friendPosts.find(p => p.content.includes(keyword) || p.tags.includes(keyword));
      
      if (myMatch && friendMatch) {
        const myDate = new Date(myMatch.createdAt).toDateString();
        const friendDate = new Date(friendMatch.createdAt).toDateString();
        
        if (myDate === friendDate) {
          coincidences.push({
            id: `coin_${generateId()}`,
            type: 'keyword',
            title: `今天你们都提到了"${keyword}"`,
            description: `默契发现：你们在不同的地方，却有着相似的日常`,
            myPost: myMatch,
            friendPost: friendMatch,
            friend,
            createdAt: new Date().toISOString(),
          });
        }
      }
    });
    
    // 情绪共振
    const moodMap: Record<string, string[]> = {
      '开心': ['开心', '兴奋', '满足'],
      '平静': ['平静', '放松', '惬意'],
      '疲惫': ['疲惫', '累', '困'],
    };
    
    myPosts.forEach(myPost => {
      friendPosts.forEach(friendPost => {
        const myDate = new Date(myPost.createdAt).toDateString();
        const friendDate = new Date(friendPost.createdAt).toDateString();
        
        if (myDate === friendDate && myPost.mood === friendPost.mood) {
          const exists = coincidences.find(c => 
            c.type === 'mood' && 
            c.myPost.id === myPost.id && 
            c.friendPost.id === friendPost.id
          );
          if (!exists) {
            coincidences.push({
              id: `coin_${generateId()}`,
              type: 'mood',
              title: `今天你们的心情都是"${myPost.mood}"`,
              description: `情绪共振：即使相隔千里，情绪却奇妙地同步了`,
              myPost,
              friendPost,
              friend,
              createdAt: new Date().toISOString(),
            });
          }
        }
      });
    });
    
    // 图片主题匹配
    const themeKeywords: Record<string, { keywords: string[], title: string }> = {
      sky: { 
        keywords: ['天空', '云朵', '云', '蓝天', '晚霞', '日出', '日落'], 
        title: '今天你们都拍了天空' 
      },
      food: { 
        keywords: ['美食', '午餐', '晚餐', '早餐', '吃', '餐厅', '厨房'], 
        title: '今天你们都分享了美食' 
      },
      pet: { 
        keywords: ['猫', '狗', '宠物', '萌宠'], 
        title: '今天你们都晒了宠物' 
      },
      nature: { 
        keywords: ['风景', '自然', '山', '海', '公园', '花', '树'], 
        title: '今天你们都走进了自然' 
      },
    };
    
    Object.entries(themeKeywords).forEach(([theme, config]) => {
      const myMatch = myPosts.find(p => 
        p.content && config.keywords.some(k => p.content!.includes(k)) || 
        p.tags.some(t => config.keywords.includes(t)) ||
        p.image
      );
      const friendMatch = friendPosts.find(p => 
        p.content && config.keywords.some(k => p.content!.includes(k)) || 
        p.tags.some(t => config.keywords.includes(t)) ||
        p.image
      );
      
      if (myMatch && friendMatch) {
        const myDate = new Date(myMatch.createdAt).toDateString();
        const friendDate = new Date(friendMatch.createdAt).toDateString();
        
        if (myDate === friendDate) {
          const exists = coincidences.find(c => 
            c.type === 'theme' && 
            c.myPost.id === myMatch.id && 
            c.friendPost.id === friendMatch.id
          );
          if (!exists) {
            coincidences.push({
              id: `coin_${generateId()}`,
              type: 'theme',
              title: config.title,
              description: `默契发现：你们在不同的地方，却拍了相似的风景`,
              myPost: myMatch,
              friendPost: friendMatch,
              friend,
              createdAt: new Date().toISOString(),
            });
          }
        }
      }
    });
  });
  
  return coincidences.slice(0, 5); // 最多返回5个
};
