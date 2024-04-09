import { useRouteLoaderData } from "react-router-dom";
import ActivityForm from "../../components/activities/ActivityForm";
import { Await } from "react-router-dom";
import { Suspense } from "react";
import Card from "../../components/UI/Card";

function EditActivityPage(){
    const data = useRouteLoaderData('activity-detail');
    const { tags } = useRouteLoaderData('tags');
      
    return (
        <Card>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={tags} >
                    {(loadedTags) => <ActivityForm existingTags={loadedTags} method="PATCH" activity={data.activity} />}
                </Await>
            </Suspense>
        </Card>
    )
};

export default EditActivityPage;