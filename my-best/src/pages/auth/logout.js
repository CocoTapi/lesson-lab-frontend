import { redirect } from 'react-router-dom';

export function logoutAction (){
    //console.log("logout");
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    return redirect('/');
};