import express from "express";
import { asyncHandler } from "../util/route-util";
import { getAllActivities, getActivityDetail } from "./activity";
import { isValidText } from "../util/validation";


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
    const data = req.body;
    //const errors : ValidationErrorMessage = await checkValidation(data);
}))



export default router;