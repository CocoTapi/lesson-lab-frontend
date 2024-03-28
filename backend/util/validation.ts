export function isValidText(value, minLength = 1): string {
    return value && value.trim().length >= minLength;
};

export function isValidEmail(value): string {
    return value && value.includes("@");
};

export function isValidPassword(value,minLength = 8): string {
    let length = false;
    let simbol = false;
    let num = false;

    if (value.trim().length >= minLength) length = true; 
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) === true) simbol = true;
    if (/\d/.test(value) === true) num = true;

    return value && length && simbol && num;
}
