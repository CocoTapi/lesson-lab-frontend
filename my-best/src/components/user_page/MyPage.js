function MyPage({ userDetail }){
    return (
        <div>
            {/* User Name */}
            <div>{userDetail.user_name}</div>
            <button>Edit Acount Profile</button>
            <div>{userDetail.first_name}</div>
            <div>{userDetail.last_name}</div>
            <div>{userDetail.last_login}</div>
            <div>{userDetail.email}</div>

        {/* Favorites */}
            {/* activity likes list */}

        {/* uploaded activities */}

        {/* Own Play List */}
        </div>
    )
}

export default MyPage;
