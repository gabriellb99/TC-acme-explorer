import { Entity } from "./entity.model";

export class Sponsor extends Entity{

    private _url!: string;
    public get url(): string {
        return this._url;
    }
    public set url(value: string) {
        this._url = value;
    }
    private _linkAddInfo!: string;
    public get linkAddInfo(): string {
        return this._linkAddInfo;
    }
    public set linkAddInfo(value: string) {
        this._linkAddInfo = value;
    }
    private _flatRate!: number;
    
    public get flatRate() {
        return this._flatRate;
    }
    public set flatRate(value) {
        this._flatRate = value;
    }

}
