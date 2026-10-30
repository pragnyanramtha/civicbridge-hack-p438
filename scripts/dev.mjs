import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const args=process.argv.slice(2);
const at=args.lastIndexOf('--port');
const port=at>=0?args[at+1]:(process.env.PORT||'3000');
const child=spawn(process.execPath,[require.resolve('next/dist/bin/next'),'dev','--hostname','0.0.0.0','--port',port],{stdio:'inherit'});
for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>child.kill(sig));
child.on('exit',code=>process.exit(code??1));
