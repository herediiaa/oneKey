export interface User{
    uid:string,
    name?:string | undefined,
    email:string | undefined,
    emailVerified: boolean
    photoUrl?:string,
}