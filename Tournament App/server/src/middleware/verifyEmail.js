import User from "../models/User.js";
const verifyEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.send({ exists: true });
        }
        return res.send({ exists: false });
    } catch (err) {
        return res.status(500).send("Internal server error");
    }
}

export default verifyEmail;