

function UserPage(){
    const { userData } = useLoaderData('user-detail');
    return (
        <>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={userData}>
                    {(loadedData) => <ActivityItem userData={loadedData} />}
                </Await>
            </Suspense>
           
        </>
    )
}

export default UserPage;

async function loadUserData(id) {
    //TODO: check authentication 
    const token = getAuthToken();

    const response = await fetch(`${API_URL}/mypage/` + id);

    if(!response.ok) {
        throw json({message: "Could not fetch user detail."}, { status: 500})
    }

    const resData = await response.json();
    console.log(resData);

    return resData.userData;
}

export async function loader({ request, params }){
    const id = params.userId;

    return defer({
        userData: await loadUserData(id)
    })
}

