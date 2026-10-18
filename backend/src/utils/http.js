export class HttpError extends Error { constructor(status,message,details){super(message);this.status=status;this.details=details;} }
export const asyncHandler=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
export const ok=(res,data,status=200,meta)=>res.status(status).json({success:true,data,...(meta?{meta}:{})});
export function pagination(query){const page=Math.max(1,Number.parseInt(query.page)||1);const limit=Math.min(100,Math.max(1,Number.parseInt(query.limit)||20));return {page,limit,skip:(page-1)*limit};}
