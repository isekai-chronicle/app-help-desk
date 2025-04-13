import { Component, OnInit } from '@angular/core';
import { User } from '../login/user.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './login.service';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: false,
})
export class LoginComponent implements OnInit {
  translate: any | {} = {
    labUser: { word: '_User', disabled: false, visible: true },
    labPassword: { word: '_Password', disabled: false, visible: true },
    btnLogin: { word: '_Login', disabled: false, visible: true },
    valUser: {
      word: '_This field cannot be empty',
      disabled: false,
      visible: true,
    },
    valPassword: {
      word: '_This field cannot be empty',
      disabled: false,
      visible: true,
    },
    valLogin: {
      word: '_This field cannot be empty',
      disabled: false,
      visible: true,
    },
    valCredential: {
      word: '_Wrong Credentials!',
      disabled: false,
      visible: true,
    },
  };

  gsrc: string = '';

  dsUserProfile: User;

  //Alert Status
  isUserAlert: boolean = false;
  isPasswordAlert: boolean = false;
  isLoginAlert: boolean = false;

  isSubmitted: boolean = false;
  isError: boolean = false;
  isErrorProfile: boolean = false;

  gMessage: string = '';
  constructor(
    private sLogin: LoginService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sAuthentication: AuthenticationService
  ) {
    this.dsUserProfile = {
      userName: '',
      password: '',
    };
  }

  ngOnInit(): void {
    this.ToggleMute();
    this.SetBackground();

    if (
      this.sAuthentication.GetCookie('username') !== null &&
      this.sAuthentication.GetCookie('username') !== ''
    ) {
      this.LoadUserName();
      //this.dsUserProfile.userName = this.sAuthentication.GetCookie('username');

      const passwordInput = document.getElementById(
        'user-password'
      ) as HTMLInputElement;
      passwordInput.focus();
    }
  }

  ToggleMute(): void {
    this.SetBackground();
    const video = document.getElementById('video-id') as HTMLVideoElement;
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
  }

  onClick_maximize() {
    this.LaunchFullScreen(document.documentElement);
  }

  LaunchFullScreen(element: any): void {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      /* Firefox */
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      /* IE/Edge */
      element.msRequestFullscreen();
    }
  }

  SetBackground() {
    const country = this.sAuthentication.GetCookie('country');
    if (country != null && country != '') {
      this.gsrc = `../../../assets/video/flag-${country}.mp4`;
    } else {
      this.gsrc = `../../../assets/video/cloth-cotton.mp4`;
    }
  }

  LoadUserName() {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.dsUserProfile = {
        userName: this.activatedRoute.snapshot.paramMap.get('id')?.toString(),
        password: this.activatedRoute.snapshot.paramMap.get('id')?.toString(),
      };
    } else {
      this.dsUserProfile.userName = this.sAuthentication.GetCookie('username');
    }
  }

  mousedown_submit(flag: boolean) {
    this.click_submit(flag);
  }

  click_submit(flag: boolean) {
    this.isUserAlert = false;
    this.isPasswordAlert = false;

    this.sLogin.ClearLocalStorage();

    if (
      this.dsUserProfile.userName != '' &&
      this.dsUserProfile.password != ''
    ) {
      this.sLogin.GetJWT(this.dsUserProfile).subscribe({
        next: (data: any) => {
          if (data != null) {
            this.sLogin.SetLocalStorageJSON('config', data);

            this.sAuthentication.SetCookie('country', data.country, 5);

            this.sAuthentication.SetCookie(
              'username',
              this.dsUserProfile.userName ?? '',
              1
            );

            this.router.navigate(['/menu-master']);
          } else {
            this.gMessage = this.translate.valCredential.word;

            this.isLoginAlert = true;
            this.isError = true;

            setTimeout(() => {
              this.isError = false;
            }, 1000);
          }
        },
      });
    } else {
      if (
        this.dsUserProfile.userName == '' &&
        this.dsUserProfile.password != ''
      ) {
        this.gMessage = this.translate.valUser.word;
        this.isUserAlert = true;
      }
      if (
        this.dsUserProfile.userName != '' &&
        this.dsUserProfile.password == ''
      ) {
        this.gMessage = this.translate.valPassword.word;
        this.isPasswordAlert = true;
      } else {
        this.gMessage = this.translate.valLogin.word;
        this.isUserAlert = true;
        this.isPasswordAlert = true;
      }
      this.isError = true;
      this.isErrorProfile = true;

      setTimeout(() => {
        this.isError = false;
        this.isErrorProfile = false;
      }, 1000);
    }
    this.isSubmitted = flag;
  }
}
