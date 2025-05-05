
// Define user types and authentication state
export type UserRole = "admin" | "doctor" | "patient" | null;
export type AuthProvider = "email" | "google" | "microsoft";

export interface User {
  email: string;
  role: UserRole;
  name?: string;
  provider?: AuthProvider;
  profileCompleted?: boolean;
  uid?: string;
}

export interface GoogleProfile {
  email: string;
  name: string;
  sub: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithProvider: (provider: "google" | "microsoft", profile?: GoogleProfile) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => User | undefined;
}
