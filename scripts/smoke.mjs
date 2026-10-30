import assert from 'node:assert/strict';
const base=(process.env.BASE_URL||'http://terminal.local:4173').replace(/\/$/,'');
function browser(){
  const jar=new Map();
  return async(path,options={})=>{
    const response=await fetch(base+path,{...options,signal:AbortSignal.timeout(35000),headers:{Origin:base,...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),Cookie:[...jar].map(([k,v])=>`${k}=${v}`).join('; '),...options.headers}});
    for(const c of response.headers.getSetCookie()){const [pair]=c.split(';');const at=pair.indexOf('=');jar.set(pair.slice(0,at),pair.slice(at+1));}
    const type=response.headers.get('content-type')||'';
    const body=type.includes('json')?await response.json():await response.arrayBuffer();
    return {status:response.status,body};
  };
}
const a=browser(),b=browser();
assert.equal((await a('/api/health')).status,200);console.log('PASS health');
assert.equal((await a('/api/session')).status,200);assert.equal((await b('/api/session')).status,200);
const own=await a('/api/grievances');assert.equal(own.body.requests.length,3);console.log('PASS browser-scoped sample workspace');
const source=await a('/api/chat',{method:'POST',body:JSON.stringify({question:'How do I report missed garbage collection?',language:'en'})});
assert.equal(source.body.supported,true);assert.equal(source.body.sources[0].id,'waste-collection');console.log('PASS supported answer, citation, and mode: '+source.body.mode);
const unsupported=await a('/api/chat',{method:'POST',body:JSON.stringify({question:'Can you approve my passport?',language:'en'})});
assert.equal(unsupported.body.supported,false);assert.equal(unsupported.body.sources.length,0);console.log('PASS unsupported question fallback');
const form=new FormData();for(const [k,v] of Object.entries({subject:'Sample smoke test: leaking water pipe',description:'Synthetic integration test: a sample public water pipe is leaking near Demo Ward 03. This is a test request, not a real complaint.',category:'Water & drainage',area:'Demo Ward 03 · Sample junction'}))form.set(k,v);
const pdf='%PDF-1.4\n% Synthetic attachment used by integration test\n';form.set('attachment',new Blob([pdf],{type:'application/pdf'}),'sample-evidence.pdf');
const created=await a('/api/grievances',{method:'POST',body:form});assert.equal(created.status,200);const {reference,trackingCode}=created.body;
assert.ok(reference&&/^\d{6}$/.test(trackingCode));console.log('PASS persisted submission and unique tracking details');
assert.equal((await b('/api/grievances/'+reference)).status,404);console.log('PASS cross-session isolation');
assert.equal((await b('/api/grievances/'+reference+'/attachment')).status,404);
assert.equal((await a('/api/grievances/'+reference+'/attachment')).status,200);console.log('PASS owner-only attachment download');
const track=await b('/api/track',{method:'POST',body:JSON.stringify({reference,code:trackingCode})});assert.equal(track.status,200);assert.equal(track.body.events[0].status,'Submitted');console.log('PASS tracking from a different session');
assert.equal((await b('/api/track',{method:'POST',body:JSON.stringify({reference,code:'12345'})})).status,400);
assert.equal((await a('/api/staff/queue')).status,401);console.log('PASS staff queue access restriction');
const forbidden=await a('/api/grievances/'+reference,{method:'PATCH',body:JSON.stringify({status:'Resolved',category:'Water & drainage',note:'Should not be accepted',expectedStatus:'Submitted'})});assert.equal(forbidden.status,401);
if(process.env.STAFF_PASSWORD){
  assert.equal((await a('/api/staff/login',{method:'POST',body:JSON.stringify({password:process.env.STAFF_PASSWORD})})).status,200);
  const invalid=await a('/api/grievances/'+reference,{method:'PATCH',body:JSON.stringify({status:'Resolved',category:'Water & drainage',note:'Invalid jump',expectedStatus:'Submitted'})});assert.equal(invalid.status,400);
  let current='Submitted';
  for(const next of ['Acknowledged','In progress','Resolved']){
    const update=await a('/api/grievances/'+reference,{method:'PATCH',body:JSON.stringify({status:next,category:'Water & drainage',note:`Synthetic smoke test: ${next.toLowerCase()} in the demo workflow.`,expectedStatus:current})});
    assert.equal(update.status,200);assert.equal(update.body.status,next);current=next;
  }
  const stale=await a('/api/grievances/'+reference,{method:'PATCH',body:JSON.stringify({status:'In progress',category:'Water & drainage',note:'Stale update must not overwrite newer status.',expectedStatus:'Submitted'})});assert.equal(stale.status,409);
  const verified=await b('/api/track',{method:'POST',body:JSON.stringify({reference,code:trackingCode})});assert.equal(verified.body.status,'Resolved');assert.equal(verified.body.events.length,4);console.log('PASS staff updates, atomic audit history, stale-write protection, and citizen readback');
  await a('/api/staff/logout',{method:'POST',body:'{}'});assert.equal((await a('/api/staff/queue')).status,401);console.log('PASS staff logout');
}else console.log('SKIP staff mutation checks: STAFF_PASSWORD is not configured');
console.log('All integration checks passed. Synthetic test records remain labelled in the demo database.');
