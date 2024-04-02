import Card from "../../components/UI/Card";
import NewActivityForm from "../../components/activities/NewActivityForm";

function NewActivityPage(){
    return <Card><NewActivityForm /></Card>
}

export default NewActivityPage;

export async function action({ request }){
    const data = await request.formData();
    const title = data.get('title');
    const duration = data.get('duration');
    const ageGroup = data.get('ageGroup');
    const instruction = data.get('instruction');
    const file0 = data.get('file0');
    const file1 = data.get('file1');

    console.log(data);
    console.log("title:", title);
    console.log("duration:", duration);
    console.log("ageGroup:", ageGroup);
    console.log("instruction:", instruction);
    console.log("file0:", file0);
    console.log("file1:", file1);

}