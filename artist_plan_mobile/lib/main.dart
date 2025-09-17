import 'package:flutter/material.dart';
import 'package:artist_plan_mobile/screens/dashboard/dashboard_screen.dart';
import 'package:artist_plan_mobile/screens/projects/projects_screen.dart';
import 'package:artist_plan_mobile/screens/calendar/calendar_screen.dart';
import 'package:artist_plan_mobile/screens/finances/finances_screen.dart';
import 'package:artist_plan_mobile/screens/content/content_screen.dart';
import 'package:artist_plan_mobile/screens/marketing/marketing_screen.dart';
import 'package:artist_plan_mobile/screens/tours/tours_screen.dart';
import 'package:artist_plan_mobile/screens/onboarding/onboarding_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Artist Plan',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  static final List<Widget> _widgetOptions = <Widget>[
    DashboardScreen(),
    ProjectsScreen(),
    CalendarScreen(),
    FinancesScreen(),
    ContentScreen(),
    MarketingScreen(),
    ToursScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.work),
            label: 'Projects',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today),
            label: 'Calendar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.attach_money),
            label: 'Finances',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.music_note),
            label: 'Content',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.campaign),
            label: 'Marketing',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.flight),
            label: 'Tours',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
      ),
    );
  }
}