// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';



import {inject} from '@loopback/context';
import {InventoryService} from '../services/inventory.service';
import {get, param ,Request, RestBindings, ResponseObject} from '@loopback/rest';
import * as debugFactory from 'debug';
//import { PythonShell } from "python-shell";

export class InventoryController {
   constructor(
      @inject('services.InventoryService')
     private inventoryService: InventoryService,
	 @inject(RestBindings.Http.REQUEST) 
	 private req: Request
   ) {}
   
@get('/inventoryAvailability/{itemId}/{unitOfMeasure}/{productClass}/{shipNode}/{deliveryDate}')
    async getone(@param.path.string('itemId') itemId: string,
   @param.path.string('unitOfMeasure') unitOfMeasure: string,
   @param.path.string('productClass') productClass: string,
   @param.path.string('shipNode') shipNode: string,
   @param.path.string('deliveryDate') deliveryDate: string) {
	//let var12=(this.inventoryService.getrestdata());
	
	var authtoken='';
	var authtokenarr=this.req.headers['authtoken'];
	if (authtokenarr!=null){
		for (var i=0;i<authtokenarr.length;i++){
			authtoken=authtoken+authtokenarr[i];
			//break;
		}
	}
	if(authtoken==''){
		return "invalid authtoken";
	}
	
	
	let supply=(await this.inventoryService.getrestsupplydata(itemId,unitOfMeasure,productClass,shipNode,authtoken));
	let demand=(await this.inventoryService.getrestdemanddata(itemId,unitOfMeasure,productClass,shipNode,authtoken));
	//demand=demand+'';
	//supply=supply+'';
	//const abc= var1 + var2;
	//var spawn = require("child_process").spawn; 
	
	//var process = spawn('python',["./getInventory.py","my","name"]);
	//var process = spawn('python',["C:/\Users/\NithinSamrajAnithaGr/\Desktop/\Pythoncode/\getInventory.py","my","name"]);
		
	//PythonShell.run('C:/Users/NithinSamrajAnithaGr/Desktop/Pythoncode/getInventory.py');
		
	//var PythonShell = require('python-shell');
	//var options = {
	//scriptPath: 'C:/Users/NithinSamrajAnithaGr/Desktop/Pythoncode/'
	//};
	//var pyshell = new PythonShell('getInventory.py',options);
	//pyshell.on('message', function (message) {
		//console.log(message);
	//});
		//var delDate='2019-06-12T00:00:00.000Z';
		var ts = new Date();
		
		var delDate=deliveryDate;
		var output=(this.inventoryService.getrestavailabilitydata(JSON.stringify(supply),JSON.stringify(demand),delDate,ts.toISOString(),shipNode));


	
    //return process;
	  return output;
   }
}