import Swal from "sweetalert2";
import { GREY_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from "./commonConstants";

// Tell users a message. 
export function swalAlert(title, text, buttonWord ){
    return (
         Swal.fire({
            title: title,
            text: text,
            showCancelButton: false,
            confirmButtonColor: PRIMARY_COLOR,
            confirmButtonText: buttonWord,
        })
    )
}

// Tell users a message. 
export function swalQuestion(title, text, buttonWord, ){
    return (
         Swal.fire({
            title: title,
            text: text,
            showCancelButton: false,
            confirmButtonColor: PRIMARY_COLOR,
            confirmButtonText: buttonWord,
            icon: "question"
        })
    )
}

// Success
export function swalSuccess(text){
    return (
        Swal.fire({
            title: "Success!",
            text: text,
            icon: "success",
            draggable: true,
            confirmButtonColor: SECONDARY_COLOR
          })
    )
}


// Error
export function swalError(){
    return (
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong. Please try again later.",
            confirmButtonColor: PRIMARY_COLOR,
          }) 
    )
}

// Ask Confirmation
export function swalWarningForComponent(
    text, 
    confirmButtonText,
){
    return Swal.fire({
    title: "Are you sure?",
    text:  text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: SECONDARY_COLOR,
    cancelButtonColor: GREY_COLOR,
    confirmButtonText: confirmButtonText
    })
}