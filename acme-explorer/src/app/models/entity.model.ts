export class Entity {
    private _id: string;
    private _version: number;

    constructor(id: string = '0', version: number = 0) {
        this._id = id;
        this._version = version;
    }

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get version(): number {
        return this._version;
    }

    public set version(value: number) {
        this._version = value;
    }
}
