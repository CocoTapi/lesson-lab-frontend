import { Outlet } from 'react-router-dom';

function LoginLayout(){
   
    return (
        <main>
            <Outlet />
        </main>
    )
}

export default LoginLayout;