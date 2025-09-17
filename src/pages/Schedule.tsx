import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { StudyTask } from "../types";

const Schedule = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    if (!user) return;

    // モックデータ：週別学習タスク
    const mockTasks: StudyTask[] = [
      // 第1週
      { id: "1", name: "基礎理論 - 数値表現", completed: true, category: "午前問題", estimatedTime: 60, week: 1, dueDate: "2024-12-18" },
      { id: "2", name: "基礎理論 - 論理演算", completed: true, category: "午前問題", estimatedTime: 60, week: 1, dueDate: "2024-12-19" },
      { id: "3", name: "コンピュータシステム - CPU", completed: false, category: "午前問題", estimatedTime: 90, week: 1, dueDate: "2024-12-20" },
      { id: "4", name: "アルゴリズム基礎", completed: false, category: "午後問題", estimatedTime: 120, week: 1, dueDate: "2024-12-21" },
      { id: "5", name: "プログラミング入門", completed: false, category: "プログラミング", estimatedTime: 90, week: 1, dueDate: "2024-12-22" },
      
      // 第2週
      { id: "6", name: "データ構造 - 配列とリスト", completed: false, category: "午前問題", estimatedTime: 75, week: 2, dueDate: "2024-12-25" },
      { id: "7", name: "データ構造 - スタックとキュー", completed: false, category: "午前問題", estimatedTime: 75, week: 2, dueDate: "2024-12-26" },
      { id: "8", name: "ソート・探索アルゴリズム", completed: false, category: "午後問題", estimatedTime: 120, week: 2, dueDate: "2024-12-27" },
      { id: "9", name: "プログラミング実践1", completed: false, category: "プログラミング", estimatedTime: 90, week: 2, dueDate: "2024-12-28" },
      { id: "10", name: "模擬試験1（午前）", completed: false, category: "模擬試験", estimatedTime: 150, week: 2, dueDate: "2024-12-29" },
      
      // 第3週
      { id: "11", name: "データベース基礎", completed: false, category: "午前問題", estimatedTime: 90, week: 3, dueDate: "2025-01-02" },
      { id: "12", name: "ネットワーク基礎", completed: false, category: "午前問題", estimatedTime: 90, week: 3, dueDate: "2025-01-03" },
      { id: "13", name: "セキュリティ基礎", completed: false, category: "午前問題", estimatedTime: 90, week: 3, dueDate: "2025-01-04" },
      { id: "14", name: "情報セキュリティ問題", completed: false, category: "午後問題", estimatedTime: 120, week: 3, dueDate: "2025-01-05" },
      { id: "15", name: "プログラミング実践2", completed: false, category: "プログラミング", estimatedTime: 90, week: 3, dueDate: "2025-01-06" },
      
      // 第4週
      { id: "16", name: "システム開発技術", completed: false, category: "午前問題", estimatedTime: 90, week: 4, dueDate: "2025-01-09" },
      { id: "17", name: "プロジェクトマネジメント", completed: false, category: "午前問題", estimatedTime: 90, week: 4, dueDate: "2025-01-10" },
      { id: "18", name: "データベース設計", completed: false, category: "午後問題", estimatedTime: 120, week: 4, dueDate: "2025-01-11" },
      { id: "19", name: "ネットワーク設計", completed: false, category: "午後問題", estimatedTime: 120, week: 4, dueDate: "2025-01-12" },
      { id: "20", name: "模擬試験2（総合）", completed: false, category: "模擬試験", estimatedTime: 300, week: 4, dueDate: "2025-01-13" },
    ];

    setTasks(mockTasks);
  }, [user]);

  const toggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const getWeekTasks = (week: number) => {
    return tasks.filter(task => task.week === week);
  };

  const getWeekProgress = (week: number) => {
    const weekTasks = getWeekTasks(week);
    if (weekTasks.length === 0) return 0;
    const completedTasks = weekTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / weekTasks.length) * 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "午前問題":
        return "#6482AD";
      case "午後問題":
        return "#F564A9";
      case "プログラミング":
        return "#9ECAD6";
      case "模擬試験":
        return "#FFEAEA";
      default:
        return "#gray";
    }
  };

  const getTaskStatus = (task: StudyTask) => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    
    if (task.completed) {
      return { status: "完了", color: "#10B981" };
    } else if (dueDate < today) {
      return { status: "期限切れ", color: "#EF4444" };
    } else if (dueDate.getTime() - today.getTime() <= 24 * 60 * 60 * 1000) {
      return { status: "期限間近", color: "#F59E0B" };
    } else {
      return { status: "未完了", color: "#6B7280" };
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // 試験日までの日数を計算
  const examDate = new Date(user.examDate);
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  const daysUntilExam = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6">
      {/* 試験日カウントダウン */}
      <div className="bg-white rounded-lg shadow-lg p-6 text-center" style={{ borderLeft: '4px solid #6482AD' }}>
        <h2 className="text-lg font-medium text-gray-900 mb-2">基本情報技術者試験まで</h2>
        <div className="text-5xl font-bold mb-2" style={{ color: '#6482AD' }}>
          {daysUntilExam}
        </div>
        <div className="text-xl text-gray-600">日</div>
        <div className="text-sm text-gray-500 mt-2">
          試験日: {examDate.toLocaleDateString('ja-JP')}
        </div>
      </div>

      {/* 週選択タブ */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {[1, 2, 3, 4].map((week) => {
              const progress = getWeekProgress(week);
              return (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    selectedWeek === week
                      ? 'border-current text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: selectedWeek === week ? '#6482AD' : 'transparent',
                    color: selectedWeek === week ? '#6482AD' : '#6B7280'
                  }}
                >
                  <div className="flex flex-col items-center">
                    <span>第{week}週</span>
                    <span className="text-xs mt-1">
                      進捗: {progress}%
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 週別タスク表 */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: '#6482AD' }}>
              第{selectedWeek}週の学習タスク
            </h2>
            <div className="text-sm text-gray-600">
              進捗率: {getWeekProgress(selectedWeek)}%
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    完了
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タスク名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カテゴリー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    予定時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    期限
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状態
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getWeekTasks(selectedWeek).map((task) => {
                  const taskStatus = getTaskStatus(task);
                  return (
                    <tr key={task.id} className={task.completed ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                          style={{ accentColor: '#6482AD' }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getCategoryColor(task.category) }}
                        >
                          {task.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.floor(task.estimatedTime / 60)}h {task.estimatedTime % 60}m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(task.dueDate).toLocaleDateString('ja-JP', {
                          month: 'numeric',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: taskStatus.color }}
                        >
                          {taskStatus.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 進捗サマリー */}
      <div className="grid md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((week) => {
          const weekTasks = getWeekTasks(week);
          const completedTasks = weekTasks.filter(task => task.completed).length;
          const progress = getWeekProgress(week);
          
          return (
            <div key={week} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium" style={{ color: '#6482AD' }}>
                  第{week}週
                </h3>
                <span className="text-sm text-gray-600">
                  {progress}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: progress === 100 ? '#10B981' : '#6482AD'
                  }}
                ></div>
              </div>
              
              <div className="text-sm text-gray-600">
                {completedTasks}/{weekTasks.length} 完了
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                予定時間: {Math.floor(weekTasks.reduce((sum, task) => sum + task.estimatedTime, 0) / 60)}h
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
