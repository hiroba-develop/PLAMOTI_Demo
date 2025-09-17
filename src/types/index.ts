// PLAMOTI - 基本情報技術者試験対策アプリの型定義

// ユーザー関連の型定義
export interface User {
  id: string;
  email: string;
  nickname: string;
  examDate: string; // 試験予定日
  knowledgeLevel: KnowledgeLevel;
  profileImage?: string;
  oneLineComment?: string;
  totalStudyTime: number; // 総学習時間（分）
  continuousDays: number; // 継続日数
  createdAt: Date;
  lastLogin: Date;
}

export type KnowledgeLevel = "未経験" | "基礎知識あり" | "実務経験あり";

// 学習記録関連の型定義
export interface StudyRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  studyTime: number; // 学習時間（分）
  tasks: StudyTask[];
  createdAt: Date;
}

export interface StudyTask {
  id: string;
  name: string;
  completed: boolean;
  category: TaskCategory;
  estimatedTime: number; // 予想時間（分）
  actualTime?: number; // 実際の時間（分）
  week: number; // 週番号
  dueDate: string; // 期限日
}

export type TaskCategory = "午前問題" | "午後問題" | "プログラミング" | "復習" | "模擬試験" | "その他";

// 統計データの型定義
export interface StudyStats {
  totalStudyTime: number; // 総学習時間（分）
  continuousDays: number; // 継続日数
  todayStudyTime: number; // 今日の学習時間（分）
  scheduleAchievementRate: number; // スケジュール達成率（%）
  weeklyStudyTime: WeeklyStudyTime[];
  weeklyTasks: StudyTask[];
  taskAchievementRate: number; // タスク達成率（%）
}

export interface WeeklyStudyTime {
  day: string; // 曜日（月、火、水...）
  date: string; // 日付（MM/DD）
  studyTime: number; // 学習時間（分）
  isToday: boolean;
}

// オンライン自習室関連の型定義
export interface StudyRoom {
  onlineUsers: number; // オンライン人数
  dailyMessage: string; // 日替わりメッセージ
  supportMessages: SupportMessage[]; // 応援メッセージ
}

export interface SupportMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
}

export interface SOSRequest {
  id: string;
  userId: string;
  situation: SOSSituation;
  timestamp: Date;
  resolved: boolean;
}

export type SOSSituation = "やる気が出ない" | "集中が切れた" | "その他";

// 質問箱関連の型定義
export interface Question {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  category: QuestionCategory;
  answers: Answer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  username: string;
  content: string;
  helpful: number; // いいね数
  createdAt: Date;
}

export type QuestionCategory = "午前問題" | "午後問題" | "プログラミング" | "学習方法" | "試験対策" | "その他";

// ランキング関連の型定義
export interface RankingData {
  category: RankingCategory;
  rankings: UserRanking[];
  userRanking?: UserRanking; // 自分の順位
}

export interface UserRanking {
  rank: number;
  userId: string;
  username: string;
  score: number;
  reactions: ReactionCount;
}

export interface ReactionCount {
  like: number;
  support: number;
  applause: number;
}

export type RankingCategory = "総学習時間" | "継続日数" | "今日の学習時間";

// 参考書関連の型定義
export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  description: string;
  coverImage?: string;
  knowledgeLevel: KnowledgeLevel;
  rating: number; // 評価（1-5）
  reviewCount: number;
  price: number;
  amazonUrl?: string;
}

// 設定関連の型定義
export interface UserSettings {
  profileImage?: string;
  nickname: string;
  oneLineComment: string;
  examDate: string;
  knowledgeLevel: KnowledgeLevel;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  reminderEnabled: boolean; // リマインド通知
  emailEnabled: boolean; // メール配信設定
  weeklyProgressAlert: boolean; // 1週間進捗滞り通知
  focusModeEnabled: boolean; // 集中モード
  sleepModePrompt: boolean; // おやすみモード促進
  studyStartNotification: boolean; // 学習開始通知
}

// APIレスポンス関連の型定義
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// チャート関連の型定義
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData extends ChartData {
  date: string;
  target?: number;
  actual?: number;
}

// アラート関連の型定義
export interface Alert {
  id: number;
  type: AlertType;
  title: string;
  message: string;
  severity: AlertSeverity;
  createdAt: Date;
  read: boolean;
  actionUrl?: string;
}

export type AlertType =
  | "target_miss"
  | "revenue_drop"
  | "expense_increase"
  | "system"
  | "reminder";
export type AlertSeverity = "low" | "medium" | "high" | "critical";

// 認証関連の型定義
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  examDate: string;
  knowledgeLevel: KnowledgeLevel;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// タイマー関連の型定義
export interface StudyTimer {
  isRunning: boolean;
  startTime?: Date;
  pausedTime: number; // 一時停止中の累計時間（分）
  currentSession: number; // 現在のセッション時間（分）
}
