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

    private _email!: String;
    public get email(): String {
        return this._email;
    }
    public set email(value: String) {
        this._email = value;
    }

    private _password!: String;
    public get password(): String {
        return this._password;
    }
    public set password(value: String) {
        this._password = value;
    }

    private _address!: String;
    public get address(): String {
        return this._address;
    }
    public set address(value: String) {
        this._address = value;
    }

    private _validate!: Boolean;
    public get validate(): Boolean {
        return this.validate;
    }
    public set validate(value: Boolean) {
        this._validate = value;
    }

    constructor(){
        super()
    }


;


}
