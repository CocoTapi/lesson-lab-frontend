import { AuthValidationErrorBoolean } from "./types";

export function isValidText(value: string, minLength: number = 1){
    return value && value.trim().length >= minLength;
};

export function isValidEmail(value: string) {
    return value && value.includes("@");
};

export function isValidPassword(value: string, minLength: number = 8) {
    let validity: AuthValidationErrorBoolean = {
        length: false,
        simbol: false,
        num: false
    };

    if (value && value.trim().length >= minLength) validity.length = true; 
    if (value && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) === true) validity.simbol = true;
    if (value && /\d/.test(value) === true) validity.num = true;

    return validity;
}

export function isValidDuration(value: number) {
    if (
        value &&
        value === 5 ||
        value === 10 ||
        value === 15 ||
        value === 20 ||
        value === 30 ||
        value === 31
    ) {
        return true
    }
}

export function isValidAgeGroup(value: string) {
    if (
        value &&
        value === "all age" ||
        value === "teens and adults" ||
        value === "teens" ||
        value === "kids" ||
        value === "adults"
    ) {
        return true
    }
}

export function isValidUrl(value: string) {
    return value && value.trim().startsWith('http');
}

export function isValidLinks(value: string) {
    if (value === "null") return true;

    if(!isValidUrl(value)) return false

    return true;
}

export function isValidTags(arr: string[], minLength: number = 1) {
    return arr && arr.length >= minLength;
}
