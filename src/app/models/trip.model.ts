import { Entity } from "./entity.model";
export class Trip extends Entity{

    private _tricker: string;
    public get tricker(): string {
        return this._tricker;
    }
    public set tricker(value: string) {
        this._tricker = value;
    }
    private _title: string;
    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }
    private _description: string;
    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }
    private _startedAt: Date;
    public get startedAt(): Date {
        return this._startedAt;
    }
    public set startedAt(value: Date) {
        this._startedAt = value;
    }
    private _endAt: Date;
    public get endAt(): Date {
        return this._endAt;
    }
    public set endAt(value: Date) {
        this._endAt = value;
    }
    private _photos: string[];
    
    public get photos() {
        return this._photos;
    }
    public set photos(value) {
        this._photos = value;
    }

    constructor(){
        super()
    }


;


}
