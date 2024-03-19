import { Form } from 'react-router-dom';

function LoginNavigation(){
    return (
        <div>
            <ul>
                <li>
                    <Form action='google' method='post'>
                        <button>Google Login</button>
                    </Form>
                </li>
            </ul>
        </div>
    )
}

export default LoginNavigation;