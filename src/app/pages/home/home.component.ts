import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  dsProject: any[] = [];

  dsTask: any[] = [];

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.homeService
      .getProject('B0D03C06-E23D-4166-85A3-85EFC992510B')
      .subscribe((project) => {
        this.dsProject = project;
      });
  }

  onClick_expanded(project_id: any) {
    const project = this.dsProject.find((p) => p.project_id === project_id);
    project.expanded = !project.expanded;
  }

  onClick_task(project_id: any) {
    this.homeService
      .getTask('B0D03C06-E23D-4166-85A3-85EFC992510B', project_id)
      .subscribe((task) => {
        this.dsTask = task;
        console.log(this.dsTask);
      });
  }
}
