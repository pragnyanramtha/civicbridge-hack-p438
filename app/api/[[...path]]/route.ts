import { HttpError, attachment, chat, createGrievance, feedback, initSession, listGrievances, originCheck, readGrievance, staffLogin, staffLogout, track, updateGrievance } from "@/lib/server";
import { services } from "@/lib/catalog";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export const maxDuration=30;
type Context={params:Promise<{path?:string[]}>};
async function handle(req:Request,context:Context){
  try{
    const {path=[]}=await context.params;const route=path.join("/");
    if(req.method!=="GET")originCheck(req);
    let result:unknown;
    if(req.method==="GET"&&route==="health")result={ok:true,application:"CivicBridge",demo:true};
    else if(req.method==="GET"&&route==="session")result=await initSession(req);
    else if(req.method==="GET"&&route==="services")result={services};
    else if(req.method==="GET"&&route==="grievances")result=await listGrievances();
    else if(req.method==="GET"&&route==="staff/queue")result=await listGrievances(true);
    else if(req.method==="GET"&&path[0]==="grievances"&&path.length===3&&path[2]==="attachment")return await attachment(path[1]);
    else if(req.method==="GET"&&path[0]==="grievances"&&path.length===2)result=await readGrievance(path[1]);
    else if(req.method==="POST"&&route==="grievances")result=await createGrievance(req);
    else if(req.method==="POST"&&route==="track")result=await track(req);
    else if(req.method==="PATCH"&&path[0]==="grievances"&&path.length===2)result=await updateGrievance(req,path[1]);
    else if(req.method==="POST"&&route==="staff/login")result=await staffLogin(req);
    else if(req.method==="POST"&&route==="staff/logout")result=await staffLogout();
    else if(req.method==="POST"&&route==="chat")result=await chat(req);
    else if(req.method==="POST"&&route==="feedback")result=await feedback(req);
    else throw new HttpError(404,"Endpoint not found.");
    return Response.json(result,{headers:{"Cache-Control":"private, no-store"}});
  }catch(error){
    if(error instanceof HttpError)return Response.json({error:error.message},{status:error.status,headers:{"Cache-Control":"no-store"}});
    if(error instanceof SyntaxError)return Response.json({error:"The request format is not valid."},{status:400});
    console.error("CivicBridge request failed",error instanceof Error?error.name:"UnknownError");
    return Response.json({error:"We couldn’t complete that request. Please try again shortly."},{status:503,headers:{"Cache-Control":"no-store"}});
  }
}
export const GET=handle;
export const POST=handle;
export const PATCH=handle;
