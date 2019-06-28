import {Entity, model, property, hasMany} from '@loopback/repository';

@model()
export class Inventory extends Entity {
  

  @property({
    type: 'string',
  })
  itemId?: string; 

  @property({
    type: 'string',
  })
  unitOfMeasure?: string; 
  
   @property({
    type: 'string',
  })
  productClass?: string; 
  
   @property({
    type: 'string',
  })
  shipNode?: string; 
  
   @property({
    type: 'string',
  })
  deliveryDate?: string; 
}