import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { User, RegisterRequest } from "../types";

// デフォルトユーザーデータ
const createDefaultUser = (email: string, nickname: string, examDate: string, knowledgeLevel: string): User => ({
  id: crypto.randomUUID(),
  email,
  nickname,
  examDate,
  knowledgeLevel: knowledgeLevel as any,
  totalStudyTime: 0,
  continuousDays: 0,
  createdAt: new Date(),
  lastLogin: new Date(),
});

// 認証コンテキストの型定義
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  shouldRedirectToLogin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => void;
}

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirectToLogin, setShouldRedirectToLogin] = useState(false);

  // 初期化時にローカルストレージからユーザー情報を取得
  useEffect(() => {
    const storedUser = localStorage.getItem("plamoti_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setShouldRedirectToLogin(false);
    } else {
      setShouldRedirectToLogin(true);
    }
    setIsLoading(false);
  }, []);

  // ログイン処理
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // デモ用の簡易認証 - 既存ユーザーをチェック
      const existingUsers = JSON.parse(localStorage.getItem("plamoti_users") || "[]");
      const existingUser = existingUsers.find((u: User) => u.email === email);
      
      if (existingUser) {
        // ユーザー情報をローカルストレージに保存
        localStorage.setItem("plamoti_user", JSON.stringify(existingUser));
        setUser(existingUser);
        setShouldRedirectToLogin(false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("ログインエラー:", error);
      return false;
    }
  };

  // 新規登録処理
  const register = async (data: RegisterRequest): Promise<boolean> => {
    try {
      // 既存ユーザーをチェック
      const existingUsers = JSON.parse(localStorage.getItem("plamoti_users") || "[]");
      const existingUser = existingUsers.find((u: User) => u.email === data.email);
      
      if (existingUser) {
        return false; // 既に存在するユーザー
      }

      // 新しいユーザーを作成
      const newUser = createDefaultUser(data.email, data.nickname, data.examDate, data.knowledgeLevel);
      
      // ユーザーリストに追加
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem("plamoti_users", JSON.stringify(updatedUsers));
      
      // 現在のユーザーとして設定
      localStorage.setItem("plamoti_user", JSON.stringify(newUser));
      setUser(newUser);
      setShouldRedirectToLogin(false);
      return true;
    } catch (error) {
      console.error("登録エラー:", error);
      return false;
    }
  };

  // ログアウト処理
  const logout = () => {
    localStorage.removeItem("plamoti_user");
    setUser(null);
    setShouldRedirectToLogin(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        shouldRedirectToLogin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 認証コンテキストを使用するためのカスタムフック
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
