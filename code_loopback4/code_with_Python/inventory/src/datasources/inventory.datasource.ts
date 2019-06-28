import {juggler} from '@loopback/service-proxy';
import * as config from './inventory.datasource.json';
export class InventoryDataSource extends juggler.DataSource {
   static dataSourceName = 'inventory';
   constructor(dsConfig: object = config) {
      super(dsConfig);
   }
}