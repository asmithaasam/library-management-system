import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { HttpError, asyncHandler } from '../utils/http.js';
export const protect=asyncHandler(async(req,_res,next)=>{const h=req.headers.authorization;if(!h?.startsWith('Bearer '))throw new HttpError(401,'Authentication required');let payload;try{payload=jwt.verify(h.slice(7),process.env.JWT_SECRET);}catch{throw new HttpError(401,'Invalid or expired token');}const user=await User.findById(payload.sub);if(!user||user.status!=='active')throw new HttpError(401,'Account unavailable');req.user=user;next();});
export const allow=(...roles)=>(req,_res,next)=>{if(!req.user||!roles.includes(req.user.role))return next(new HttpError(403,'Insufficient permissions'));next();};
