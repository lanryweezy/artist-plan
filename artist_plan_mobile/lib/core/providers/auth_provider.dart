import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

// Auth state
class AuthState {
  final UserModel? user;
  final bool isLoading;
  final String? error;
  final bool isInitialized;

  AuthState({
    this.user,
    this.isLoading = false,
    this.error,
    this.isInitialized = false,
  });

  AuthState copyWith({
    UserModel? user,
    bool? isLoading,
    String? error,
    bool? isInitialized,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      isInitialized: isInitialized ?? this.isInitialized,
    );
  }

  bool get isAuthenticated => user != null;
}

// Auth notifier
class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState()) {
    _initialize();
  }

  Future<void> _initialize() async {
    state = state.copyWith(isLoading: true);
    
    try {
      await AuthService.instance.init();
      final user = AuthService.instance.currentUser;
      
      state = state.copyWith(
        user: user,
        isLoading: false,
        isInitialized: true,
        error: null,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        isInitialized: true,
        error: e.toString(),
      );
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final result = await AuthService.instance.login(email, password);
      
      if (result.isSuccess) {
        state = state.copyWith(
          user: result.user,
          isLoading: false,
          error: null,
        );
        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          error: result.error,
        );
        return false;
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  Future<bool> register({
    required String email,
    required String password,
    required String name,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final result = await AuthService.instance.register(
        email: email,
        password: password,
        name: name,
      );
      
      if (result.isSuccess) {
        state = state.copyWith(
          user: result.user,
          isLoading: false,
          error: null,
        );
        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          error: result.error,
        );
        return false;
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true);
    
    try {
      await AuthService.instance.logout();
      state = state.copyWith(
        user: null,
        isLoading: false,
        error: null,
      );
    } catch (e) {
      // Even if logout fails, clear local state
      state = state.copyWith(
        user: null,
        isLoading: false,
        error: null,
      );
    }
  }

  Future<bool> refreshUser() async {
    try {
      final result = await AuthService.instance.getCurrentUser();
      
      if (result.isSuccess) {
        state = state.copyWith(
          user: result.user,
          error: null,
        );
        return true;
      } else {
        if (result.error == 'Session expired') {
          state = state.copyWith(user: null, error: null);
        }
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  Future<bool> updateProfile({
    String? name,
    String? avatar,
    Map<String, dynamic>? preferences,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final result = await AuthService.instance.updateProfile(
        name: name,
        avatar: avatar,
        preferences: preferences,
      );
      
      if (result.isSuccess) {
        state = state.copyWith(
          user: result.user,
          isLoading: false,
          error: null,
        );
        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          error: result.error,
        );
        return false;
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}

// Providers
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});

// Convenience providers
final currentUserProvider = Provider<UserModel?>((ref) {
  return ref.watch(authProvider).user;
});

final isAuthenticatedProvider = Provider<bool>((ref) {
  return ref.watch(authProvider).isAuthenticated;
});

final isLoadingProvider = Provider<bool>((ref) {
  return ref.watch(authProvider).isLoading;
});

final authErrorProvider = Provider<String?>((ref) {
  return ref.watch(authProvider).error;
});

final isInitializedProvider = Provider<bool>((ref) {
  return ref.watch(authProvider).isInitialized;
});