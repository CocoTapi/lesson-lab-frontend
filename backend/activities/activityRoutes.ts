import express from "express";
import { asyncHandler } from "../util/route-util";
import { getAllActivities } from "./activity";


const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    const activities = await getAllActivities();
    res.status(200).json({ activities: activities})
}))

router.get('/:id', asyncHandler(async (req, res) => {}))

export default router;