import { Link } from "react-router-dom";

function MyPage({ userDetail }){
   
    //const user_id = user.user_id;

    return (
        <div>
            {/* User Name */}
            <div>My Page</div>
            <div>{userDetail}</div>
            {/* last login */}

            <Link to='edit'>Edit Acount Profile</Link>
          

        {/* Favorites */}
            {/* activity likes list */}

        {/* uploaded activities */}

        {/* Own Play List */}
        </div>
    )
}

export default MyPage;
