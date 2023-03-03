import dayjs from 'dayjs';
import { openDB, DBSchema } from 'idb';

export interface Consumer {
  address: string
  addTime: string
}

export interface Subscription {
  id: number;
  owner: string;
  createdTime: string;
  consumers: Consumer[];
  balance: string;
  consumerCount: number;
}

interface SubscriptionStoreValue {
  key: number;
  value: Subscription;
  owner: string;
}

interface ItemList {
  key: string,
  value: string,
}

interface ParamsItem {
  value: string,
  paramsValue: string,
}

interface RequestItem {
  requestName: string,
  responseName: string,
  url: string,
  method: string,
  headers: ItemList[],
  params: ItemList[],
  data: ItemList[],
  responseType: string,
  timeout: number,
}

export interface SceretsItem {
  secretsname: string,
  secretsLocation: string,
  secretsURL: string,
  secrets: ItemList[],
  args: ItemList[],
}

export interface ReturnItem {
  returntypre: string,
  returnParam: string,
}

interface Requset {
  id: number,
  addTime: string,
  source: string,
  scerets: SceretsItem,
  secretsName: string,
  paramsValue: ParamsItem[],
  requsetValue: RequestItem[],
  calculation: string,
  returnValue: ReturnItem,
}

interface RequestStoreValue {
  key: number,
  value: Requset,
  id: number,
}

interface ConsumerTemplate {
  id: number,
  source: string,
  abi: string,
  bytecode: string
}

interface ConsumerTemplateValue {
  key: number,
  value: ConsumerTemplate,
}


interface MyDB extends DBSchema {
  subscription_0x7a69: {
    key: number;
    value: Subscription;
    indexes: { owner: string };
  };
  subscription_0xaa36a7: {
    key: number;
    value: Subscription;
    indexes: { owner: string };
  };
  subscription_0x5: {
    key: number;
    value: Subscription;
    indexes: { owner: string };
  };
  subscription_0x13881: {
    key: number;
    value: Subscription;
    indexes: { owner: string };
  };
  request: {
    key: number;
    value: Requset;
    indexes: { id: number }
  };
  consumerTemplate: {
    key: number
    value: ConsumerTemplate;
  }
}

export class ChainLinkDBApi {
  private readonly dbName: string = 'chain-link';
  private readonly dbVersion: number = 1;
  private db: any;
  private storeName = "subscription_0x7a69";

  public async open() {
    this.db = await openDB<MyDB>(this.dbName, this.dbVersion, {
      upgrade(db) {
        const store = db.createObjectStore('subscription_0x7a69', { keyPath: 'key' });
        store.createIndex('owner', 'owner');
        const store1 = db.createObjectStore('subscription_0xaa36a7', { keyPath: 'key' });
        store1.createIndex('owner', 'owner');
        const store2 = db.createObjectStore('subscription_0x5', { keyPath: 'key' });
        store2.createIndex('owner', 'owner');
        const store3 = db.createObjectStore('subscription_0x13881', { keyPath: 'key' });
        store3.createIndex('owner', 'owner');
        const store4 = db.createObjectStore('request', { keyPath: 'key' });
        store4.createIndex('id', 'id');
        db.createObjectStore('consumerTemplate', { keyPath: 'key' })
      },
    });
  }

  public switchNetwork(networkId: string) {
    this.storeName = "subscription_" + networkId;
  }

  public async addSubscription(subscription: Subscription): Promise<void> {
    const value: SubscriptionStoreValue = { key: subscription.id, value: subscription, owner: subscription.owner };
    await this.db.put(this.storeName, value);
  }

  public async updateSubscriptionBalance(id: number, balance: string): Promise<Subscription | undefined> {
    const value: SubscriptionStoreValue | undefined = await this.db.get(this.storeName, id);
    console.log("updateSubscriptionBalance", id, value);
    if (value) {
      value.value.balance = balance;
      await this.db.put(this.storeName, value);
      return value.value;
    }
    return undefined;
  }

