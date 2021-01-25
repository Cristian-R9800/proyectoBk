import express from 'express'
import passport from 'passport'
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes';
import studentRoutes from "./routes/student.routes";
import coursesRoutes from "./routes/courses.routes";


const app = express();

// settings
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//app.use(passport.initialize());
//passport.use(passportMiddleware);

app.get('/', (req, res) => {
  return res.send(`The API is at http://localhost:${app.get('port')}`);
})

app.use(authRoutes);
app.use(studentRoutes);
app.use(coursesRoutes);


export default app;
