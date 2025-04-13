import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { LoginService } from '../../security/login/login.service';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  dsProject: any[] = [];

  dsTask: any[] = [];

  constructor(private homeService: HomeService, private sLogin: LoginService) {}

  ngOnInit() {
    //    this.loadTasks();
    this.LoadToken();
  }

  // loadTasks() {
  //   this.homeService
  //     .getProject('B0D03C06-E23D-4166-85A3-85EFC992510B')
  //     .subscribe((project) => {
  //       this.dsProject = project;
  //     });
  // }

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

  LoadToken() {
    let data = {
      userName: 'h_martinez5478',
      password: 'martinez2024@',
    };

    this.sLogin.GetJWT(data).subscribe({
      next: (data: any) => {
        if (data != null) {
          this.sLogin.SetLocalStorageJSON('config', data);
        }
      },
    });
  }
}
