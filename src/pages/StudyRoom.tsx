import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { StudyTimer, SupportMessage, SOSSituation, Question, Answer } from "../types";

const StudyRoom = () => {
  const { user } = useAuth();
  const [timer, setTimer] = useState<StudyTimer>({
    isRunning: false,
    pausedTime: 0,
    currentSession: 0,
  });
  const [dailyMessage, setDailyMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(42);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [sosUsageCount, setSosUsageCount] = useState(0);
  const [selectedSituation, setSelectedSituation] = useState<SOSSituation | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  // 日替わりメッセージのリスト
  const dailyMessages = [
    "今日も頑張ろう！継続は力なり！",
    "一歩ずつ進んでいけば、必ず目標に到達できます！",
    "今日の努力が明日の成功につながります！",
    "集中して取り組めば、きっと良い結果が生まれます！",
    "諦めずに続けることが、合格への近道です！",
  ];

  useEffect(() => {
    // 日替わりメッセージを設定
    const today = new Date();
    const messageIndex = today.getDate() % dailyMessages.length;
    setDailyMessage(dailyMessages[messageIndex]);

    // 応援メッセージのモックデータ
    const mockMessages: SupportMessage[] = [
      {
        id: "1",
        userId: "user1",
        username: "がんばる太郎",
        message: "一緒に頑張りましょう！",
        timestamp: new Date(Date.now() - 300000), // 5分前
      },
      {
        id: "2", 
        userId: "user2",
        username: "合格花子",
        message: "午前問題の復習中です。みんなファイト！",
        timestamp: new Date(Date.now() - 600000), // 10分前
      },
      {
        id: "3",
        userId: "user3",
        username: "プログラマー",
        message: "アルゴリズム問題が難しいですが、諦めません！",
        timestamp: new Date(Date.now() - 900000), // 15分前
      },
    ];
    setSupportMessages(mockMessages);

    // 質問箱のモックデータ
    const mockQuestions: Question[] = [
      {
        id: "q1",
        userId: "user1",
        username: "初心者A",
        title: "2進数の計算方法について",
        content: "2進数の足し算で桁上がりがある場合の計算方法を教えてください。",
        category: "午前問題",
        answers: [
          {
            id: "a1",
            questionId: "q1",
            userId: "user2",
            username: "ベテランB",
            content: "2進数の足し算では、1+1=10（桁上がり）となります。例：1011 + 0110 = 10001 のように計算します。",
            helpful: 5,
            createdAt: new Date(Date.now() - 1800000),
          }
        ],
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 1800000),
      },
      {
        id: "q2",
        userId: "user3",
        username: "学習者C",
        title: "アルゴリズムの時間計算量について",
        content: "O記法での時間計算量の比較方法がよく分かりません。",
        category: "午後問題",
        answers: [],
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7200000),
      },
    ];
    setQuestions(mockQuestions);

    // タイマーの更新
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev.isRunning && prev.startTime) {
          const elapsed = Math.floor((Date.now() - prev.startTime.getTime()) / 1000 / 60);
          return { ...prev, currentSession: elapsed };
        }
        return prev;
      });
    }, 60000); // 1分ごとに更新

    return () => clearInterval(interval);
  }, []);

  const startStudy = () => {
    setTimer(prev => ({
      ...prev,
      isRunning: true,
      startTime: new Date(),
    }));
  };

  const pauseStudy = () => {
    if (timer.startTime) {
      const elapsed = Math.floor((Date.now() - timer.startTime.getTime()) / 1000 / 60);
      setTimer(prev => ({
        ...prev,
        isRunning: false,
        pausedTime: prev.pausedTime + elapsed,
        currentSession: prev.pausedTime + elapsed,
      }));
    }
  };

  const sendSOS = () => {
    if (sosUsageCount >= 2) {
      alert("SOSの使用回数が上限に達しています（1日2回まで）");
      return;
    }
    
    if (!selectedSituation) {
      alert("状況を選択してください");
      return;
    }

    setSosUsageCount(prev => prev + 1);
    
    // SOS送信後の処理（実際にはAPIリクエスト）
    const newMessage: SupportMessage = {
      id: Date.now().toString(),
      userId: "system",
      username: "システム",
      message: `${user?.nickname}さんがSOSを送信しました。みんなで応援しましょう！`,
      timestamp: new Date(),
    };
    
    setSupportMessages(prev => [newMessage, ...prev]);
    setSelectedSituation(null);
    alert("SOSを送信しました！みんなからの応援をお待ちください。");
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="space-y-6">
      {/* キャッチフレーズ */}
      <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#FFEAEA' }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#6482AD' }}>
          📚 オンライン自習室
        </h1>
        <p className="text-lg" style={{ color: '#6482AD' }}>
          {dailyMessage}
        </p>
      </div>

      {/* オンライン人数表示 */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full" style={{ backgroundColor: '#9ECAD6' }}>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white font-medium">現在 {onlineUsers} 人が学習中</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 左側：学習タイマーとSOS */}
        <div className="space-y-6">
          {/* 学習タイマー */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#6482AD' }}>
              学習タイマー
            </h2>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-mono font-bold mb-2" style={{ color: '#6482AD' }}>
                {formatTime(timer.currentSession)}
              </div>
              <div className="text-sm text-gray-600">
                累計: {formatTime(timer.pausedTime)}分
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              {!timer.isRunning ? (
                <button
                  onClick={startStudy}
                  className="px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#6482AD' }}
                >
                  学習開始
                </button>
              ) : (
                <button
                  onClick={pauseStudy}
                  className="px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#F564A9' }}
                >
                  休憩
                </button>
              )}
            </div>
          </div>

          {/* SOSボタン */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#6482AD' }}>
              SOSボタン
            </h2>
            
            <div className="text-sm text-gray-600 mb-4">
              使用回数: {sosUsageCount}/2 （1日2回まで）
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  現在の状況を選択してください
                </label>
                <select
                  value={selectedSituation || ""}
                  onChange={(e) => setSelectedSituation(e.target.value as SOSSituation)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={{ focusRingColor: '#6482AD' }}
                >
                  <option value="">選択してください</option>
                  <option value="やる気が出ない">やる気が出ない</option>
                  <option value="集中が切れた">集中が切れた</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              <button
                onClick={sendSOS}
                disabled={sosUsageCount >= 2 || !selectedSituation}
                className={`w-full py-3 rounded-lg font-medium shadow-lg transition-opacity ${
                  sosUsageCount >= 2 || !selectedSituation
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:opacity-90'
                }`}
                style={{ 
                  backgroundColor: sosUsageCount >= 2 ? '#9ECAD6' : '#F564A9',
                  color: 'white'
                }}
              >
                🆘 SOS送信
              </button>
            </div>
          </div>
        </div>

        {/* 右側：応援コメントと質問箱 */}
        <div className="space-y-6">
          {/* 応援コメント表示 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#6482AD' }}>
              応援コメント
            </h2>
            
            <div className="h-64 overflow-y-auto space-y-3 border rounded-lg p-4" style={{ backgroundColor: '#FFEAEA' }}>
              {supportMessages.map((message) => (
                <div key={message.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#6482AD' }}>
                      {message.username.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{message.username}</span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString('ja-JP', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 質問箱 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#6482AD' }}>
                質問箱
              </h2>
              <button
                onClick={() => setShowQuestionForm(!showQuestionForm)}
                className="px-4 py-2 rounded-lg text-white font-medium shadow hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#F564A9' }}
              >
                質問する
              </button>
            </div>

            {showQuestionForm && (
              <div className="mb-4 p-4 border rounded-lg" style={{ backgroundColor: '#FFEAEA' }}>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="質問のタイトル"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ focusRingColor: '#6482AD' }}
                  />
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ focusRingColor: '#6482AD' }}
                  >
                    <option value="">カテゴリーを選択</option>
                    <option value="午前問題">午前問題</option>
                    <option value="午後問題">午後問題</option>
                    <option value="プログラミング">プログラミング</option>
                    <option value="学習方法">学習方法</option>
                    <option value="試験対策">試験対策</option>
                    <option value="その他">その他</option>
                  </select>
                  <textarea
                    placeholder="質問内容を詳しく書いてください"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ focusRingColor: '#6482AD' }}
                  />
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 rounded-lg text-white font-medium shadow hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#6482AD' }}
                    >
                      投稿
                    </button>
                    <button
                      onClick={() => setShowQuestionForm(false)}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{question.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: '#9ECAD6' }}>
                      {question.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{question.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>by {question.username}</span>
                    <span>{question.answers.length}件の回答</span>
                  </div>
                  
                  {question.answers.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2" style={{ borderColor: '#9ECAD6' }}>
                      {question.answers.slice(0, 1).map((answer) => (
                        <div key={answer.id}>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium">{answer.username}</span>
                            <span className="text-xs text-gray-500">👍 {answer.helpful}</span>
                          </div>
                          <p className="text-sm text-gray-700">{answer.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
