export interface SignUpInfo extends LoginInfo {
    firstName: string,
    lastName: string,
}

export interface LoginInfo {
    email: string,
    password: string
}

export interface UserInfo {
    user_id: number,
    first_name: string,
    last_name: string,
    email: string,
    created_date: Date,
    last_update: Date,
    last_login: Date
}

export interface GoogleUser {
    sub?: string,
    name?: string,
    given_name: string,
    family_name: string,
    picture?: string,
    email?: string,
    email_verified?: boolean,
    locale?: string
}


