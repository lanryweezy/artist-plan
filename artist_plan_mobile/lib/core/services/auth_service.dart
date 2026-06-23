import 'dart:convert';
import '../config/app_config.dart';
import '../models/user_model.dart';
import 'api_service.dart';
import 'storage_service.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  static AuthService get instance => _instance;
  AuthService._internal();

  UserModel? _currentUser;
  bool _isInitialized = false;

  UserModel? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;
  bool get isInitialized => _isInitialized;

  Future<void> init() async {
    try {
      await _loadUserFromStorage();
      _isInitialized = true;
      print('✅ Auth service initialized');
    } catch (e) {
      print('❌ Error initializing auth service: $e');
      _isInitialized = true;
    }
  }

  Future<void> _loadUserFromStorage() async {
    try {
      final token = await StorageService.instance.getSecureString(AppConfig.accessTokenKey);
      final userJson = StorageService.instance.getString(AppConfig.userDataKey);
      
      if (token != null && userJson != null) {
        final userData = jsonDecode(userJson);
        _currentUser = UserModel.fromJson(userData);
        print('✅ User loaded from storage: ${_currentUser?.email}');
      }
    } catch (e) {
      print('❌ Error loading user from storage: $e');
      await _clearUserData();
    }
  }

  Future<AuthResult> login(String email, String password) async {
    try {
      final response = await ApiService.instance.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        final data = response.data;
        
        // Store tokens
        await StorageService.instance.setSecureString(
          AppConfig.accessTokenKey, 
          data['access_token']
        );
        await StorageService.instance.setSecureString(
          AppConfig.refreshTokenKey, 
          data['refresh_token']
        );
        
        // Store user data
        _currentUser = UserModel.fromJson(data['user']);
        await StorageService.instance.setString(
          AppConfig.userDataKey, 
          jsonEncode(_currentUser!.toJson())
        );
        
        print('✅ Login successful: ${_currentUser?.email}');
        return AuthResult.success(_currentUser!);
      }
      
      return AuthResult.failure('Login failed');
    } catch (e) {
      print('❌ Login error: $e');
      if (e is ApiException) {
        return AuthResult.failure(e.message);
      }
      return AuthResult.failure('Login failed. Please try again.');
    }
  }

  Future<AuthResult> register({
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      final response = await ApiService.instance.post('/auth/register', data: {
        'email': email,
        'password': password,
        'name': name,
      });

      if (response.statusCode == 200) {
        final data = response.data;
        
        // Store tokens
        await StorageService.instance.setSecureString(
          AppConfig.accessTokenKey, 
          data['access_token']
        );
        await StorageService.instance.setSecureString(
          AppConfig.refreshTokenKey, 
          data['refresh_token']
        );
        
        // Store user data
        _currentUser = UserModel.fromJson(data['user']);
        await StorageService.instance.setString(
          AppConfig.userDataKey, 
          jsonEncode(_currentUser!.toJson())
        );
        
        print('✅ Registration successful: ${_currentUser?.email}');
        return AuthResult.success(_currentUser!);
      }
      
      return AuthResult.failure('Registration failed');
    } catch (e) {
      print('❌ Registration error: $e');
      if (e is ApiException) {
        return AuthResult.failure(e.message);
      }
      return AuthResult.failure('Registration failed. Please try again.');
    }
  }

  Future<void> logout() async {
    try {
      // Call logout endpoint
      await ApiService.instance.post('/auth/logout');
    } catch (e) {
      print('❌ Logout API error: $e');
    } finally {
      // Clear local data regardless of API call result
      await _clearUserData();
      print('✅ Logout completed');
    }
  }

  Future<bool> refreshToken() async {
    try {
      final refreshToken = await StorageService.instance.getSecureString(AppConfig.refreshTokenKey);
      if (refreshToken == null) return false;

      final response = await ApiService.instance.post('/auth/refresh', data: {
        'refresh_token': refreshToken,
      });

      if (response.statusCode == 200) {
        final newAccessToken = response.data['access_token'];
        await StorageService.instance.setSecureString(AppConfig.accessTokenKey, newAccessToken);
        print('✅ Token refreshed successfully');
        return true;
      }
    } catch (e) {
      print('❌ Token refresh failed: $e');
      await _clearUserData();
    }
    return false;
  }

  Future<AuthResult> getCurrentUser() async {
    try {
      final response = await ApiService.instance.get('/auth/me');
      
      if (response.statusCode == 200) {
        _currentUser = UserModel.fromJson(response.data);
        await StorageService.instance.setString(
          AppConfig.userDataKey, 
          jsonEncode(_currentUser!.toJson())
        );
        
        return AuthResult.success(_currentUser!);
      }
      
      return AuthResult.failure('Failed to get user data');
    } catch (e) {
      print('❌ Get current user error: $e');
      if (e is ApiException && e.statusCode == 401) {
        await _clearUserData();
        return AuthResult.failure('Session expired');
      }
      return AuthResult.failure('Failed to get user data');
    }
  }

  Future<AuthResult> updateProfile({
    String? name,
    String? avatar,
    Map<String, dynamic>? preferences,
  }) async {
    try {
      final data = <String, dynamic>{};
      if (name != null) data['name'] = name;
      if (avatar != null) data['avatar'] = avatar;
      if (preferences != null) data['preferences'] = preferences;

      final response = await ApiService.instance.put('/users/profile', data: data);
      
      if (response.statusCode == 200) {
        _currentUser = UserModel.fromJson(response.data);
        await StorageService.instance.setString(
          AppConfig.userDataKey, 
          jsonEncode(_currentUser!.toJson())
        );
        
        return AuthResult.success(_currentUser!);
      }
      
      return AuthResult.failure('Profile update failed');
    } catch (e) {
      print('❌ Profile update error: $e');
      if (e is ApiException) {
        return AuthResult.failure(e.message);
      }
      return AuthResult.failure('Profile update failed');
    }
  }

  Future<AuthResult> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      final response = await ApiService.instance.post('/users/change-password', data: {
        'current_password': currentPassword,
        'new_password': newPassword,
      });
      
      if (response.statusCode == 200) {
        return AuthResult.success(_currentUser!);
      }
      
      return AuthResult.failure('Password change failed');
    } catch (e) {
      print('❌ Password change error: $e');
      if (e is ApiException) {
        return AuthResult.failure(e.message);
      }
      return AuthResult.failure('Password change failed');
    }
  }

  Future<void> _clearUserData() async {
    _currentUser = null;
    await StorageService.instance.deleteSecureString(AppConfig.accessTokenKey);
    await StorageService.instance.deleteSecureString(AppConfig.refreshTokenKey);
    await StorageService.instance.remove(AppConfig.userDataKey);
  }

  Future<bool> isTokenValid() async {
    final token = await StorageService.instance.getSecureString(AppConfig.accessTokenKey);
    if (token == null) return false;
    
    // You can add JWT token validation logic here
    // For now, we'll just check if we can get current user
    try {
      final result = await getCurrentUser();
      return result.isSuccess;
    } catch (e) {
      return false;
    }
  }
}

class AuthResult {
  final bool isSuccess;
  final String? error;
  final UserModel? user;

  AuthResult.success(this.user) : isSuccess = true, error = null;
  AuthResult.failure(this.error) : isSuccess = false, user = null;
}