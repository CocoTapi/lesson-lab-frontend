import Card from "../../components/UI/SmallCard";
import ActivityForm from "../../components/activities/ActivityForm";
import { Await, useRouteLoaderData } from "react-router-dom";
import { Suspense } from "react";

function NewActivityPage(){
    const { tags } = useRouteLoaderData('tags');
    
    return (
        <Card>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={tags} >
                    {(loadedTags) => <ActivityForm existingTags={loadedTags} method="POST" />}
                </Await>
            </Suspense>
        </Card>
    )
}

export default NewActivityPage;
