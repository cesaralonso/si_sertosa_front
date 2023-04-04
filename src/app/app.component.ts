import { Component } from '@angular/core';
import { PushNotificationService } from './shared/services/push-notifications.service';
import { SwUpdate } from '@angular/service-worker';
import { Router } from '@angular/router';
import { ToasterService } from './shared/services/toaster.service';
import { AuthService } from './shared/services/auth.service';
import { GlobalState } from './global.state';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from './theme/services';
import { BaThemeConfig } from './theme/theme.config';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  styleUrls: ['./app.component.scss'],
  template: `
    <main [class.menu-collapsed]="isMenuCollapsed" baThemeRun>
      <div class="additional-bg"></div>
      <router-outlet></router-outlet>
    </main>
    <app-sa-loading-screen></app-sa-loading-screen>
  `
})
export class App {

  isMenuCollapsed: boolean = false;

  constructor(private _state: GlobalState,
              private _imageLoader: BaImageLoaderService,
              private _spinner: BaThemeSpinner,
              private themeConfig: BaThemeConfig,
              private pushNotificationService: PushNotificationService,
              private toastrService: ToasterService,
              private authService: AuthService,
              private router: Router,
              private swUpdate: SwUpdate) {

    themeConfig.config();

    this._loadImages();

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  ngOnInit() {
      if (this.swUpdate.isEnabled) {
        this.swUpdate.available.subscribe( () => {
          if (confirm('Nueva versión de la aplicación disponible, ¿Deseas actualizar?')) {
            window.location.reload();
          }
        });
      }
      this.swUpdate.checkForUpdate();
      // Tomar el Token
      this.notificationSetup();
  }

  public ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
    BaThemePreloader.load().then((values) => {
      this._spinner.hide();
    });
  }

  private _loadImages(): void {
    // register some loaders
    BaThemePreloader.registerLoader(this._imageLoader.load('assets/img/sky-bg.jpg'));
  }

  async notificationSetup() {
      // subscribe to push notifications
      if (localStorage.getItem('iduser') && localStorage.getItem('idrol')) {
        this.pushNotificationService.addPushSubscriber(+localStorage.getItem('iduser'), +localStorage.getItem('idrol'));
      }
      // Ahora revisar si está ya logeado
      this.checkAuth();
  }

  async checkAuth() {
    if (this.authService.isLoggedIn) {
      this.showToast('Bienvenido.');
      // this.router.navigate(['/pages/proyectos']);
    } else {
      this.router.navigate(['/login'])
        .then(response => {
              console.log('login response', response);
        })
        .catch(error => {
          this.toastrService.error('router error: ' + JSON.stringify(error));
        });
      this.showToast('Acceso denegado, debes logearte para utilizar el servicio.');
    }
  }

  async showToast(message: string) {
    this.toastrService.success(message);
  }

}
