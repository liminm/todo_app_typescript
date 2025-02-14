import {Router, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, {IUser} from '../models/User';
import {check, validationResult} from 'express-validator'


const router: Router = Router();

router.post('/register', [
        check('name', 'Please provide a name.').notEmpty(),
        check('email', 'Please provide a valid email.').isEmail(),
        check('password', 'Please provide a password with 6 or more characters.').isLength({min: 6})
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array()});
            return
        }
        ;


        const {name, email, password} = req.body;

        try {
            const existingUser = await User.findOne({email});
            if (existingUser) {
                res.status(400).json({error: 'User already exists'});
                return
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser: IUser = new User({
                name,
                email,
                password: hashedPassword
            })

            const savedUser = await newUser.save();
            const token = jwt.sign({userId: savedUser._id}, process.env.JWT_SECRET as string, {expiresIn: '1h'});
            res.status(201).json({
                token,
                user: {
                    id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email
                }
            })
        } catch (err) {
            res.status(500).json({error: 'Server error during registration'});
        }
    })

router.post('/login', [
        check('email', 'Please provide a valid email.').isEmail(),
        check('password', 'Please provide a password with 6 or more characters.').isLength({min: 6})
    ],
    async (req: Request, res: Response) => {
        const {email, password} = req.body;

        try {
            const user = await User.findOne({email});
            if (!user) {
                res.status(400).json({error: 'Invalid credentials'});
                return
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({error: 'Invalid credentials'});
                return
            }

            const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET as string, {expiresIn: '1h'});

            res.status(200).json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            })

        } catch (err) {
            res.status(500).json({error: 'Server error during login'});
        }
    }
)

export default router;