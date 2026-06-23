import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:hive_flutter/hive_flutter.dart';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  static StorageService get instance => _instance;
  StorageService._internal();

  late SharedPreferences _prefs;
  late Box _hiveBox;
  static const FlutterSecureStorage _secureStorage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock_this_device,
    ),
  );

  Future<void> init() async {
    try {
      _prefs = await SharedPreferences.getInstance();
      _hiveBox = await Hive.openBox('app_storage');
      print('✅ Storage service initialized');
    } catch (e) {
      print('❌ Error initializing storage service: $e');
      rethrow;
    }
  }

  // Secure Storage Methods (for sensitive data like tokens)
  Future<void> setSecureString(String key, String value) async {
    try {
      await _secureStorage.write(key: key, value: value);
    } catch (e) {
      print('❌ Error setting secure string: $e');
      rethrow;
    }
  }

  Future<String?> getSecureString(String key) async {
    try {
      return await _secureStorage.read(key: key);
    } catch (e) {
      print('❌ Error getting secure string: $e');
      return null;
    }
  }

  Future<void> deleteSecureString(String key) async {
    try {
      await _secureStorage.delete(key: key);
    } catch (e) {
      print('❌ Error deleting secure string: $e');
    }
  }

  Future<void> clearSecureStorage() async {
    try {
      await _secureStorage.deleteAll();
    } catch (e) {
      print('❌ Error clearing secure storage: $e');
    }
  }

  // SharedPreferences Methods (for non-sensitive data)
  Future<void> setString(String key, String value) async {
    try {
      await _prefs.setString(key, value);
    } catch (e) {
      print('❌ Error setting string: $e');
    }
  }

  String? getString(String key) {
    try {
      return _prefs.getString(key);
    } catch (e) {
      print('❌ Error getting string: $e');
      return null;
    }
  }

  Future<void> setBool(String key, bool value) async {
    try {
      await _prefs.setBool(key, value);
    } catch (e) {
      print('❌ Error setting bool: $e');
    }
  }

  bool? getBool(String key) {
    try {
      return _prefs.getBool(key);
    } catch (e) {
      print('❌ Error getting bool: $e');
      return null;
    }
  }

  Future<void> setInt(String key, int value) async {
    try {
      await _prefs.setInt(key, value);
    } catch (e) {
      print('❌ Error setting int: $e');
    }
  }

  int? getInt(String key) {
    try {
      return _prefs.getInt(key);
    } catch (e) {
      print('❌ Error getting int: $e');
      return null;
    }
  }

  Future<void> setDouble(String key, double value) async {
    try {
      await _prefs.setDouble(key, value);
    } catch (e) {
      print('❌ Error setting double: $e');
    }
  }

  double? getDouble(String key) {
    try {
      return _prefs.getDouble(key);
    } catch (e) {
      print('❌ Error getting double: $e');
      return null;
    }
  }

  Future<void> setStringList(String key, List<String> value) async {
    try {
      await _prefs.setStringList(key, value);
    } catch (e) {
      print('❌ Error setting string list: $e');
    }
  }

  List<String>? getStringList(String key) {
    try {
      return _prefs.getStringList(key);
    } catch (e) {
      print('❌ Error getting string list: $e');
      return null;
    }
  }

  Future<void> remove(String key) async {
    try {
      await _prefs.remove(key);
    } catch (e) {
      print('❌ Error removing key: $e');
    }
  }

  Future<void> clear() async {
    try {
      await _prefs.clear();
    } catch (e) {
      print('❌ Error clearing preferences: $e');
    }
  }

  // Hive Methods (for complex objects and caching)
  Future<void> setHiveData(String key, dynamic value) async {
    try {
      await _hiveBox.put(key, value);
    } catch (e) {
      print('❌ Error setting hive data: $e');
    }
  }

  T? getHiveData<T>(String key) {
    try {
      return _hiveBox.get(key) as T?;
    } catch (e) {
      print('❌ Error getting hive data: $e');
      return null;
    }
  }

  Future<void> deleteHiveData(String key) async {
    try {
      await _hiveBox.delete(key);
    } catch (e) {
      print('❌ Error deleting hive data: $e');
    }
  }

  Future<void> clearHiveData() async {
    try {
      await _hiveBox.clear();
    } catch (e) {
      print('❌ Error clearing hive data: $e');
    }
  }

  // Utility Methods
  bool hasKey(String key) {
    return _prefs.containsKey(key);
  }

  bool hasHiveKey(String key) {
    return _hiveBox.containsKey(key);
  }

  Set<String> getKeys() {
    return _prefs.getKeys();
  }

  Iterable<dynamic> getHiveKeys() {
    return _hiveBox.keys;
  }
}