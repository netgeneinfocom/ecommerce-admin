import { useAuthStore } from '@/core/store';
import { authService } from '../services';
import { LoginCredentials, SignupCredentials } from '../types';
import { showErrorToast } from '@/core/errors';
import { toast } from '@/components/ui/use-toast';

export const useAuth = () => {
  const { user, token, role, isAuthenticated, isLoading, logout: storeLogout } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    try {
      useAuthStore.getState().setLoading(true);
      await authService.login(credentials);
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      
      return { success: true };
    } catch (error) {
      showErrorToast(error);
      return { success: false, error };
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      useAuthStore.getState().setLoading(true);
      await authService.signup(credentials);
      
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      
      return { success: true };
    } catch (error) {
      showErrorToast(error);
      return { success: false, error };
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      showErrorToast(error);
    }
  };

  return {
    user,
    token,
    role,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };
};
