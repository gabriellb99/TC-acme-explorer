import { Entity } from "./entity.model";
import { Timestamp } from "@angular/fire/firestore";

export class Application extends Entity {
    private _ticker!: string;
    public get ticker(): string {
        return this._ticker;
    }
    public set ticker(value: string) {
        this._ticker = value;
    }
    private _title!: string;
    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }
    
    private _applicationStatus!: string;
    public get applicationStatus(): string {
        return this._applicationStatus;
    }
    public set applictionStatus(value: string) {
        this._applicationStatus = value;
    }

    private _createdAt!: Timestamp;
    public get createdAt(): Timestamp {
        return this._createdAt;
    }
    public set createdAt(value: Timestamp) {
        this._createdAt = value;
    }
    
    private _comments!: string[];
    
    public get comments() {
        return this._comments;
    }
    public set comments(value) {
        this._comments = value;
    }
    private _reasons!: string[];
    
    public get reasons() {
        return this._reasons;
    }
    public set reasons(value) {
        this._reasons = value;
    }
    

    constructor(){
        super()
    }

    
}
