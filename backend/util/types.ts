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

export interface ErrorMessage {
    [key: string]: string;
};

export interface AuthValidationErrorBoolean {
    length?: boolean,
    simbol?: boolean,
    num?: boolean
}

export interface ActivityFormInfo {
    userId: number,
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




