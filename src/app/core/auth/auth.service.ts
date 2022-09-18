/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { catchError, Observable, of, switchMap, mergeMap, throwError } from 'rxjs';
import { User } from '../user/user.types';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}
export interface AuthResponseNewToken {
    access_token: string;
    expires_in: string;
    id_token: string;
    refresh_token: string;
    token_type: string;
    user_id: string;
}

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    ) {}

    get refreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }

    set refreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }



    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    signIn(credentials: { email: string; password: string }): Observable<any> {
        const newCredentials = { ...credentials, returnSecureToken: true };
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError(()=> new Error('User is already logged in.'));
        }
        return this._httpClient.post(environment.urlSignIn, newCredentials).pipe(
            switchMap((response: AuthResponseData) => {
                // Store the access token in the local storage
                this.accessToken = response.idToken;
                this.refreshToken = response.refreshToken;
                // Set the authenticated flag to true
                this._authenticated = true;
                return  of(true);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Renew token
        const url = `https://securetoken.googleapis.com/v1/token?key=${environment.firebase.apiKey}`;
        const body = new HttpParams()
            .set('refresh_token', this.refreshToken)
            .set('grant_type', 'refresh_token');
        return this._httpClient.post(url, body)
            .pipe(
                catchError(() =>
                    // Return false;
                    of(false)
                ),
                switchMap((response: AuthResponseNewToken) => {
                    // Store the access token in the local storage
                    this.accessToken = response.access_token;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        const newUser = { ...user, returnSecureToken: true };
        return this._httpClient.post(environment.urlSignUp, newUser).pipe(
            switchMap((response: AuthResponseData) => {
                // Store the access token in the local storage
                this.accessToken = response.idToken;
                this.refreshToken = response.refreshToken;
                // Set the authenticated flag to true
                this._authenticated = true;
                const newUserDataBase = {
                    id: response.localId,
                    name: user.name,
                    email: response.email,
                    avatar: 'https://firebasestorage.googleapis.com/v0/b/medico-4c2e3.appspot.com/o/profile.png?alt=media&token=b2b380fb-e161-48b8-889e-90d628f13e81',
                    status: 'Online',
                };
                return this._httpClient.patch(`${environment.firebase.databaseURL}/users/${newUserDataBase.id}.json`,newUserDataBase);
            }),
            switchMap(_=> of(true))
        );
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken || this.accessToken === 'undefined') {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
