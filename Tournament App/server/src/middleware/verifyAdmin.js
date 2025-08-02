const verifyAdmin = (req, res, next) => {
    const { role } = req.user;
    console.log(role);
    if (role === "user") {
        console.log("User is not admin");
        return res.status(401).send("Not admin");
    }
    next();
}

export default verifyAdmin;