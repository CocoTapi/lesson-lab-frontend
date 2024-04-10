import express from "express";
import { asyncHandler } from "../util/route-util";
import { getAllActivities, getActivityDetail } from "./activity";


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

export default router;