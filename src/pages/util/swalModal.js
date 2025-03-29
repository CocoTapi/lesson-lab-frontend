import Swal from "sweetalert2";
import { MESSAGE_BUTTON_COLOR } from "./commonConstants";

// Tell users a message. 
export function swalAlert(title, text, buttonWord){
    return (
         Swal.fire({
            title: title,
            text: text,
            showCancelButton: false,
            confirmButtonColor: MESSAGE_BUTTON_COLOR,
            confirmButtonText: buttonWord
        })
    )
}