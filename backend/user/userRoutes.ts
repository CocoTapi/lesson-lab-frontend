import express from "express";
import { asyncHandler } from "../util/route-util";
import { LoginInfo, SignUpInfo, ErrorMessage } from "../util/types";
import { createJSONToken, verifyToken } from "../util/auth";
import env from "dotenv";

env.config();

const router = express.Router();

router.get('/:id', asyncHandler(async (req, res) => {
    const formData: SignUpInfo = req.body;
    const user_id: number = parseInt(req.params.id);
    console.log("formData", formData);
    console.log("user_id:", user_id)
//     const errors: ErrorMessage = await checkFormValidation(formData);

//     if (Object.keys(errors).length > 0) {
//         return res.status(422).json({
//             message: "Edit profile failed due to validation errors.",
//             errors,
//         })
//     }

//     await editProfile(activity_id, formData);
    res.status(200).json({ userDetail: 'uploaded user detail' });
}))

// router.delete('/:id', asyncHandler(async (req, res) => {
//     const user_id: number = parseInt(req.params.id);

//     await removeProfile(user_id);
//     res.status(200).json({ message: 'Profile deleted.'});
// }))

export default router;