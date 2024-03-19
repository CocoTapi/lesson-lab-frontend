import { Outlet } from 'react-router-dom';
import LoginNavigation from '../../components/LoginNavigation';
import Card from '../../components/UI/Card';

function LoginLayout(){
    return (
        <Card>
            <main>
                <Outlet />  
            </main>
            <LoginNavigation />
        </Card>
    )
}

export default LoginLayout;