// Jaime's Path — Cloudflare Worker photo analysis
// Deploy separately from GitHub Pages. Never include real secret values in this public repository.
const SITE = "https://lazythomas.github.io";
const MAX_PER_DAY = 20;
function cors(req) {
 const origin = req.headers.get("Origin");
 return origin === SITE ? {"Access-Control-Allow-Origin":SITE,"Vary":"Origin","Access-Control-Allow-Methods":"POST,OPTIONS","Access-Control-Allow-Headers":"Authorization,Content-Type","Access-Control-Max-Age":"3600"} : {};
}
function reply(req,body,status=200){return new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",...cors(req)}})}
async function secretEqual(a,b){
 const encode=new TextEncoder(), [x,y]=await Promise.all([crypto.subtle.digest("SHA-256",encode.encode(a)),crypto.subtle.digest("SHA-256",encode.encode(b))]);
 let diff=0;const one=new Uint8Array(x),two=new Uint8Array(y);for(let i=0;i<one.length;i++)diff|=one[i]^two[i];return diff===0;
}
const nutritionSchema={type:"object",additionalProperties:false,properties:{foods:{type:"array",items:{type:"object",additionalProperties:false,properties:{name:{type:"string"},calories:{type:"number"},protein:{type:"number"},carbs:{type:"number"},fat:{type:"number"}},required:["name","calories","protein","carbs","fat"]}}},required:["foods"]};
export default {async fetch(request,env,ctx){
 const url=new URL(request.url);
 if(url.pathname!=="/analyze")return reply(request,{error:"Not found"},404);
 const origin=request.headers.get("Origin");
 if(origin!==SITE)return new Response("Forbidden origin",{status:403});
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers:cors(request)});
 if(request.method!=="POST")return reply(request,{error:"Method not allowed"},405);
 if(!env.OPENAI_API_KEY||!env.PHOTO_ACCESS_CODE||!env.USAGE)return reply(request,{error:"Service not configured"},503);
 const auth=request.headers.get("Authorization")||"";
 if(!auth.startsWith("Bearer ")||!(await secretEqual(auth.slice(7),env.PHOTO_ACCESS_CODE)))return reply(request,{error:"Unauthorized"},401);
 const size=Number(request.headers.get("Content-Length")||0);
 if(size>3000000)return reply(request,{error:"Image exceeds size limit"},413);
 const day=new Date().toISOString().slice(0,10);
 const ip=request.headers.get("CF-Connecting-IP")||"unknown";
 const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(ip+"|"+day+"|"+env.PHOTO_ACCESS_CODE));
 const bucket=day+"-"+Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("");
 // KV counting is eventually consistent; also configure platform rate limiting and OpenAI spend limits.
 const count=Number(await env.USAGE.get(bucket)||"0");
 if(count>=MAX_PER_DAY)return reply(request,{error:"Daily photo limit reached"},429);
 let payload;
 try{payload=await request.json()}catch{return reply(request,{error:"Invalid JSON"},400)}
 const image=payload?.image;
 if(typeof image!=="string"||!/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image)||image.length>2800000)return reply(request,{error:"Invalid or oversized image"},400);
 // Count attempts before making an external billed call.
 await env.USAGE.put(bucket,String(count+1),{expirationTtl:172800});
 const prompt="Identify visible edible items in this meal photo. Return estimated calories and protein, carbohydrates and fat in grams for each distinguishable food. Use conservative reasonable serving assumptions; avoid spurious precision and never say results are verified. If no foods are identifiable, return an empty foods array. Values must be nonnegative numbers. Consider oils and sauces only if reasonably visible; user will review and correct.";
 let response;
 try{response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:env.OPENAI_MODEL||"gpt-4.1-mini",store:false,max_output_tokens:1100,input:[{role:"user",content:[{type:"input_text",text:prompt},{type:"input_image",image_url:image,detail:"auto"}]}],text:{format:{type:"json_schema",name:"food_estimate",strict:true,schema:nutritionSchema}}})})}
 catch{return reply(request,{error:"Analysis provider unavailable"},502)}
 if(!response.ok){return reply(request,{error:response.status===429?"AI service rate limited":"AI service failed"},502)}
 let raw;try{raw=await response.json()}catch{return reply(request,{error:"Unparseable AI response"},502)}
 const out=(raw.output||[]).filter(x=>x.type==="message").flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("");
 let parsed;try{parsed=JSON.parse(out)}catch{return reply(request,{error:"Model did not return valid nutrition estimates"},502)}
 if(!Array.isArray(parsed.foods))return reply(request,{error:"Invalid nutrition estimate"},502);
 const foods=parsed.foods.slice(0,20).filter(f=>f&&typeof f.name==="string"&&f.name.length<150&&["calories","protein","carbs","fat"].every(k=>typeof f[k]==="number"&&Number.isFinite(f[k])&&f[k]>=0&&f[k]<10000));
 return reply(request,{foods,disclaimer:"AI estimates may be inaccurate, especially for portion size, oils, ingredients and sauces. Confirm before saving."});
}};
