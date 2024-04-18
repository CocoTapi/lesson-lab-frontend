import express from "express";
import { asyncHandler } from "../util/route-util";
import { LoginInfo, SignUpInfo, ErrorMessage } from "../util/types";
import { checkAuth } from "../util/auth";
import { getUserDataFromEmail, getUserFavorites, getUserProfile } from "./user";
import env from "dotenv";

env.config();

const router = express.Router();

//user info retrieval using token
router.get('/', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const userInfo = await getUserDataFromEmail(verifiedEmail);

    res.status(200).json({ 
        message: 'Successfully got user data from token',
        data: userInfo
     });
}))


//get user profile and favorites
router.get('/:id', asyncHandler(async (req, res) => {
    const id: number = parseInt(req.params.id);
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    //check token
    const userProfile = await getUserProfile(verifiedEmail);
    const verifiedId = userProfile.user_id;
    if (id !== verifiedId) throw Error("Auth Error. Token and user_id doesn't match")
    
    const userFavorites = await getUserFavorites(verifiedId);

    res.status(200).json({ userProfile: userProfile, userFavorites: userFavorites });
}))

//edit user profile
router.patch('/:id', asyncHandler(async (req, res) => {
    // const formData: SignUpInfo = req.body;
    // const user_id: number = parseInt(req.params.id);
    // console.log("formData", formData);
    // console.log("user_id:", user_id)
    // const errors: ErrorMessage = await checkFormValidation(formData);

    // if (Object.keys(errors).length > 0) {
    //     return res.status(422).json({
    //         message: "Edit profile failed due to validation errors.",
    //         errors,
    //     })
    // }

    // await editProfile(activity_id, formData);
    res.status(200).json({ userDetail: 'uploaded user detail' });
}))

// router.delete('/:id', asyncHandler(async (req, res) => {
//     const user_id: number = parseInt(req.params.id);

//     await removeProfile(user_id);
//     res.status(200).json({ message: 'Profile deleted.'});
// }))

export default router;