import 'package:flutter/material.dart';

class Project {
  final String title;
  final String description;

  Project(this.title, this.description);
}

class ProjectsScreen extends StatelessWidget {
  final List<Project> projects = [
    Project('Album Release', 'Finalizing the new album for release.'),
    Project('Music Video', 'Shooting the music video for the lead single.'),
    Project('Tour Planning', 'Organizing the upcoming US tour.'),
    Project('Merch Design', 'Creating new merchandise designs.'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Projects'),
      ),
      body: ListView.builder(
        itemCount: projects.length,
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              title: Text(projects[index].title),
              subtitle: Text(projects[index].description),
              trailing: Icon(Icons.arrow_forward_ios),
              onTap: () {
                // Navigate to project details screen
              },
            ),
          );
        },
      ),
    );
  }
}