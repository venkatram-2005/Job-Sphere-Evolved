import express from 'express'
import cors from 'cors'
import './config/instrument.js'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import subscriberRoutes from './routes/subscriberRoutes.js'

// Initialize express
const app = express()

// CORS middleware: allow localhost dev + production frontend
const allowedOrigins = [
  'http://localhost:5174', // dev frontend
  'https://your-production-frontend.com' // replace with actual deployed frontend
]

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps or curl)
    if(!origin) return callback(null, true)
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','token'],
  credentials: true
}))

// Middleware
app.use(express.json())
app.use(clerkMiddleware())

// Connect to DB and Cloudinary
await connectDB()
await connectCloudinary()

// Routes
app.get('/', (req, res) => res.send("API is working fine..."))
app.get("/debug-sentry", (req, res) => { throw new Error("My first Sentry error!"); })

app.post('/webhooks', clerkWebhooks)
app.use('/api/company', companyRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes)
app.use('/api/subscribe', subscriberRoutes)

// Port
const PORT = process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