  public async addSubscriptionConsumers(id: number, consumers: string[]): Promise<Subscription | undefined> {
    const value: SubscriptionStoreValue | undefined = await this.db.get(this.storeName, id);
    if (value) {
      const addConsumer: Consumer[] = [];
      consumers.forEach((consumer) => {
        if (!value.value.consumers.some(t => t.address === consumer)) {
          addConsumer.push({
            address: consumer,
            addTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
          })
        }
      });
      value.value.consumers = value.value.consumers.concat(addConsumer);
      await this.db.put(this.storeName, value);
      return value.value;
    }
    return undefined;
  }

  public async removeSubscriptionConsumers(id: number, consumers: string[]): Promise<Subscription | undefined> {
    const value: SubscriptionStoreValue | undefined = await this.db.get(this.storeName, id);
    if (value) {
      const addConsumer: Consumer[] = [];
      value.value.consumers.forEach((c) => {
        if (consumers.includes(c.address)) {
          addConsumer.push({
            address: c.address,
            addTime: c.addTime
          })
        }
      })
      value.value.consumers = addConsumer;
      await this.db.put(this.storeName, value);
      return value.value;
    }
    return undefined;
  }

  public async getSubscription(id: number): Promise<Subscription | undefined> {
    const value: SubscriptionStoreValue | undefined = await this.db.get(this.storeName, id);
    console.log("value", value, this.storeName, id);
    if (value) {
      return value.value;
    }
    return undefined;
  }

  public async getAllSubscriptions(): Promise<Subscription[]> {
    const values: SubscriptionStoreValue[] = await this.db.getAll(this.storeName);
    return values.map((value) => value.value);
  }

  public async searchSubscriptionByOwner(owner: string): Promise<Subscription[]> {
    const range = IDBKeyRange.only(owner);
    const values: SubscriptionStoreValue[] = await this.db.getAllFromIndex(this.storeName, 'owner', range);
    return values.map((value) => value.value);
  }

  public async deleteSubscription(id: number): Promise<void> {
    await this.db.delete(this.storeName, id);
  }

  public async addRequest(request: Requset): Promise<void> {
    const value: RequestStoreValue = { key: request.id, value: request, id: request.id };
    await this.db.put('request', value);
  }

  public async getAllRequests(): Promise<Requset[]> {
    const values: RequestStoreValue[] = await this.db.getAll('request');
    return values.map((value) => value.value);
  }

  public async searchRequestById(id: number): Promise<Requset | undefined> {
    console.log(id)
    const value: RequestStoreValue |undefined = await this.db.get('request', id);
    if(value) {
      return value.value;
    } else {
      return undefined;
    }
  }

  public async deleteRequestById(id: number): Promise<void> {
    await this.db.delete('request',id);
    return undefined
  }

  public async updateRequest(requset: Requset): Promise<Requset | undefined> {
    const value: RequestStoreValue | undefined = await this.db.get('request',requset.id);
    console.log("request", requset.id, value);
    if (value) {
      console.log(value,'value1111111111111')
      value.value = requset
      console.log(value,'value222222222222')
      await this.db.put('request', value);
      return value.value;
    }
    return undefined;
  }


  public async addConsumerTemplate(consumerTemplate: ConsumerTemplate): Promise<void> {
    const value: ConsumerTemplateValue | undefined = await this.db.get('consumerTemplate', consumerTemplate.id);
    if (value) {
      value.value = consumerTemplate;
      await this.db.put('consumerTemplate', value);
    } else {
      const createValue: ConsumerTemplateValue = { key: consumerTemplate.id, value: consumerTemplate };
      await this.db.put('consumerTemplate', createValue);
    }
  }

  public async getAllConsumerTemplate(): Promise<ConsumerTemplate[]> {
    const values: ConsumerTemplateValue[] = await this.db.getAll('consumerTemplate');
    return values.map((value) => value.value);
  }

}
