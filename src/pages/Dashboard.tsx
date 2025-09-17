import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { StudyStats, WeeklyStudyTime, StudyTask, Book } from "../types";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);

  // モックデータの生成
  useEffect(() => {
    if (!user) return;

    // 試験日までの日数を計算
    // const examDate = new Date(user.examDate);
    // const today = new Date();
    // const diffTime = examDate.getTime() - today.getTime();
    // const daysUntilExam = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 週間学習時間データ（月〜日）
    const weeklyData: WeeklyStudyTime[] = [
      { day: "月", date: "12/16", studyTime: 120, isToday: false },
      { day: "火", date: "12/17", studyTime: 90, isToday: false },
      { day: "水", date: "12/18", studyTime: 150, isToday: true },
      { day: "木", date: "12/19", studyTime: 0, isToday: false },
      { day: "金", date: "12/20", studyTime: 0, isToday: false },
      { day: "土", date: "12/21", studyTime: 0, isToday: false },
      { day: "日", date: "12/22", studyTime: 0, isToday: false },
    ];

    // 週間タスクデータ
    const weeklyTasks: StudyTask[] = [
      { id: "1", name: "午前問題 第1章", completed: true, category: "午前問題", estimatedTime: 60, week: 1, dueDate: "2024-12-20" },
      { id: "2", name: "午前問題 第2章", completed: true, category: "午前問題", estimatedTime: 60, week: 1, dueDate: "2024-12-20" },
      { id: "3", name: "午後問題 アルゴリズム", completed: false, category: "午後問題", estimatedTime: 90, week: 1, dueDate: "2024-12-21" },
      { id: "4", name: "プログラミング基礎", completed: false, category: "プログラミング", estimatedTime: 120, week: 1, dueDate: "2024-12-22" },
      { id: "5", name: "模擬試験1", completed: false, category: "模擬試験", estimatedTime: 180, week: 1, dueDate: "2024-12-23" },
    ];

    const mockStats: StudyStats = {
      totalStudyTime: user.totalStudyTime,
      continuousDays: user.continuousDays,
      todayStudyTime: 150, // 今日の学習時間
      scheduleAchievementRate: 75, // スケジュール達成率
      weeklyStudyTime: weeklyData,
      weeklyTasks: weeklyTasks,
      taskAchievementRate: 40, // 2/5 完了
    };

    setStats(mockStats);

    // 推奨書籍データ
    const books: Book[] = [
      {
        id: "1",
        title: "キタミ式イラストIT塾 基本情報技術者",
        author: "きたみりゅうじ",
        publisher: "技術評論社",
        isbn: "9784297124441",
        description: "イラストを豊富に使って、基本情報技術者試験の内容をわかりやすく解説",
        knowledgeLevel: "未経験",
        rating: 4.5,
        reviewCount: 1250,
        price: 2178,
        amazonUrl: "https://amazon.co.jp/example1"
      },
      {
        id: "2", 
        title: "令和06年 基本情報技術者 合格教本",
        author: "角谷一成",
        publisher: "技術評論社", 
        isbn: "9784297133832",
        description: "最新の試験傾向に対応した合格のための教本",
        knowledgeLevel: "基礎知識あり",
        rating: 4.2,
        reviewCount: 890,
        price: 1738,
        amazonUrl: "https://amazon.co.jp/example2"
      },
      {
        id: "3",
        title: "基本情報技術者 午後・アルゴリズム編",
        author: "福嶋先生",
        publisher: "SBクリエイティブ",
        isbn: "9784815606350", 
        description: "午後試験のアルゴリズム問題に特化した対策書",
        knowledgeLevel: "実務経験あり",
        rating: 4.7,
        reviewCount: 567,
        price: 2420,
        amazonUrl: "https://amazon.co.jp/example3"
      }
    ];

    setRecommendedBooks(books);
  }, [user]);

  if (!user || !stats) {
    return <div>Loading...</div>;
  }

  // 試験日までの日数を計算
  const examDate = new Date(user.examDate);
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  const daysUntilExam = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // 完了したタスク数を計算
  const completedTasks = stats.weeklyTasks.filter(task => task.completed).length;
  const totalTasks = stats.weeklyTasks.length;

  return (
    <div className="space-y-8">
      {/* 1. 試験日カウントダウン（最上部） */}
      <div className="bg-white rounded-lg shadow-lg p-6 text-center" style={{ borderLeft: '4px solid #6482AD' }}>
        <h2 className="text-lg font-medium text-gray-900 mb-2">基本情報技術者試験まで</h2>
        <div className="text-5xl font-bold mb-2" style={{ color: '#6482AD' }}>
          {daysUntilExam}
        </div>
        <div className="text-xl text-gray-600">日</div>
        <div className="text-sm text-gray-500 mt-2">
          試験日: {new Date(user.examDate).toLocaleDateString('ja-JP')}
        </div>
      </div>

      {/* 2. 自習室移動ボタン */}
      <div className="text-center">
        <button 
          className="px-8 py-4 rounded-lg text-white font-medium text-lg shadow-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#F564A9' }}
          onClick={() => window.location.href = '/study-room'}
        >
          📚 オンライン自習室へ
        </button>
      </div>

      {/* 3. 学習統計エリア（4つの指標を横並び） */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: '#6482AD' }}>
            {Math.floor(stats.totalStudyTime / 60)}h
          </div>
          <div className="text-sm text-gray-600 mt-1">総学習時間</div>
          <div className="text-xs text-gray-500">（1週間）</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: '#6482AD' }}>
            {stats.continuousDays}
          </div>
          <div className="text-sm text-gray-600 mt-1">継続日数</div>
          <div className="text-xs text-gray-500">（累計）</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: '#6482AD' }}>
            {Math.floor(stats.todayStudyTime / 60)}h{stats.todayStudyTime % 60}m
          </div>
          <div className="text-sm text-gray-600 mt-1">今日の学習時間</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: '#6482AD' }}>
            {stats.scheduleAchievementRate}%
          </div>
          <div className="text-sm text-gray-600 mt-1">スケジュール達成率</div>
          <div className="text-xs text-gray-500">（全体）</div>
        </div>
      </div>

      {/* 4. 1週間学習時間グラフと1週間学習タスクを横並び */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 1週間学習時間グラフ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">1週間学習時間</h3>
          <div className="space-y-2">
            {stats.weeklyStudyTime.map((day, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 text-sm text-gray-600">{day.day}</div>
                <div className="w-16 text-xs text-gray-500">{day.date}</div>
                <div className="flex-1 mx-2">
                  <div className="bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="rounded-full h-4 transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (day.studyTime / 180) * 100)}%`,
                        backgroundColor: day.isToday ? '#F564A9' : '#9ECAD6'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-medium text-gray-900">
                  {Math.floor(day.studyTime / 60)}h
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1週間学習タスク */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">1週間学習タスク</h3>
          <div className="space-y-3">
            {stats.weeklyTasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  readOnly
                  className="h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: '#6482AD' }}
                />
                <span 
                  className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                >
                  {task.name}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {task.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. 学習タスク達成率グラフ */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">学習タスク達成率</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#6482AD"
                strokeWidth="2"
                strokeDasharray={`${(completedTasks / totalTasks) * 100}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: '#6482AD' }}>
                  {Math.round((completedTasks / totalTasks) * 100)}%
                </div>
                <div className="text-xs text-gray-500">
                  {completedTasks}/{totalTasks}完了
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. おすすめ参考書エリア */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">おすすめ参考書</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {["未経験", "基礎知識あり", "実務経験あり"].map((level) => {
            const book = recommendedBooks.find(b => b.knowledgeLevel === level);
            return (
              <button
                key={level}
                className="p-4 rounded-lg border-2 border-gray-200 hover:border-opacity-50 transition-colors text-left"
                style={{ 
                  borderColor: user.knowledgeLevel === level ? '#6482AD' : '#E5E7EB',
                  backgroundColor: user.knowledgeLevel === level ? '#FFEAEA' : 'white'
                }}
              >
                <div className="text-sm font-medium mb-2" style={{ color: '#6482AD' }}>
                  {level}ボタン
                </div>
                {book && (
                  <div className="text-xs text-gray-600">
                    <div className="font-medium">{book.title}</div>
                    <div className="mt-1">★{book.rating} ({book.reviewCount}件)</div>
                    <div className="mt-1">¥{book.price.toLocaleString()}</div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
