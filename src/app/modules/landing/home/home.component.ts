import { Component, ViewEncapsulation } from '@angular/core';
import { interval  } from 'rxjs';

@Component({
    selector     : 'landing-home',
    templateUrl  : './home.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent
{
    /**
     * Constructor
     */
    rotate: number = 0;
    constructor()
    {

    }
}
