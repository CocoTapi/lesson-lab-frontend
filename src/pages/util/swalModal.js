import Swal from "sweetalert2";
import { GREY_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from "./commonConstants";

// Tell users a message. 
export function swalAlert(title, text, buttonWord){
    return (
         Swal.fire({
            title: title,
            text: text,
            showCancelButton: false,
            confirmButtonColor: PRIMARY_COLOR,
            confirmButtonText: buttonWord
        })
    )
}

// Success
export function swalSuccess(){
    return (
        Swal.fire({
            title: "Success!",
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
export function modalWarningForComponent(
    title,
    text, 
    confirmButtonText,
    afterConfirmFn
){
    return Swal.fire({
    title: title,
    text:  text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: SECONDARY_COLOR,
    cancelButtonColor: GREY_COLOR,
    confirmButtonText: confirmButtonText
    }).then((result) => {
    if (result.isConfirmed) {
        afterConfirmFn();
    }
    });
}