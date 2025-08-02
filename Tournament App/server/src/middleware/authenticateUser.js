import express from 'express';

export default function authenticateUser(req, res, next) {
    if (!req.isAuthenticated()) {
        console.log("Unauthorized user trying to log in")
        return res.status(401).json({ message: 'unauthorized' });
    }
    next();
}
