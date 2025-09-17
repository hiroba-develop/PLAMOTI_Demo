import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { RankingData, UserRanking, RankingCategory } from "../types";

const Ranking = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<RankingCategory>("総学習時間");
  const [rankingData, setRankingData] = useState<RankingData[]>([]);

  useEffect(() => {
    // モックデータ：ランキング情報
    const mockRankingData: RankingData[] = [
      {
        category: "総学習時間",
        rankings: [
          { rank: 1, userId: "user1", username: "勉強マスター", score: 2850, reactions: { like: 45, support: 32, applause: 28 } },
          { rank: 2, userId: "user2", username: "合格への道", score: 2640, reactions: { like: 38, support: 29, applause: 22 } },
          { rank: 3, userId: "user3", username: "IT志望者", score: 2420, reactions: { like: 35, support: 25, applause: 18 } },
          { rank: 4, userId: "user4", username: "頑張り屋", score: 2180, reactions: { like: 28, support: 20, applause: 15 } },
          { rank: 5, userId: "user5", username: "継続力", score: 1950, reactions: { like: 22, support: 18, applause: 12 } },
          { rank: 15, userId: user?.id || "", username: user?.nickname || "", score: 1200, reactions: { like: 8, support: 6, applause: 4 } },
        ],
        userRanking: { rank: 15, userId: user?.id || "", username: user?.nickname || "", score: 1200, reactions: { like: 8, support: 6, applause: 4 } }
      },
      {
        category: "継続日数",
        rankings: [
          { rank: 1, userId: "user6", username: "継続王", score: 89, reactions: { like: 52, support: 41, applause: 35 } },
          { rank: 2, userId: "user7", username: "毎日コツコツ", score: 85, reactions: { like: 47, support: 38, applause: 30 } },
          { rank: 3, userId: "user8", username: "習慣化マン", score: 82, reactions: { like: 41, support: 34, applause: 26 } },
          { rank: 4, userId: "user9", username: "継続は力", score: 78, reactions: { like: 35, support: 28, applause: 22 } },
          { rank: 5, userId: "user10", username: "努力家", score: 75, reactions: { like: 30, support: 25, applause: 18 } },
          { rank: 8, userId: user?.id || "", username: user?.nickname || "", score: 65, reactions: { like: 12, support: 10, applause: 7 } },
        ],
        userRanking: { rank: 8, userId: user?.id || "", username: user?.nickname || "", score: 65, reactions: { like: 12, support: 10, applause: 7 } }
      },
      {
        category: "今日の学習時間",
        rankings: [
          { rank: 1, userId: "user11", username: "今日も全力", score: 480, reactions: { like: 25, support: 20, applause: 15 } },
          { rank: 2, userId: "user12", username: "集中モード", score: 420, reactions: { like: 22, support: 18, applause: 12 } },
          { rank: 3, userId: "user13", username: "本気度MAX", score: 390, reactions: { like: 20, support: 15, applause: 10 } },
          { rank: 4, userId: "user14", username: "やる気満々", score: 360, reactions: { like: 18, support: 14, applause: 9 } },
          { rank: 5, userId: "user15", username: "今日が勝負", score: 330, reactions: { like: 15, support: 12, applause: 8 } },
          { rank: 12, userId: user?.id || "", username: user?.nickname || "", score: 150, reactions: { like: 5, support: 4, applause: 2 } },
        ],
        userRanking: { rank: 12, userId: user?.id || "", username: user?.nickname || "", score: 150, reactions: { like: 5, support: 4, applause: 2 } }
      },
    ];

    setRankingData(mockRankingData);
  }, [user]);

  const getCurrentRankingData = () => {
    return rankingData.find(data => data.category === selectedCategory);
  };

  const addReaction = (userId: string, reactionType: 'like' | 'support' | 'applause') => {
    setRankingData(prev => 
      prev.map(categoryData => {
        if (categoryData.category === selectedCategory) {
          return {
            ...categoryData,
            rankings: categoryData.rankings.map(ranking => 
              ranking.userId === userId 
                ? {
                    ...ranking,
                    reactions: {
                      ...ranking.reactions,
                      [reactionType]: ranking.reactions[reactionType] + 1
                    }
                  }
                : ranking
            )
          };
        }
        return categoryData;
      })
    );
  };

  const formatScore = (category: RankingCategory, score: number) => {
    switch (category) {
      case "総学習時間":
        return `${Math.floor(score / 60)}時間${score % 60}分`;
      case "継続日数":
        return `${score}日`;
      case "今日の学習時間":
        return `${Math.floor(score / 60)}時間${score % 60}分`;
      default:
        return score.toString();
    }
  };

  const getScoreUnit = (category: RankingCategory) => {
    switch (category) {
      case "総学習時間":
        return "分";
      case "継続日数":
        return "日";
      case "今日の学習時間":
        return "分";
      default:
        return "";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `${rank}位`;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const currentData = getCurrentRankingData();
  
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#6482AD' }}>
          🏆 ランキング
        </h1>
        <p className="text-gray-600">
          みんなで励まし合いながら頑張りましょう！
        </p>
      </div>

      {/* カテゴリー選択タブ */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {(["総学習時間", "継続日数", "今日の学習時間"] as RankingCategory[]).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedCategory === category
                    ? 'border-current'
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{
                  borderColor: selectedCategory === category ? '#6482AD' : 'transparent',
                  color: selectedCategory === category ? '#6482AD' : '#6B7280'
                }}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>

        {/* ランキング表示 */}
        <div className="p-6">
          {currentData && (
            <>
              {/* トップ3 */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#6482AD' }}>
                  🎖️ トップ3
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {currentData.rankings.slice(0, 3).map((ranking) => (
                    <div 
                      key={ranking.userId}
                      className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 text-center border-2"
                      style={{ 
                        borderColor: ranking.rank === 1 ? '#F59E0B' : ranking.rank === 2 ? '#9CA3AF' : '#CD7C2F'
                      }}
                    >
                      <div className="text-4xl mb-2">
                        {getRankIcon(ranking.rank)}
                      </div>
                      <div className="font-bold text-lg mb-1" style={{ color: '#6482AD' }}>
                        {ranking.username}
                      </div>
                      <div className="text-2xl font-bold mb-3" style={{ color: '#6482AD' }}>
                        {formatScore(selectedCategory, ranking.score)}
                      </div>
                      
                      {/* リアクションボタン */}
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => addReaction(ranking.userId, 'like')}
                          className="flex items-center space-x-1 px-2 py-1 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <span>👍</span>
                          <span className="text-xs">{ranking.reactions.like}</span>
                        </button>
                        <button
                          onClick={() => addReaction(ranking.userId, 'support')}
                          className="flex items-center space-x-1 px-2 py-1 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <span>💪</span>
                          <span className="text-xs">{ranking.reactions.support}</span>
                        </button>
                        <button
                          onClick={() => addReaction(ranking.userId, 'applause')}
                          className="flex items-center space-x-1 px-2 py-1 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <span>👏</span>
                          <span className="text-xs">{ranking.reactions.applause}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4位〜5位 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#6482AD' }}>
                  その他の上位ランカー
                </h3>
                <div className="space-y-3">
                  {currentData.rankings.slice(3, 5).map((ranking) => (
                    <div key={ranking.userId} className="bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold" style={{ color: '#6482AD' }}>
                          {ranking.rank}位
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{ranking.username}</div>
                          <div className="text-sm text-gray-600">
                            {formatScore(selectedCategory, ranking.score)}
                          </div>
                        </div>
                      </div>
                      
                      {/* リアクションボタン */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => addReaction(ranking.userId, 'like')}
                          className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <span>👍</span>
                          <span className="text-xs">{ranking.reactions.like}</span>
                        </button>
                        <button
                          onClick={() => addReaction(ranking.userId, 'support')}
                          className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <span>💪</span>
                          <span className="text-xs">{ranking.reactions.support}</span>
                        </button>
                        <button
                          onClick={() => addReaction(ranking.userId, 'applause')}
                          className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <span>👏</span>
                          <span className="text-xs">{ranking.reactions.applause}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 自分の順位 */}
              {currentData.userRanking && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#6482AD' }}>
                    🎯 あなたの順位
                  </h3>
                  <div className="border-2 rounded-lg p-4" style={{ borderColor: '#F564A9', backgroundColor: '#FFEAEA' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl font-bold" style={{ color: '#F564A9' }}>
                          {currentData.userRanking.rank}位
                        </div>
                        <div>
                          <div className="font-bold text-lg" style={{ color: '#6482AD' }}>
                            {currentData.userRanking.username} (あなた)
                          </div>
                          <div className="text-lg font-medium" style={{ color: '#6482AD' }}>
                            {formatScore(selectedCategory, currentData.userRanking.score)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-2">受け取ったリアクション</div>
                        <div className="flex space-x-3">
                          <div className="flex items-center space-x-1">
                            <span>👍</span>
                            <span className="font-medium">{currentData.userRanking.reactions.like}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>💪</span>
                            <span className="font-medium">{currentData.userRanking.reactions.support}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>👏</span>
                            <span className="font-medium">{currentData.userRanking.reactions.applause}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 励ましメッセージ */}
              <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#9ECAD6' }}>
                <h3 className="text-lg font-bold text-white mb-2">
                  🌟 みんなで頑張りましょう！
                </h3>
                <p className="text-white text-sm">
                  ランキングは競争ではなく、お互いを励まし合う場です。<br />
                  他の人の頑張りを見て、自分も頑張る気持ちを高めましょう！
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ranking;
