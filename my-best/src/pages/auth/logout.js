import { redirect } from 'react-router-dom';

export function action (){
    console.log("logout");
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    return redirect('/');
};