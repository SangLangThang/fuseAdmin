import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { AuthUtils } from '../auth/auth.utils';
@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private db: AngularFireDatabase
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */

    get user$(): Observable<User> {
        return this._user.asObservable();
    }
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    getAccessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User> {
        const userId = AuthUtils._decodeToken(this.getAccessToken()).user_id;
        return this._httpClient
            .get<User>(
                `${environment.firebase.databaseURL}/users/${userId}.json`
            )
            .pipe(
                tap((user) => {
                    this._user.next(user);
                })
            );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

}
