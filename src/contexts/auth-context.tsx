import {
   createContext,
   useContext,
   useState,
   useEffect,
   type ReactNode,
} from "react";
import type { LoginRequest, SignupRequest } from "@/features/auth/types";
import type { User } from "@/types/models";
import { login as apiLogin, signup as apiSignup } from "@/features/auth/api";

type AuthState = {
   user: User | null;
   token: string | null;
   isAuthenticated: boolean;
   isLoading: boolean;
};

type AuthContextValue = AuthState & {
   login: (req: LoginRequest) => Promise<void>;
   signup: (req: SignupRequest) => Promise<void>;
   logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "boarding_auth_token";
const USER_KEY = "boarding_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
   const [state, setState] = useState<AuthState>({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
   });

   // Load auth state from localStorage on mount
   useEffect(() => {
      const loadAuthState = () => {
         const token = localStorage.getItem(TOKEN_KEY);
         const userStr = localStorage.getItem(USER_KEY);

         if (token && userStr) {
            try {
               const user = JSON.parse(userStr) as User;
               setState({
                  user,
                  token,
                  isAuthenticated: true,
                  isLoading: false,
               });
            } catch {
               // Invalid stored data, clear it
               localStorage.removeItem(TOKEN_KEY);
               localStorage.removeItem(USER_KEY);
               setState((s) => ({ ...s, isLoading: false }));
            }
         } else {
            setState((s) => ({ ...s, isLoading: false }));
         }
      };

      loadAuthState();
   }, []);

   const login = async (req: LoginRequest) => {
      const response = await apiLogin(req);

      // Store token and user
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      setState({
         user: response.user,
         token: response.token,
         isAuthenticated: true,
         isLoading: false,
      });
   };

   const signup = async (req: SignupRequest) => {
      const response = await apiSignup(req);

      // Store token and user
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      setState({
         user: response.user,
         token: response.token,
         isAuthenticated: true,
         isLoading: false,
      });
   };

   const logout = () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      setState({
         user: null,
         token: null,
         isAuthenticated: false,
         isLoading: false,
      });
   };

   return (
      <AuthContext.Provider value={{ ...state, login, signup, logout }}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error("useAuth must be used within AuthProvider");
   }
   return context;
}
