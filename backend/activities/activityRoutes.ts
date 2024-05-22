import express from "express";
import { asyncHandler } from "../util/route-util";
import {
    getAllActivities,
    getAllActivitiesUser,
    getActivityDetail,
    checkFormValidation,
    addActivity,
    editActivity,
    removeActivity,
    getActivityDetailUser,
    getFilteredActivities,
    getFilteredActivitiesUser
} from "./activity";
import { ActivityFormInfo, ErrorMessage } from "../util/types";
import { checkAuth } from "../util/auth";



const router = express.Router();

//get summary list
router.get('/', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const id: number = parseInt(req.params.id);
    const searchTerm: string = req.body.searchTerm;
    
    let verifiedEmail;
    if (authHeader)
        verifiedEmail = await checkAuth(method, authHeader);
    
    let activities;
    if (verifiedEmail)
        activities = await  getAllActivitiesUser(verifiedEmail);
    else activities = await  getAllActivities();
   
    res.status(200).json({ activities: activities });
}))

//get activity detail
router.get('/:id', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    let verifiedEmail;
    if (authHeader)
        verifiedEmail = await checkAuth(method, authHeader);

    const id: number = parseInt(req.params.id);
    let activity;
    if (verifiedEmail)
        activity = await getActivityDetailUser(id, verifiedEmail);
    else activity = await getActivityDetail(id);
    res.status(200).json({ activity: activity });
}))

//get filtered summary list
router.post('/search', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const id: number = parseInt(req.params.id);
    const searchTerm: string = req.body.searchTerm;
    
    let verifiedEmail;
    if (authHeader)
        verifiedEmail = await checkAuth(method, authHeader);
    
    let filteredActivities;
    if(verifiedEmail) {
        filteredActivities = await getFilteredActivitiesUser(verifiedEmail, searchTerm)
    } else {
        filteredActivities = await getFilteredActivities(searchTerm);
    }

    res.status(200).json({ activities: filteredActivities });
}))

router.post('/', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);
    console.log("Pass Authorization. verifiedEmail:", verifiedEmail);

    const formData: ActivityFormInfo = req.body;
    console.log(formData);
    const errors: ErrorMessage = await checkFormValidation(formData);

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
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);
    console.log("Pass Authorization. verifiedEmail:", verifiedEmail);


    const formData: ActivityFormInfo = req.body;
    const activity_id: number = parseInt(req.params.id);
    const errors: ErrorMessage = await checkFormValidation(formData);

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            message: "Adding a new activity failed due to validation errors.",
            errors,
        })
    }

    formData.activity_id = activity_id;

    await editActivity(activity_id, formData);
    res.status(200).json({ message: 'Activity Updated.' });
}))

router.delete('/:id', asyncHandler(async (req, res) => {
    const id: number = parseInt(req.params.id);

    await removeActivity(id);
    res.status(200).json({ message: 'Activity deleted.' });
}))

export default router;