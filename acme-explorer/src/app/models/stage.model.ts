import { Entity } from "./entity.model";

export class Stage extends Entity {
        
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
    private _price!: number;
    
    public get price() {
        return this._price;
    }
    public set price(value) {
        this._price = value;
    }
}
