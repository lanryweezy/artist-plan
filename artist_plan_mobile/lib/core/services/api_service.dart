import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../config/app_config.dart';
import 'storage_service.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  static ApiService get instance => _instance;
  ApiService._internal();

  late Dio _dio;
  String? _baseUrl;

  void init(String baseUrl) {
    _baseUrl = baseUrl;
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: AppConfig.connectTimeout,
      receiveTimeout: AppConfig.receiveTimeout,
      sendTimeout: AppConfig.sendTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    _setupInterceptors();
    print('✅ API service initialized with base URL: $baseUrl');
  }

  void _setupInterceptors() {
    // Request interceptor
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Add auth token if available
          final token = await StorageService.instance.getSecureString(AppConfig.accessTokenKey);
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }

          if (kDebugMode) {
            print('🚀 REQUEST: ${options.method} ${options.path}');
            print('📤 Headers: ${options.headers}');
            if (options.data != null) {
              print('📤 Data: ${options.data}');
            }
          }

          handler.next(options);
        },
        onResponse: (response, handler) {
          if (kDebugMode) {
            print('✅ RESPONSE: ${response.statusCode} ${response.requestOptions.path}');
            print('📥 Data: ${response.data}');
          }
          handler.next(response);
        },
        onError: (error, handler) async {
          if (kDebugMode) {
            print('❌ ERROR: ${error.response?.statusCode} ${error.requestOptions.path}');
            print('❌ Message: ${error.message}');
            print('❌ Data: ${error.response?.data}');
          }

          // Handle token refresh on 401
          if (error.response?.statusCode == 401) {
            final refreshed = await _refreshToken();
            if (refreshed) {
              // Retry the original request
              final options = error.requestOptions;
              final token = await StorageService.instance.getSecureString(AppConfig.accessTokenKey);
              options.headers['Authorization'] = 'Bearer $token';
              
              try {
                final response = await _dio.fetch(options);
                handler.resolve(response);
                return;
              } catch (e) {
                // If retry fails, continue with original error
              }
            }
          }

          handler.next(error);
        },
      ),
    );

    // Logging interceptor for debug mode
    if (kDebugMode) {
      _dio.interceptors.add(LogInterceptor(
        requestBody: true,
        responseBody: true,
        requestHeader: true,
        responseHeader: false,
        error: true,
      ));
    }
  }

  Future<bool> _refreshToken() async {
    try {
      final refreshToken = await StorageService.instance.getSecureString(AppConfig.refreshTokenKey);
      if (refreshToken == null) return false;

      final response = await _dio.post(
        '/auth/refresh',
        data: {'refresh_token': refreshToken},
        options: Options(
          headers: {'Authorization': null}, // Remove auth header for refresh
        ),
      );

      if (response.statusCode == 200) {
        final newAccessToken = response.data['access_token'];
        await StorageService.instance.setSecureString(AppConfig.accessTokenKey, newAccessToken);
        print('✅ Token refreshed successfully');
        return true;
      }
    } catch (e) {
      print('❌ Token refresh failed: $e');
      // Clear tokens on refresh failure
      await StorageService.instance.deleteSecureString(AppConfig.accessTokenKey);
      await StorageService.instance.deleteSecureString(AppConfig.refreshTokenKey);
    }
    return false;
  }

  // GET request
  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  // POST request
  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.post<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  // PUT request
  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.put<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  // DELETE request
  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.delete<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  // PATCH request
  Future<Response<T>> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.patch<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  // File upload
  Future<Response<T>> uploadFile<T>(
    String path,
    String filePath, {
    String? fileName,
    Map<String, dynamic>? data,
    ProgressCallback? onSendProgress,
    CancelToken? cancelToken,
  }) async {
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(filePath, filename: fileName),
        ...?data,
      });

      return await _dio.post<T>(
        path,
        data: formData,
        onSendProgress: onSendProgress,
        cancelToken: cancelToken,
      );
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Error handling
  ApiException _handleError(dynamic error) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return ApiException('Connection timeout. Please check your internet connection.');
        
        case DioExceptionType.badResponse:
          final statusCode = error.response?.statusCode;
          final message = error.response?.data?['message'] ?? 
                          error.response?.data?['detail'] ?? 
                          'Server error occurred';
          return ApiException(message, statusCode: statusCode);
        
        case DioExceptionType.cancel:
          return ApiException('Request was cancelled');
        
        case DioExceptionType.unknown:
          return ApiException('Network error. Please check your internet connection.');
        
        default:
          return ApiException('An unexpected error occurred');
      }
    }
    return ApiException('An unexpected error occurred');
  }

  // Cancel all requests
  void cancelRequests() {
    _dio.clear();
  }
}

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, {this.statusCode});

  @override
  String toString() => 'ApiException: $message';
}