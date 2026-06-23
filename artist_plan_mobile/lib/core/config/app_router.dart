import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../providers/auth_provider.dart';
import '../../screens/auth/login_screen.dart';
import '../../screens/auth/register_screen.dart';
import '../../screens/onboarding/onboarding_screen.dart';
import '../../screens/main/main_screen.dart';
import '../../screens/dashboard/dashboard_screen.dart';
import '../../screens/projects/projects_screen.dart';
import '../../screens/calendar/calendar_screen.dart';
import '../../screens/finances/finances_screen.dart';
import '../../screens/content/content_screen.dart';
import '../../screens/marketing/marketing_screen.dart';
import '../../screens/tours/tours_screen.dart';
import '../../screens/profile/profile_screen.dart';
import '../../screens/settings/settings_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);
  
  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isAuthenticated = authState.isAuthenticated;
      final isInitialized = authState.isInitialized;
      final user = authState.user;
      
      // Wait for auth initialization
      if (!isInitialized) {
        return '/loading';
      }
      
      // Handle authentication redirects
      if (!isAuthenticated) {
        if (state.uri.toString().startsWith('/auth')) {
          return null; // Allow auth routes
        }
        return '/auth/login';
      }
      
      // Handle onboarding
      if (user != null && !user.preferences.onboardingCompleted) {
        if (state.uri.toString() == '/onboarding') {
          return null; // Allow onboarding route
        }
        return '/onboarding';
      }
      
      // Redirect from auth routes if already authenticated
      if (state.uri.toString().startsWith('/auth') || state.uri.toString() == '/') {
        return '/dashboard';
      }
      
      return null;
    },
    routes: [
      // Loading route
      GoRoute(
        path: '/loading',
        builder: (context, state) => const LoadingScreen(),
      ),
      
      // Auth routes
      GoRoute(
        path: '/auth/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/auth/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      
      // Onboarding route
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      
      // Main app routes
      ShellRoute(
        builder: (context, state, child) => MainScreen(child: child),
        routes: [
          GoRoute(
            path: '/dashboard',
            builder: (context, state) => const DashboardScreen(),
          ),
          GoRoute(
            path: '/projects',
            builder: (context, state) => const ProjectsScreen(),
          ),
          GoRoute(
            path: '/calendar',
            builder: (context, state) => const CalendarScreen(),
          ),
          GoRoute(
            path: '/finances',
            builder: (context, state) => const FinancesScreen(),
          ),
          GoRoute(
            path: '/content',
            builder: (context, state) => const ContentScreen(),
          ),
          GoRoute(
            path: '/marketing',
            builder: (context, state) => const MarketingScreen(),
          ),
          GoRoute(
            path: '/tours',
            builder: (context, state) => const ToursScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
          GoRoute(
            path: '/settings',
            builder: (context, state) => const SettingsScreen(),
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) => ErrorScreen(error: state.error),
  );
});

class LoadingScreen extends StatelessWidget {
  const LoadingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(),
            const SizedBox(height: 16),
            Text(
              'Loading...',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
          ],
        ),
      ),
    );
  }
}

class ErrorScreen extends StatelessWidget {
  final Exception? error;
  
  const ErrorScreen({super.key, this.error});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Error'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline,
                size: 64,
                color: Colors.red,
              ),
              const SizedBox(height: 16),
              Text(
                'Something went wrong',
                style: Theme.of(context).textTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                error?.toString() ?? 'Unknown error occurred',
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.go('/dashboard'),
                child: const Text('Go to Dashboard'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}