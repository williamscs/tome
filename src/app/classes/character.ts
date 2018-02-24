import { Class } from './class.enum';

import * as uuidv4 from 'uuid/v4';

export class Character {
    id: number;
    name: string;
    private _level: number;
    experience: number;
    class: Class;

    constructor() {
        this.id = uuidv4();
        this.name = '';
        this._level = 1;
        this.experience = 0;
        this.class = Class.Brute;
    }

    get level(): number {
        if (this.experience < 45) {
            this._level = 1;
        } else if (this.experience >= 45 && this.experience < 95) {
            this._level = 2;
        } else if (this.experience >= 95 && this.experience < 150) {
            this._level = 3;
        } else if (this.experience >= 150 && this.experience < 210) {
            this._level = 4;
        } else if (this.experience >= 210 && this.experience < 275) {
            this._level = 5;
        } else if (this.experience >= 275 && this.experience < 345) {
            this._level = 6;
        } else if (this.experience >= 345 && this.experience < 420) {
            this._level = 7;
        } else if (this.experience >= 420 && this.experience < 500) {
            this._level = 8;
        } else if (this.experience >= 500) {
            this._level = 9;
        }

        return this._level;
    }
}
