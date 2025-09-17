import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { KnowledgeLevel } from "../types";

const Login = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [examDate, setExamDate] = useState("");
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel>("未経験");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 入力検証
      if (!email) {
        setError("メールアドレスを入力してください");
        setIsLoading(false);
        return;
      }

      if (!password) {
        setError("パスワードを入力してください");
        setIsLoading(false);
        return;
      }

      if (password.length < 8) {
        setError("パスワードは8文字以上で入力してください");
        setIsLoading(false);
        return;
      }

      if (mode === "register") {
        // 新規登録の追加検証
        if (!nickname) {
          setError("ニックネームを入力してください");
          setIsLoading(false);
          return;
        }

        if (!examDate) {
          setError("試験予定日を選択してください");
          setIsLoading(false);
          return;
        }

        // 新規登録処理
        const success = await register({
          email,
          password,
          nickname,
          examDate,
          knowledgeLevel,
        });

        if (success) {
          navigate("/");
        } else {
          setError("このメールアドレスは既に使用されています。");
        }
      } else {
        // ログイン処理
        const success = await login(email, password);

        if (success) {
          navigate("/");
        } else {
          setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
        }
      }
    } catch (err) {
      setError("処理中にエラーが発生しました。");
      console.error("認証エラー:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFEAEA' }}>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#6482AD' }}>
              PLAMOTI
            </h1>
            <p className="text-sm mb-4" style={{ color: '#6482AD' }}>
              プラモチ - 基本情報技術者試験対策
            </p>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            {mode === "login" ? "ログイン" : "新規登録"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === "login" 
              ? "アカウントにログインしてください" 
              : "新しいアカウントを作成してください"
            }
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                placeholder="メールアドレスを入力"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                placeholder="パスワード（8文字以上）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {mode === "register" && (
              <>
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                    ニックネーム
                  </label>
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                    placeholder="ニックネームを入力"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="exam-date" className="block text-sm font-medium text-gray-700 mb-1">
                    試験予定日
                  </label>
                  <input
                    id="exam-date"
                    name="exam-date"
                    type="date"
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="knowledge-level" className="block text-sm font-medium text-gray-700 mb-1">
                    知識レベル
                  </label>
                  <select
                    id="knowledge-level"
                    name="knowledge-level"
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm"
                    value={knowledgeLevel}
                    onChange={(e) => setKnowledgeLevel(e.target.value as KnowledgeLevel)}
                  >
                    <option value="未経験">未経験</option>
                    <option value="基礎知識あり">基礎知識あり</option>
                    <option value="実務経験あり">実務経験あり</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
              }`}
              style={{ 
                backgroundColor: isLoading ? '#9ECAD6' : '#6482AD'
              }}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  処理中...
                </span>
              ) : (
                mode === "login" ? "ログイン" : "新規登録"
              )}
            </button>
          </div>

          <div className="text-sm text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
                setEmail("");
                setPassword("");
                setNickname("");
                setExamDate("");
                setKnowledgeLevel("未経験");
              }}
              className="font-medium text-gray-600 hover:text-gray-500 transition-colors"
              style={{ color: '#6482AD' }}
            >
              {mode === "login" 
                ? "アカウントをお持ちでない方はこちら" 
                : "既にアカウントをお持ちの方はこちら"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
