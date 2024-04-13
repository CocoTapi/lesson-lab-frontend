
function HomePage() {
    const { userData } = {userId: 100, userName:'Dodger'};
    const { userId, userName } = userData;
    return (
        <div>
            <hi>{`Welcome back ${userName}`}</hi>
            <div>User Id: {userId}</div>
        </div>
    )
};

export default HomePage;