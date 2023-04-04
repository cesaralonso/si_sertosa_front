import { AuthService } from './auth.service';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Configuration } from './../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
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
        this.endPoint = `${this._configuration.apiUrl}app`;
       }
       all = () : Observable<any> => {
           return this._http.get<HttpResponse<any>>(`${this.endPoint}/sesion`, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       insertSesionPosicion = ( coords: any ) : Observable<any> => {
           return this._http.post<HttpResponse<any>>(`${this.endPoint}/sesion-posicion`, coords, this.options)
               .pipe(
                   map((response: any) => response),
                   catchError(this.handleError));
       }
       private handleError(error: HttpResponse<any>) {
           console.error(error);
           return observableThrowError(error || 'Server error');
       }
}
