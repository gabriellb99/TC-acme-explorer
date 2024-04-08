import { Timestamp } from "@angular/fire/firestore";
import { Entity } from "./entity.model";
export class Trip extends Entity{

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
    private _description!: string;
    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }
    private _cancelReason!: string;
    public get cancelReason(): string {
        return this._cancelReason;
    }
    public set cancelReason(value: string) {
        this._cancelReason = value;
    }
    private _startedAt!: Timestamp;
    public get startedAt(): Timestamp {
        return this._startedAt;
    }
    public set startedAt(value: Timestamp) {
        this._startedAt = value;
    }
    private _endAt!: Timestamp;
    public get endAt(): Timestamp {
        return this._endAt;
    }
    public set endAt(value: Timestamp) {
        this._endAt = value;
    }
    private _photos!: string[];
    
    public get photos() {
        return this._photos;
    }
    public set photos(value) {
        this._photos = value;
    }
    private _requirements!: string[];
    
    public get requirements() {
        return this._requirements;
    }
    public set requirements(value) {
        this._requirements = value;
    }
    private _price!: number;
    
    public get price() {
        return this._price;
    }
    public set price(value) {
        this._price = value;
    }

    constructor(){
        super()
    }


;


}
