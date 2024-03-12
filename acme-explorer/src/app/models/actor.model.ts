import { Entity } from "./entity.model";
export class Actor extends Entity{

    private _name!: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    private _surname!: string;
    public get surname(): string {
        return this._surname;
    }
    public set surname(value: string) {
        this._surname = value;
    }

    private _phone!: string;
    public get phone(): string {
        return this._phone;
    }
    public set phone(value: string) {
        this._phone = value;
    }

    private _role!: string;
    public get role(): string {
        return this._role;
    }
    public set role(value: string) {
        this._role = value;
    }

    private _email!: string;
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }

    private _password!: string;
    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }

    private _address!: string;
    public get address(): string {
        return this._address;
    }
    public set address(value: string) {
        this._address = value;
    }

    private _validate!: boolean;
    public get validate(): boolean {
        return this._validate;
    }
    public set validate(value: boolean) {
        this._validate = value;
    }

    constructor(){
        super()
    }


;


}
