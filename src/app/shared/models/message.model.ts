import { User } from './user.model';
import { Action } from './action.model';
import { Type } from './type.model';

export interface Message {
    from?: User;
    to?: User,
    content?: any;
    action?: Action;
    type?: Type;
    date?: string;
    hour?: string;
}
