import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import testRoutes from './routes/test.routes'; 

const app = express();

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//routes

app.use(testRoutes);

app.listen(3000);
