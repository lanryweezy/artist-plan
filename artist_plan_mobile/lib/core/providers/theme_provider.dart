import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../config/app_config.dart';
import '../services/storage_service.dart';

class ThemeNotifier extends StateNotifier<ThemeMode> {
  ThemeNotifier() : super(ThemeMode.system) {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    try {
      final themeString = StorageService.instance.getString(AppConfig.themeKey);
      if (themeString != null) {
        state = _stringToThemeMode(themeString);
      }
    } catch (e) {
      print('Error loading theme: $e');
    }
  }

  Future<void> setTheme(ThemeMode themeMode) async {
    state = themeMode;
    try {
      await StorageService.instance.setString(
        AppConfig.themeKey,
        _themeModeToString(themeMode),
      );
    } catch (e) {
      print('Error saving theme: $e');
    }
  }

  void toggleTheme() {
    switch (state) {
      case ThemeMode.light:
        setTheme(ThemeMode.dark);
        break;
      case ThemeMode.dark:
        setTheme(ThemeMode.light);
        break;
      case ThemeMode.system:
        setTheme(ThemeMode.light);
        break;
    }
  }

  String _themeModeToString(ThemeMode themeMode) {
    switch (themeMode) {
      case ThemeMode.light:
        return 'light';
      case ThemeMode.dark:
        return 'dark';
      case ThemeMode.system:
        return 'system';
    }
  }

  ThemeMode _stringToThemeMode(String themeString) {
    switch (themeString) {
      case 'light':
        return ThemeMode.light;
      case 'dark':
        return ThemeMode.dark;
      case 'system':
        return ThemeMode.system;
      default:
        return ThemeMode.system;
    }
  }
}

final themeModeProvider = StateNotifierProvider<ThemeNotifier, ThemeMode>((ref) {
  return ThemeNotifier();
});

final isDarkModeProvider = Provider<bool>((ref) {
  final themeMode = ref.watch(themeModeProvider);
  return themeMode == ThemeMode.dark;
});

final isSystemThemeProvider = Provider<bool>((ref) {
  final themeMode = ref.watch(themeModeProvider);
  return themeMode == ThemeMode.system;
});