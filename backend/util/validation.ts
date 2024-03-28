import { ValidationErrorBoolean } from "./types";

export function isValidText(value: string, minLength: number = 1){
    return value && value.trim().length >= minLength;
};

export function isValidEmail(value: string) {
    return value && value.includes("@");
};

export function isValidPassword(value: string, minLength: number = 8) {
    let validity: ValidationErrorBoolean = {
        length: false,
        simbol: false,
        num: false
    };

    if (value && value.trim().length >= minLength) validity.length = true; 
    if (value && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) === true) validity.simbol = true;
    if (value && /\d/.test(value) === true) validity.num = true;

    return validity;
}
