import json 
import sys
import logging
import datetime
import logging
import flask
from flask import request

app = flask.Flask(__name__)
app.config["DEBUG"] = True


logging.basicConfig(filename='logs/app.log', filemode='w',level=logging.DEBUG)

@app.route('/inventory/api/v1.0/availability', methods=['POST'])
def home():
	demandStr = request.args.get('demand')
	supplyStr = request.args.get('supply')
	
	
	supply=json.loads(supplyStr)
	demand=json.loads(demandStr)
	deliveryDate=request.args.get('deliveryDate')
	shipNode=request.args.get('shipNode')	
	today = request.args.get('currDate')
	logging.debug('today %s',today)
	logging.debug('deliveryDate %s',deliveryDate)
	logging.debug('supplylen %s',len(supply))
	if len(supply)==0:
		logging.error('suppy list is empty')
		retmsg={"error" : "No supply data for item" }
		retJson = json.dumps(retmsg)
		return retJson
	if today > deliveryDate :
		logging.error('deliverydate less than today')
		retmsg={"error" : "Invalid delivery date" }
		retJson = json.dumps(retmsg)
		return retJson
	
	#1. -----Filter supplies for 2 weeks before and after today , Sort supplies
	# sort by shipdate and then eta
	supplySorted = sorted(supply, key=lambda k:(k['shipByDate'],k['eta']))
	

	#2. -----Filter demands which are upto 2 weeks from and Sort demands
	demandSorted = []
	if len(demand)>0:
		logging.debug('demand list is empty')
		demandSorted = sorted(demand, key=lambda k: k['shipDate'])
		#3. -----Loop through demands and allocate supplies to calculate onhand and future availability 
		for d in demandSorted:
			demandShipDate = d['shipDate']
			demandQuantity = d['quantity']
			supplyFiltered = [x for x in supplySorted if x['quantity'] > 0]
						   
			for s in supplyFiltered :
				if demandQuantity > 0 :
					if s['eta'] <= demandShipDate and s['shipByDate'] >= demandShipDate:
						#print (s['shipByDate'])
						#print ('yes')
						
						if demandQuantity >= s['quantity'] :
							demandQuantity = demandQuantity - s['quantity']
							s.update({"quantity":0})
							#supplySorted.remove(s)
							if 'reference' in s:
								logging.debug('supply %s',s['reference'])
							if 'reference' in d:	
								logging.debug('demand %s',d['reference'])
						else :  
							quantityToUpdate = s['quantity'] - demandQuantity
							if 'reference' in s:
								logging.debug('supply %s',s['reference'])
							if 'reference' in d:	
								logging.debug('demand %s',d['reference'])
							s.update({"quantity":quantityToUpdate})
							break

		supplyFinal = [x for x in supplyFiltered if x['quantity'] > 0]
	
	else :
		supplyFinal=[x for x in supplySorted if x['quantity'] > 0]
	
	#4. Build Availability Response
	onHandInv = 0
	futureInv = 0
	supplyOnhand = [x for x in supplyFinal if x['eta'] <= today and x['shipByDate'] >= deliveryDate]
	logging.debug('supplyOnhand %s',supplyOnhand)
	for s in supplyOnhand:
		onHandInv = onHandInv + s['quantity']
	#print (onHandInv);
		
	futureShipDate = ''
	#print('future');    
	supplyFuture = [x for x in supplyFinal if x['eta'] > today and x['eta'] <= deliveryDate and x['shipByDate']>=deliveryDate] 
	logging.debug('supplyFuture %s',supplyFuture)
	for s in supplyFuture:
		futureInv = futureInv + s['quantity']
		if futureShipDate == '':
			futureShipDate=s['eta']

	#print (futureInv);
	onhandEstimatedShip = ''
	earliestShip = ''

	if onHandInv>0:
		onhandEstimatedShip = today    
		earliestShip = today
	else :
		earliestShip = futureShipDate
		
	availability={
	  "lines" : [{
		"lineId" : "1",
		"shipNodeAvailability" : [{
			"earliestShipTs" : earliestShip,
			"futureEarliestShipTs" : futureShipDate,
			"futureAvailableQuantity" : futureInv,
			"onhandAvailableQuantity" : onHandInv,
			"onhandEarliestShipTs" : onhandEstimatedShip,
			"shipNode" : shipNode
		  }]
	  }]
	}
	availabilityJson = json.dumps(availability)
	#print(availabilityJson)

	return availabilityJson
app.run()