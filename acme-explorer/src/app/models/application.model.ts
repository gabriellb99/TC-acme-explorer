import { Entity } from "./entity.model";
import { Timestamp } from "@angular/fire/firestore";

export class Application extends Entity {

  
    private _applicationStatus!: string;
    public get applicationStatus(): string {
        return this._applicationStatus;
    }
    public set applicationStatus(value: string) {
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

    private _trip!: string;
    public get trip() {
        return this._trip;
    }
    public set trip(value) {
        this._trip = value;
    }    

    private _actorID!: string;
    public get actorId() {
        return this._actorID;
    }
    public set actorId(value) {
        this._actorID = value;
    } 

    private _actorDescription!: string;
    public get actorDescription() {
        return this._actorDescription;
    }
    public set actorDescription(value) {
        this._actorDescription = value;
    } 

    private _tripTitle!: string;
    public get tripTitle() {
        return this._tripTitle;
    }
    public set tripTitle(value) {
        this._tripTitle = value;
    } 

    private _startTripDate!: Timestamp;
    public get startTripDate() {
        return this._startTripDate;
    }
    public set startTripDate(value) {
        this._startTripDate = value;
    } 
    private _tripPrice!: number;
    public get tripPrice() {
        return this._tripPrice;
    }
    public set tripPrice(value) {
        this._tripPrice = value;
    } 

    private _tripDeletedOrCancel!: boolean;
    public get tripDeletedOrCancel() {
        return this._tripDeletedOrCancel;
    }
    public set tripDeletedOrCancel(value) {
        this._tripDeletedOrCancel = value;
    }
    constructor(){
        super()
    }

    
}
