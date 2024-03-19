import { redirect } from 'react-router-dom';

export function action (){
    //TODO: handle token
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    return redirect('/');
};