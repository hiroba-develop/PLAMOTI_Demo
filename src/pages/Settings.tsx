import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { UserSettings, NotificationSettings, KnowledgeLevel } from "../types";

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    // ユーザー設定の初期値を設定
    const initialSettings: UserSettings = {
      profileImage: user.profileImage,
      nickname: user.nickname,
      oneLineComment: user.oneLineComment || "",
      examDate: user.examDate,
      knowledgeLevel: user.knowledgeLevel,
      notifications: {
        reminderEnabled: true,
        emailEnabled: true,
        weeklyProgressAlert: true,
        focusModeEnabled: false,
        sleepModePrompt: true,
        studyStartNotification: true,
      }
    };

    setSettings(initialSettings);
  }, [user]);

  const handleSettingsChange = (key: keyof UserSettings, value: any) => {
    if (!settings) return;
    
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    if (!settings) return;
    
    setSettings(prev => prev ? {
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    } : null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // プレビュー用のURL生成（実際のアプリではクラウドストレージにアップロード）
      const imageUrl = URL.createObjectURL(file);
      handleSettingsChange('profileImage', imageUrl);
    }
  };

  // 設定保存処理
  const saveSettings = () => {
    if (!settings) return;

    // 実際のアプリではAPIリクエストを行う
    console.log("設定を保存:", settings);

    // ローカルストレージの更新（デモ用）
    if (user) {
      const updatedUser = {
        ...user,
        nickname: settings.nickname,
        oneLineComment: settings.oneLineComment,
        examDate: settings.examDate,
        knowledgeLevel: settings.knowledgeLevel,
        profileImage: settings.profileImage,
      };
      
      localStorage.setItem("plamoti_user", JSON.stringify(updatedUser));
      
      // ユーザーリストも更新
      const existingUsers = JSON.parse(localStorage.getItem("plamoti_users") || "[]");
      const updatedUsers = existingUsers.map((u: any) => 
        u.id === user.id ? updatedUser : u
      );
      localStorage.setItem("plamoti_users", JSON.stringify(updatedUsers));
    }

    // 成功メッセージを表示
    setSuccessMessage("設定が保存されました");

    // 3秒後にメッセージを消す
    setTimeout(() => {
      setSuccessMessage("");
      // ページをリロードして変更を反映
      window.location.reload();
    }, 2000);
  };

  if (!user || !settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#6482AD' }}>⚙️ 設定</h1>
        <p className="text-gray-600 mt-2">プロフィール情報と通知設定を管理できます</p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-md" style={{ backgroundColor: '#FFEAEA' }}>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5"
                style={{ color: '#6482AD' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium" style={{ color: '#6482AD' }}>
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* プロフィール設定 */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6" style={{ color: '#6482AD' }}>
              プロフィール設定
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              プロフィール情報を更新できます
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="space-y-6">
              {/* プロフィール画像 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  プロフィール画像
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: '#6482AD' }}>
                    {settings.profileImage ? (
                      <img src={settings.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      settings.nickname.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-image"
                    />
                    <label
                      htmlFor="profile-image"
                      className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                      画像を変更
                    </label>
                  </div>
                </div>
              </div>

              {/* ニックネーム */}
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                  ニックネーム
                </label>
                <input
                  type="text"
                  id="nickname"
                  value={settings.nickname}
                  onChange={(e) => handleSettingsChange('nickname', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                />
              </div>

              {/* 一言コメント */}
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  一言コメント
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  value={settings.oneLineComment}
                  onChange={(e) => handleSettingsChange('oneLineComment', e.target.value)}
                  placeholder="あなたの目標や意気込みを書いてください"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                />
              </div>

              {/* メールアドレス（読み取り専用） */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  readOnly
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">メールアドレスは変更できません</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 学習設定 */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6" style={{ color: '#6482AD' }}>
              学習設定
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              試験日と知識レベルを更新できます
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="space-y-6">
              {/* 試験予定日 */}
              <div>
                <label htmlFor="exam-date" className="block text-sm font-medium text-gray-700 mb-1">
                  試験予定日
                </label>
                <input
                  type="date"
                  id="exam-date"
                  value={settings.examDate}
                  onChange={(e) => handleSettingsChange('examDate', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                />
              </div>

              {/* 知識レベル */}
              <div>
                <label htmlFor="knowledge-level" className="block text-sm font-medium text-gray-700 mb-1">
                  知識レベル
                </label>
                <select
                  id="knowledge-level"
                  value={settings.knowledgeLevel}
                  onChange={(e) => handleSettingsChange('knowledgeLevel', e.target.value as KnowledgeLevel)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                >
                  <option value="未経験">未経験</option>
                  <option value="基礎知識あり">基礎知識あり</option>
                  <option value="実務経験あり">実務経験あり</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 通知設定 */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6" style={{ color: '#6482AD' }}>
              通知設定
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              各種通知の設定を管理できます
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="space-y-6">
              {/* リマインド通知 */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="reminder"
                    type="checkbox"
                    checked={settings.notifications.reminderEnabled}
                    onChange={(e) => handleNotificationChange('reminderEnabled', e.target.checked)}
                    className="h-4 w-4 border-gray-300 rounded"
                    style={{ accentColor: '#6482AD' }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="reminder" className="font-medium text-gray-700">
                    リマインド通知
                  </label>
                  <p className="text-gray-500">
                    学習時間のリマインドを受け取ります
                  </p>
                </div>
              </div>

              {/* メール配信設定 */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email-notifications"
                    type="checkbox"
                    checked={settings.notifications.emailEnabled}
                    onChange={(e) => handleNotificationChange('emailEnabled', e.target.checked)}
                    className="h-4 w-4 border-gray-300 rounded"
                    style={{ accentColor: '#6482AD' }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email-notifications" className="font-medium text-gray-700">
                    メール配信設定
                  </label>
                  <p className="text-gray-500">
                    重要な情報をメールで受け取ります
                  </p>
                </div>
              </div>

              {/* 1週間進捗滞り通知 */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="weekly-progress"
                    type="checkbox"
                    checked={settings.notifications.weeklyProgressAlert}
                    onChange={(e) => handleNotificationChange('weeklyProgressAlert', e.target.checked)}
                    className="h-4 w-4 border-gray-300 rounded"
                    style={{ accentColor: '#6482AD' }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="weekly-progress" className="font-medium text-gray-700">
                    1週間進捗滞り通知
                  </label>
                  <p className="text-gray-500">
                    学習が1週間滞った場合に通知します
                  </p>
                </div>
              </div>

              {/* 集中モード */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="focus-mode"
                    type="checkbox"
                    checked={settings.notifications.focusModeEnabled}
                    onChange={(e) => handleNotificationChange('focusModeEnabled', e.target.checked)}
                    className="h-4 w-4 border-gray-300 rounded"
                    style={{ accentColor: '#6482AD' }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="focus-mode" className="font-medium text-gray-700">
                    集中モード
                  </label>
                  <p className="text-gray-500">
                    学習中の不要な通知をブロックします
                  </p>
                </div>
              </div>

              {/* おやすみモード促進 */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="sleep-mode"
                    type="checkbox"
                    checked={settings.notifications.sleepModePrompt}
                    onChange={(e) => handleNotificationChange('sleepModePrompt', e.target.checked)}
                    className="h-4 w-4 border-gray-300 rounded"
                    style={{ accentColor: '#6482AD' }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="sleep-mode" className="font-medium text-gray-700">
                    おやすみモード促進通知
                  </label>
                  <p className="text-gray-500">
                    適切な休息時間を促す通知を受け取ります
                  </p>
                </div>
              </div>

              {/* 学習開始通知 */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="study-start"
                    type="checkbox"
                    checked={settings.notifications.studyStartNotification}
                    onChange={(e) => handleNotificationChange('studyStartNotification', e.target.checked)}
                    className="h-4 w-4 border-gray-300 rounded"
                    style={{ accentColor: '#6482AD' }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="study-start" className="font-medium text-gray-700">
                    学習開始ボタン押下タイミング通知
                  </label>
                  <p className="text-gray-500">
                    学習開始時にモチベーション向上の通知を表示します
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 保存ボタン */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={saveSettings}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ backgroundColor: '#6482AD' }}
        >
          保存
        </button>
      </div>
    </div>
  );
};

export default Settings;
