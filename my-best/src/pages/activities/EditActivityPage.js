import { useLocation, useRouteLoaderData } from "react-router-dom";
import ActivityForm from "../../components/activities/ActivityForm";
import { Await } from "react-router-dom";
import { Suspense } from "react";

function EditActivityPage(){
    const { activity } = useRouteLoaderData('activity-detail');
    const { tags } = useRouteLoaderData('edit-tags');

    const location = useLocation();
    const prev_location = location.state?.prev_location || {pathname: '/activities'};
      
    return (
        <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
            <Await resolve={tags} >
                {(loadedTags) => <ActivityForm existingTags={loadedTags} method="PATCH" activity={activity} locationState={prev_location}  />}
            </Await>
        </Suspense>
    )
};

export default EditActivityPage;