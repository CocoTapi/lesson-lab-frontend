import { NavLink, useRouteLoaderData } from "react-router-dom";

function MyPageNavigation(){
    const user = useRouteLoaderData('root');
    let user_id;
    let token;
    if(user) {
        token = user.token;
        user_id = user.user_id;
    }

    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to={token ? `/mypage/${user_id}`: '../auth?mode=login'}
                        >
                            ♥ Likes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={token ? `/mypage/${user_id}/upload`: '../auth?mode=login'}
                            >
                            My Uploads
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={token ? `/mypage/${user_id}/playlist`: '../auth?mode=login'}
                            >
                            My Playlists
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={token ? `/mypage/${user_id}/edit`: '../auth?mode=login'}
                            >
                            Edit Profile
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default MyPageNavigation;