const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
function cargar(path,globals,names){
 const src=readFileSync(path,'utf8').replace(/^import .*;\n/gm,'').replace(/export /g,'');
 return vm.runInNewContext(src+'\n;({'+names.join(',')+'})',globals);
}
(async()=>{
 let compras=0;
 const {crearCompraDirecta}=cargar('wix/backend/compra-rapida.web.js',{
 Permissions:{Anyone:1},webMethod:(_,fn)=>fn,wixData:{get:async()=>({visible:true,inStock:true})},
 checkout:{createCheckout:async()=>{compras++;return {_id:'checkout'}}},MAX_UNIDADES_POR_PIEZA:5,
 RX_EMAIL:/@/,limpiarEmail:x=>x||'',limpiarCelular:x=>x||'',texto:x=>String(x||'')
 },['crearCompraDirecta']);
 assert.equal((await crearCompraDirecta(null)).ok,false);
 const productId='12345678-1234-1234-1234-123456789abc';
 for(const cantidad of [0,7,-1,1.5,'2','2x']) assert.equal((await crearCompraDirecta({productId,cantidad})).ok,false);
 assert.equal(compras,0);
 assert.equal((await crearCompraDirecta({productId,cantidad:2})).ok,true);
 assert.equal(compras,1);
 const {getValidationViolations}=cargar('wix/backend/service-plugins/ecom-validations/sandara-limites/sandara-limites.js',{MAX_UNIDADES_POR_PIEZA:5},['getValidationViolations']);
 const lineItems=[1,2].map(i=>({_id:String(i),quantity:3,catalogReference:{appId:'stores',catalogItemId:'same'}}));
 assert.equal((await getValidationViolations({validationInfo:{lineItems},sourceInfo:{source:'CHECKOUT'}})).violations.length,2);
 assert.equal((await getValidationViolations({})).violations.length,0);
 const elements=new Map();
 const $w=id=>{if(!elements.has(id))elements.set(id,{getSelectedChoices:async()=>({}),getQuantity:async()=>1,value:'',enable(){this.enabled=true},disable(){this.enabled=false},expand(){},collapse(){}});return elements.get(id)};
 $w.onReady=()=>{};
 const source=readFileSync('wix/frontend/pagina-producto.js','utf8').replace(/^import .*;\n/gm,'');
 const ctx=vm.createContext({$w,leerDatos:()=>null,currentMember:{getMember:async()=>null},wixWindowFrontend:{openLightbox:async()=>{throw Error('offline')}}});
 vm.runInContext(source+"\nproducto={_id:'test',formattedPrice:'S/ 100'};",ctx);
 await vm.runInContext('comprarAhora(false)',ctx);
 assert.equal($w('#btnComprarAhora').enabled,true);
 assert.equal($w('#btnComprarAhora').label,'COMPRAR AHORA · S/ 100');
 assert.match($w('#txtErrCompra').text,/Intenta de nuevo/);
 assert.equal(vm.runInContext("imgUrl('https://static.wixstatic.com/media/test.jpg')",ctx),'https://static.wixstatic.com/media/test.jpg');
 assert.equal(vm.runInContext("imgUrl('wix:image://v1/test.jpg/file#originWidth=100')",ctx),'https://static.wixstatic.com/media/test.jpg');
 console.log('OK: pedidos inválidos, cantidades, límites agregados, recuperación de compra e imágenes.');
})().catch(e=>{console.error(e);process.exitCode=1});
