import express from "express";
import { asyncHandler } from "../util/route-util";
import { getAllActivities, getActivityDetail, checkAFormValidation, addActivity, editActivity, removeActivity } from "./activity";
import { ActivityFormInfo, ErrorMessage } from "../util/types";



const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    const activities = await getAllActivities();
    res.status(200).json({ activities: activities});
}))

router.get('/:id', asyncHandler(async (req, res) => {
    const id: string = req.params.id;
    const activity = await getActivityDetail(id);
    res.status(200).json({ activity: activity });
}))

//TODO: add token check
//router.use(checkAuth)

router.post('/', asyncHandler(async (req, res) => {
    //consloe.log(req.token);
    const formData: ActivityFormInfo = req.body;
    const errors: ErrorMessage = await checkAFormValidation(formData);

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            message: "Adding a new activity failed due to validation errors.",
            errors,
        })
    }

    await addActivity(formData);
    res.status(200).json({ message: 'Successfully added an activity.' });
}))

router.patch('/:id', asyncHandler(async (req, res) => {
    const formData: ActivityFormInfo = req.body;
    const activity_id: number = parseInt(req.params.id);
    const errors: ErrorMessage = await checkAFormValidation(formData);

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            message: "Adding a new activity failed due to validation errors.",
            errors,
        })
    }

    await editActivity(activity_id, formData);
    res.status(200).json({ message: 'Activity Updated.' });
}))

router.delete('/:id', asyncHandler(async (req, res) => {
    const id: number = parseInt(req.params.id);

    await removeActivity(id);
    res.status(200).json({ message: 'Activity deleted.'});
}))

export default router;