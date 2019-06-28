// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';



import {inject} from '@loopback/context';
import {InventoryService} from '../services/inventory.service';
import {get, post, param ,Request, RestBindings, ResponseObject , requestBody} from '@loopback/rest';
import * as debugFactory from 'debug';
import {Inventory} from '../models';

//import { PythonShell } from "python-shell";

export class InventoryController {
   constructor(
      @inject('services.InventoryService')
     private inventoryService: InventoryService,
	 @inject(RestBindings.Http.REQUEST) 
	 private req: Request
   ) {}
   
@post('/inventoryAvailability')
    async getone(@requestBody() inventory: Inventory) {
		
	var itemId=inventory.itemId;
	var unitOfMeasure=inventory.unitOfMeasure;
	var productClass= inventory.productClass;
	var shipNode=inventory.shipNode;
	var deliveryDate='';
	if(inventory.deliveryDate!=null){
	 deliveryDate=inventory.deliveryDate;
	}
	else{
		return "invalid delivery date";
	}
	
	
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
	
	//console.log(authtoken);
	//let var12=(this.inventoryService.getrestdata());
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
		var delDatets=new Date(deliveryDate);
		
		//var delDate=deliveryDate;
		//var output=(this.inventoryService.getrestavailabilitydata(JSON.stringify(supply),JSON.stringify(demand),delDate,ts.toISOString()));
		if (supply.length==0){
			var retmsg=" No supply data for item";
			return retmsg;
		}
		if(delDatets<ts){
			var retmsg=" Invalid delivery Date";
			return retmsg;
		}
		var arraySort = require('array-sort');
 
		 supply = arraySort(supply, ['shipByDate','eta']);
		 demand = arraySort(demand,['shipDate']);
		
		for (var i=0;i<demand.length;i++)
		{
			var demandQty=demand[i]['quantity'];
			if(demandQty>0){
				var demandShipdate=new Date(demand[i]['shipDate']);
					for (var j=0;j<supply.length;j++)
					{
						if(supply[j]['quantity']>0){
							var eta=new Date(supply[j]['eta']);
							var shipByDate=new Date(supply[j]['shipByDate']);
							if(eta <= demandShipdate && shipByDate >= demandShipdate){
								var supplyQty=supply[j]['quantity'];
								if(supplyQty>demandQty){
									var remainderSupplyQty=supplyQty-demandQty;
									supply[j]['quantity']=remainderSupplyQty;
									break;
								}
								else{
									demandQty=demandQty-supplyQty;
									supply[j]['quantity']=0;
								}
							}
						}
					}
			}
		}
		
		var onhandInv=0;
		var futureInv=0;
		var onhandts="";
		var futurets="";
		
		for (var k=0;k<supply.length ;k++){
			if(supply[k]['quantity']>0){
				var eta=new Date(supply[k]['eta']);
				var shipByDate=new Date(supply[k]['shipByDate']);
				if(eta<= ts && delDatets<=shipByDate){
					//onhand
					onhandInv=onhandInv+supply[k]['quantity'];
					onhandts=ts.toISOString();
				}
				else if (eta<=delDatets && shipByDate>=delDatets){
					//future
					futureInv=futureInv+supply[k]['quantity'];
					if(futurets==''){
						futurets=supply[k]['eta']
					}
				}
				else{
					
				}
			}
		}
		
	var availability={
	  lines : [{
		lineId : 1,
		shipNodeAvailability : [{
			earliestShipTs : onhandts,
			futureEarliestShipTs : futurets,
			futureAvailableQuantity : futureInv,
			onhandAvailableQuantity : onhandInv,
			onhandEarliestShipTs : onhandts,
			shipNode : shipNode
		  }]
	  }]
	};
	// convert a JavaScript object to a string 

	
	  return availability;
   }
}