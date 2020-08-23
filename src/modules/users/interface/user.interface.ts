export interface CreateUserDv {
    readonly rut: number;
    readonly rutDv: string;
    readonly firstname: string;
    readonly lastname: string;
    readonly phone: number;
    readonly password: string;
    readonly email: string;
}

export interface UserData {
    readonly rut: number;
    readonly firstname: string;
    readonly lastname: string;
    readonly phone: number;
    readonly password: string;
    readonly email: string;
}

export interface UpdateUser {
    readonly firstname?: string;
    readonly lastname?: string;
    readonly phone?: number;
    readonly password?: string;
    readonly email?: string;

}