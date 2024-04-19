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

export interface AuthRequest extends Request {
    email?: string; 
}

export interface ErrorMessage {
    [key: string]: string;
};

export interface AuthValidationErrorBoolean {
    length?: boolean,
    simbol?: boolean,
    num?: boolean
}

export interface ActivityFormInfo {
    user_id: number,
    title: string, 
    summary: string, 
    duration: number, 
    age_group: string, 
    objectives: string, 
    materials: string, 
    instructions: string, 
    links: string, 
    tags: string[],
    [key: string]: string | number | string[]
}

export interface ProfileInfo {
    user_id: number,
    user_name: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

//TODO: make all keys of ProfileInfo, SignupInfo, UserInfo same



