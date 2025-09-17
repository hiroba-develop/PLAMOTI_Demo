import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { RankingCategory } from "../types";

interface ProfileStats {
  totalStudyTime: number;
  continuousDays: number;
  rankings: {
    category: RankingCategory;
    rank: number;
    totalParticipants: number;
  }[];
}

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProfileStats | null>(null);

  useEffect(() => {
    if (!user) return;

    // モックデータ：プロフィール統計
    const mockStats: ProfileStats = {
      totalStudyTime: user.totalStudyTime + 1200, // 追加の学習時間
      continuousDays: user.continuousDays + 5, // 追加の継続日数
      rankings: [
        { category: "総学習時間", rank: 15, totalParticipants: 234 },
        { category: "継続日数", rank: 8, totalParticipants: 234 },
        { category: "今日の学習時間", rank: 12, totalParticipants: 234 },
      ]
    };

    setStats(mockStats);
  }, [user]);

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}時間${mins}分`;
  };

  const getRankPercentile = (rank: number, total: number) => {
    const percentile = ((total - rank + 1) / total) * 100;
    return Math.round(percentile);
  };

  const getRankColor = (rank: number) => {
    if (rank <= 3) return "#F59E0B"; // ゴールド
    if (rank <= 10) return "#6482AD"; // メインカラー
    if (rank <= 50) return "#9ECAD6"; // サブカラー
    return "#6B7280"; // グレー
  };

  const getBadges = () => {
    const badges = [];
    
    if (stats) {
      // 学習時間に基づくバッジ
      if (stats.totalStudyTime >= 3000) badges.push({ name: "学習マスター", icon: "🎓", description: "総学習時間50時間達成" });
      else if (stats.totalStudyTime >= 1800) badges.push({ name: "学習上級者", icon: "📚", description: "総学習時間30時間達成" });
      else if (stats.totalStudyTime >= 600) badges.push({ name: "学習者", icon: "✏️", description: "総学習時間10時間達成" });

      // 継続日数に基づくバッジ
      if (stats.continuousDays >= 100) badges.push({ name: "継続王", icon: "👑", description: "100日連続学習達成" });
      else if (stats.continuousDays >= 50) badges.push({ name: "継続達人", icon: "🔥", description: "50日連続学習達成" });
      else if (stats.continuousDays >= 20) badges.push({ name: "継続者", icon: "⭐", description: "20日連続学習達成" });

      // ランキングに基づくバッジ
      const bestRank = Math.min(...stats.rankings.map(r => r.rank));
      if (bestRank <= 3) badges.push({ name: "トップランカー", icon: "🏆", description: "いずれかのランキングで3位以内" });
      else if (bestRank <= 10) badges.push({ name: "上位ランカー", icon: "🥇", description: "いずれかのランキングで10位以内" });
    }

    return badges;
  };

  if (!user || !stats) {
    return <div>Loading...</div>;
  }

  const badges = getBadges();

  return (
    <div className="space-y-6">
      {/* プロフィールヘッダー */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500" style={{ background: 'linear-gradient(135deg, #6482AD 0%, #F564A9 100%)' }}></div>
        <div className="relative px-6 pb-6">
          <div className="flex items-end space-x-6 -mt-16">
            {/* プロフィール画像 */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-white" style={{ backgroundColor: '#6482AD' }}>
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.nickname.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            
            {/* 基本情報 */}
            <div className="flex-1 pt-16">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.nickname}</h1>
              <p className="text-gray-600 mb-4">
                {user.oneLineComment || "基本情報技術者試験合格を目指して頑張っています！"}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div>
                  <span className="font-medium">知識レベル:</span> {user.knowledgeLevel}
                </div>
                <div>
                  <span className="font-medium">試験予定日:</span> {new Date(user.examDate).toLocaleDateString('ja-JP')}
                </div>
                <div>
                  <span className="font-medium">参加日:</span> {user.createdAt.toLocaleDateString('ja-JP')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 学習統計 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: '#6482AD' }}>
          📊 学習統計
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#FFEAEA' }}>
            <div className="text-3xl font-bold mb-2" style={{ color: '#6482AD' }}>
              {formatStudyTime(stats.totalStudyTime)}
            </div>
            <div className="text-gray-600">総学習時間</div>
          </div>
          
          <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#FFEAEA' }}>
            <div className="text-3xl font-bold mb-2" style={{ color: '#6482AD' }}>
              {stats.continuousDays}日
            </div>
            <div className="text-gray-600">継続日数</div>
          </div>
        </div>
      </div>

      {/* ランキング順位 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: '#6482AD' }}>
          🏆 ランキング順位
        </h2>
        
        <div className="space-y-4">
          {stats.rankings.map((ranking) => {
            const percentile = getRankPercentile(ranking.rank, ranking.totalParticipants);
            const color = getRankColor(ranking.rank);
            
            return (
              <div key={ranking.category} className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {ranking.rank}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{ranking.category}</div>
                    <div className="text-sm text-gray-600">
                      {ranking.totalParticipants}人中 {ranking.rank}位
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: '#6482AD' }}>
                    上位 {percentile}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {ranking.rank <= 10 ? '素晴らしい！' : ranking.rank <= 50 ? '頑張ってます！' : 'もう少し！'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 獲得バッジ */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: '#6482AD' }}>
          🏅 獲得バッジ
        </h2>
        
        {badges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <div key={index} className="p-4 rounded-lg border-2 border-gray-100 hover:border-gray-200 transition-colors">
                <div className="text-center">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <div className="font-bold text-gray-900 mb-1">{badge.name}</div>
                  <div className="text-xs text-gray-600">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎯</div>
            <div>まだバッジを獲得していません</div>
            <div className="text-sm mt-2">学習を続けてバッジを集めましょう！</div>
          </div>
        )}
      </div>

      {/* 学習の軌跡 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: '#6482AD' }}>
          📈 学習の軌跡
        </h2>
        
        <div className="space-y-4">
          {/* 直近の活動 */}
          <div className="border-l-4 pl-4" style={{ borderColor: '#6482AD' }}>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6482AD' }}></div>
              <span className="font-medium">今日</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              午前問題の学習を2時間30分実施
            </div>
          </div>
          
          <div className="border-l-4 border-gray-300 pl-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="font-medium">昨日</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              アルゴリズム問題に挑戦、模擬試験で70点獲得
            </div>
          </div>
          
          <div className="border-l-4 border-gray-300 pl-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="font-medium">3日前</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              継続学習20日達成でバッジ獲得！
            </div>
          </div>
        </div>
      </div>

      {/* モチベーションメッセージ */}
      <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#9ECAD6' }}>
        <h3 className="text-lg font-bold text-white mb-2">
          🌟 頑張っているあなたへ
        </h3>
        <p className="text-white text-sm">
          毎日の積み重ねが必ず結果につながります。<br />
          今のペースを維持して、基本情報技術者試験合格を目指しましょう！
        </p>
      </div>
    </div>
  );
};

export default Profile;
