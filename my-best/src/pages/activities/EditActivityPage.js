import { useRouteLoaderData } from "react-router-dom";
import ActivityForm from "../../components/activities/ActivityForm";
import { Await } from "react-router-dom";
import { Suspense } from "react";
import Card from "../../components/UI/Card";

function EditActivityPage(){
    const { activity } = useRouteLoaderData('activity-detail');
    const { tags } = useRouteLoaderData('edit-tags');

    console.log(activity);
    console.log(tags);
      
    return (
        <Card>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={tags} >
                    {(loadedTags) => <ActivityForm existingTags={loadedTags} method="PATCH" activity={activity} />}
                </Await>
            </Suspense>
        </Card>
    )
};

export default EditActivityPage;