export class Entity {
    private _id: string;
    private _version: number;


    constructor(){
        this._id = '0';
        this._version = 0;
    }

    public get id(): string {
        return this._id;
    }

    public get version(): number {
        return this._version;
    }
}
