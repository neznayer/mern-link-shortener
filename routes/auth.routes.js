const { Router } = require("express");
const User = require("../models/User");
const brcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const { check, validationResult } = require("express-validator");

router = Router();

router.post(
    "/register",
    [
        check("email", "the email address is not correct").isEmail(),
        check("password", "Minimum password length 6 characters").isLength({
            min: 6,
        }),
    ],

    async (req, res) => {
        try {
            const { email, password } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect reqistration data",
                });
            }

            const candidate = await User.findOne({ email });
            if (candidate) {
                return res
                    .status(400)
                    .json({ message: "User with this email already exists" });
            }

            const hashedPassword = await brcrypt.hash(password, 12);
            const user = new User({ email, password: hashedPassword });

            await user.save();

            res.status(201).json({
                message: "New user succesufully been created",
            });
        } catch (e) {
            res.status(500).json({ message: "Something went wrong" });
        }
    }
);

router.post(
    "/login",
    [
        check("email", "Enter correct email").normalizeEmail().isEmail(),
        check("password", "Enter password").exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect login data",
                });
            }

            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            const isMatch = await brcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({ message: "Wrong password" });
            }

            // esli my doshli do syuda, to user ok i ego nuzhno avtorizovat

            const token = jwt.sign(
                { userId: user.id },
                config.get("jwtSecret"),
                { expiresIn: "1h" }
            );

            // response to user (status is 200 by default)
            res.json({ token, userId: user.id });
        } catch (e) {
            res.status(500).json({ message: "Something went wrong" });
        }
    }
);
module.exports = router;
