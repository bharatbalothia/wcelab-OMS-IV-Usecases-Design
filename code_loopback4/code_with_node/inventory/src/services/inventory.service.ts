import {getService, juggler} from '@loopback/service-proxy';
import {inject, Provider} from '@loopback/core';
import {InventoryDataSource} from '../datasources/inventory.datasource';

export interface InventoryResponseData {
   userId: number;
   id: number;
   title: string;
   completed: boolean;
}

export interface InventoryService {
  // this is where you define the Node.js methods that will be
  // mapped to the SOAP operations as stated in the datasource
  // json file.
  getrestsupplydata(itemId?: string, unitOfMeasure?: string, productClass?: string, shipNode?: string,token?: string): Promise<any>;
  getrestdemanddata(itemId?: string, unitOfMeasure?: string, productClass?: string, shipNode?: string,token?: string): Promise<any>;
  getrestavailabilitydata(supply?: string, demand?: string, deliveryDate?: string,currDate?: string,shipNode?: string): Promise<any>;
 // getrestdata(): Promise<InventoryResponseData>;
}


export class InventoryServiceProvider implements Provider<InventoryService> {
  constructor(
    // inventory must match the name property in the datasource json file
    @inject('datasources.inventory')
    protected dataSource: InventoryDataSource = new InventoryDataSource(),
  ) {}

  value(): Promise<InventoryService> {
    return getService(this.dataSource);
  }
}
