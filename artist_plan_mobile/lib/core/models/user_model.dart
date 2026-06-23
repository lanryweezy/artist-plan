import 'package:json_annotation/json_annotation.dart';

part 'user_model.g.dart';

@JsonSerializable()
class UserModel {
  final String id;
  final String email;
  final String name;
  final String? avatar;
  final String subscription;
  final UserPreferences preferences;
  final String createdAt;
  final bool isActive;

  UserModel({
    required this.id,
    required this.email,
    required this.name,
    this.avatar,
    required this.subscription,
    required this.preferences,
    required this.createdAt,
    required this.isActive,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);
  Map<String, dynamic> toJson() => _$UserModelToJson(this);

  UserModel copyWith({
    String? id,
    String? email,
    String? name,
    String? avatar,
    String? subscription,
    UserPreferences? preferences,
    String? createdAt,
    bool? isActive,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      avatar: avatar ?? this.avatar,
      subscription: subscription ?? this.subscription,
      preferences: preferences ?? this.preferences,
      createdAt: createdAt ?? this.createdAt,
      isActive: isActive ?? this.isActive,
    );
  }
}

@JsonSerializable()
class UserPreferences {
  final String theme;
  final String currency;
  final String timezone;
  final NotificationSettings notifications;
  final String aiAutomationLevel;
  final bool onboardingCompleted;

  UserPreferences({
    required this.theme,
    required this.currency,
    required this.timezone,
    required this.notifications,
    required this.aiAutomationLevel,
    required this.onboardingCompleted,
  });

  factory UserPreferences.fromJson(Map<String, dynamic> json) => _$UserPreferencesFromJson(json);
  Map<String, dynamic> toJson() => _$UserPreferencesToJson(this);

  UserPreferences copyWith({
    String? theme,
    String? currency,
    String? timezone,
    NotificationSettings? notifications,
    String? aiAutomationLevel,
    bool? onboardingCompleted,
  }) {
    return UserPreferences(
      theme: theme ?? this.theme,
      currency: currency ?? this.currency,
      timezone: timezone ?? this.timezone,
      notifications: notifications ?? this.notifications,
      aiAutomationLevel: aiAutomationLevel ?? this.aiAutomationLevel,
      onboardingCompleted: onboardingCompleted ?? this.onboardingCompleted,
    );
  }
}

@JsonSerializable()
class NotificationSettings {
  final bool email;
  final bool push;
  final bool taskReminders;
  final bool projectUpdates;
  final bool financialAlerts;
  final bool aiSuggestions;

  NotificationSettings({
    required this.email,
    required this.push,
    required this.taskReminders,
    required this.projectUpdates,
    required this.financialAlerts,
    required this.aiSuggestions,
  });

  factory NotificationSettings.fromJson(Map<String, dynamic> json) => _$NotificationSettingsFromJson(json);
  Map<String, dynamic> toJson() => _$NotificationSettingsToJson(this);

  NotificationSettings copyWith({
    bool? email,
    bool? push,
    bool? taskReminders,
    bool? projectUpdates,
    bool? financialAlerts,
    bool? aiSuggestions,
  }) {
    return NotificationSettings(
      email: email ?? this.email,
      push: push ?? this.push,
      taskReminders: taskReminders ?? this.taskReminders,
      projectUpdates: projectUpdates ?? this.projectUpdates,
      financialAlerts: financialAlerts ?? this.financialAlerts,
      aiSuggestions: aiSuggestions ?? this.aiSuggestions,
    );
  }
}