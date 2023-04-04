export interface ChangePasswordInterface {
    password: string;
    email: number;
    contrasenas?: {
        nuevacontrasena: string;
    };
}