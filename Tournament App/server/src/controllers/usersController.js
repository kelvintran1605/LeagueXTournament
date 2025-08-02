import User from "../models/User.js";
import passport from "passport";
import bcrypt from 'bcrypt';
import Team from "../models/Team.js";
import { cloudinary, upload } from "../config/cloudinary.js";

export const getAllUsers = async (req, res) => {
    try {
        const userData = await User.find().populate("teamId");
        res.status(200).send(userData);
    }
    catch (err) {
        res.status(500).send({ error: "Error in fetching user data" });
    }
}

export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, address, gender, position } = req.body;

        // hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name: firstName + " " + lastName,
            email,
            password: hashedPassword,
            location: address.city + ", " + address.state + ", " + address.code,
            gender,
            position,
            role: "user"
        });
        await newUser.save();
        res.status(201).send("User is created!");
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

export const loginUser = (req, res) => {
    passport.authenticate("local", async (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (!user) {
            return res.status(401).json({ message: info?.message || "Login failed" });
        }

        req.login(user, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Login error" });
            }
            return res.status(200).json({
                message: "Login successful",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    position: user.position,
                    gender: user.gender,
                    location: user.location,
                    teamId: user.teamId,
                    profileImage: user.profileImage,
                    role: user.role
                },
            });
        });
    })(req, res);
}

export const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Logout failed' });

        req.session.destroy((err) => {
            if (err) return res.status(500).json({ message: 'Failed to destroy session' });

            res.clearCookie("connect.sid");
            res.status(200).json({ message: "Logged out" });
            console.log("User logged out")
        });
    });
}

export const createTeamId = async (req, res) => {
    const { _id, teamId } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $set: { teamId: teamId } },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User's teamId updated",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export const getProfile = async (req, res) => {
    const { profileImage, name, email, position, gender, location, _id, teamId, role } = req.user;
    console.log(req.user);
    res.status(200).send({
        user: {
            _id,
            name,
            email,
            position,
            gender,
            location,
            teamId,
            profileImage,
            role
        }
    })

}

export const updateProfile = async (req, res) => {
    const userId = req.user._id;
    const { name, email, gender, position, location } = req.body;
    const user = await User.findById(userId);
    const oldPublicId = user?.profileImage?.publicId;
    try {
        let updatedFields = {
            name,
            email,
            gender,
            position,
            location
        }
        let uploadResponse;
        if (req.file) {
            const base64EncodedImage = req.file.buffer.toString("base64");
            const dataUri = `data:${req.file.mimetype};base64,${base64EncodedImage}`;

            if (oldPublicId) {
                uploadResponse = await cloudinary.uploader.upload(dataUri, {
                    public_id: oldPublicId,
                    overwrite: true,
                    invalidate: true
                });
            }
            else {
                uploadResponse = await cloudinary.uploader.upload(dataUri);
            }

            updatedFields.profileImage = {
                publicId: uploadResponse.public_id,
                url: uploadResponse.secure_url
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });
        if (updatedUser) {
            res.status(200).send(updatedUser);
        }
        else {
            res.status(404).send("Couldn't find user name");
        }
    }
    catch (err) {
        console.log(err);
        if (uploadResponse?.public_id) {
            await cloudinary.uploader.destroy(uploadResponse.public_id);
        }
        res.status(500).send("Internal server error");
    }
}

export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user._id);
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            res.status(401).send("Incorrect password");
        }
        else {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
            await user.save();
            res.status(200).send("Password updated");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
}

export const deleteUser = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json("User not found");
        }
        const teamId = user.teamId;

        if (teamId) {
            const team = await Team.findById(teamId);

            if (team && team.captainId.toString() === user._id.toString()) {
                await Team.findByIdAndDelete(teamId);
            } else {
                await Team.updateOne(
                    { _id: teamId },
                    { $pull: { userIds: user._id } }
                );
            }
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json("User and related team data handled.");

    }
    catch (err) {
        console.log(err);
        res.status(500).json("Something went wrong");
    }
}

export const createAdmin = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = new User({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });
        const savedAdmin = await newAdmin.save();
        console.log("This  is the saved admin" + savedAdmin);
        res.status(201).send(savedAdmin);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}