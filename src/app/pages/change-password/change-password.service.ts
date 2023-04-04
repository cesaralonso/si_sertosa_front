
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginResponseInterface } from './../login/login-response.interface';
import { LoginInterface } from './../login/login.interface';
import { AuthService } from './../../shared/services/auth.service';
import { Configuration } from './../../app.constants';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
    
    private headers: HttpHeaders;
    private options: any;
    private endPoint: string;
    constructor(
        private _http: HttpClient,
        private _configuration: Configuration,
        private authService: AuthService) {
        this.options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'JWT ' + this.authService.token
            })};
        this.endPoint = `${this._configuration.apiUrl}si_user/`;
    }

    changePassword = ( credenciales: LoginInterface ) : Observable<LoginResponseInterface> => {
        return this._http.patch<HttpResponse<any>>(`${this.endPoint}`, credenciales, this.options)
            .pipe(
                map((response: any) => response),
                catchError(this.handleError));
    }

    private handleError(error: HttpResponse<any>) {
        console.error(error);
        return observableThrowError(error || 'Server error');
    }

}
