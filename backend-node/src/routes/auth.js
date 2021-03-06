const router = require("express").Router()
const authController = require("../controllers/auth")
const validationMiddleware = require("../middleware/validationMiddleware")
const { check } = require("express-validator")

router.post(
    "/login",
    [
        check("userName")
        .isLength({ min: 6 })
        .withMessage("Must be at least 6 characters long"),
        check("password")
        .isLength({ min: 6 })
        .withMessage("Must be at least 6 characters long"),
    ],
    validationMiddleware,
    authController.login
);

router.post(
    "/signup",
    [
        check("userName")
        .isLength({ minLength: 5 })
        .withMessage("Must be at least 5 characters long"),
        check("password")
        .trim()
        .exists()
        .escape()
        .custom((value, { req }) => {
            if (value !== req.body.passwordConfirmation) {
                throw new Error('Password confirmation does not match password')
            }

            return true
        })
    ],
    validationMiddleware,
    authController.signup
);

router.get("/:userName", authController.getUser)

router.put("/modifyBalance/:userName", authController.modifyBalance)

router.get("/checkBalance/:userName", authController.getBalance)

module.exports = router