import { Outlet } from 'react-router-dom';
import Card from '../../components/UI/Card';

function LoginLayout(){
   
    return (
        <Card>
            <main>
              <Outlet />
            </main>
        </Card>
    )
}

export default LoginLayout;