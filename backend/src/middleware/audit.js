import { AuditLog } from '../models/index.js';
export async function audit(req,action,resourceType,resourceId,metadata={}){try{await AuditLog.create({actor:req.user?._id,action,resourceType,resourceId:String(resourceId||''),metadata,ip:req.ip});}catch(e){console.error('Audit log write failed:',e.message);}}
