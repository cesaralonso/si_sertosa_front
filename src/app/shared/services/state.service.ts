import { Injectable, ApplicationRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StateService {
    
    state = {
        logged: false,
        user: {
            email: '',
            iduser: 0,
            message: '',
            modules: [{}],
            success: false,
            token: '',
        },
    };

    constructor(private app: ApplicationRef) {}

    setState(key, value) {
        this.state = { ...this.state, [key]: value };

        // Run change detection on state change
        this.app.tick();
    }
}
