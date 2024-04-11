import express from "express";
import { asyncHandler } from "../util/route-util";
import { getPopular100Tags } from "./tag";

const router = express.Router();

router.get('/', asyncHandler(async(req, res) => {
    const tags: string[] = await getPopular100Tags();
    res.status(200).json({ tags: tags});
}))

export default router;