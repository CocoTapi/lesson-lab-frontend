import { Link } from "react-router-dom";
import FavoriteList from "./FavoriteList";

function MyPage({ userProfileAndFav }){
    console.log(userProfileAndFav)
   const userProfile = userProfileAndFav.userProfile;
   const userFavorites = userProfileAndFav.userFavorites;

    return (
        <div>
            {/* User Name */}
            <div>My Page</div>
            <div>{userProfile.user_name}</div>

            {/* last login */}

            <Link to='edit'>Edit Profile</Link>
          

        {/* Favorites */}
            <FavoriteList userFavorites={userFavorites} />

        {/* uploaded activities */}

        {/* Own Play List */}
        </div>
    )
}

export default MyPage;
