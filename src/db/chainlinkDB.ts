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

export interface RequestConfig {
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
  name: string,
  addTime: string,
  source: string,
  requestConfig: RequestConfig,
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

export interface ConsumerTemplate {
  id: number,
  source: string,
  abi: any,
  bytecode: string
}

interface ConsumerTemplateValue {
  key: number,
  value: ConsumerTemplate,
}

export interface ConsumerContract {
  id: number | undefined,
  address: string,
  consumerTemplateId: number,
  createTime: string,
  owner: string,
  network: string
}

interface ConsumerContractValue {
  value: ConsumerContract,
  owner: string,
  network: string
}

interface ExecuteRequest {
  execId: number,
  requestId: number,
  consumerContractId: number,
  createTime: string,
  owner: string,
  secrets: string,
  secretsLocation: string,
  args: string[],
  subscriptionId: number,
  gasLimit: number
}

interface ExecuteRequestValue {
  key: number,
  value: ExecuteRequest,
  consumerContractId: number
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
  };
  consumerContract: {
    key: number
    value: ConsumerContract;
    indexes: { owner_network: string };
  };
  executeRequest: {
    key: number
    value: ExecuteRequest;
    indexes: { consumerContractId: number }
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
        db.createObjectStore('consumerTemplate', { keyPath: 'key' });
        const store5 = db.createObjectStore('consumerContract', { keyPath: 'key', autoIncrement: true });
        store5.createIndex('owner_network', ['owner', 'network']);
        const store6 = db.createObjectStore('executeRequest', { keyPath: 'key' });
        store6.createIndex('consumerContractId', 'consumerContractId');
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
    const value: RequestStoreValue | undefined = await this.db.get('request', id);
    if (value) {
      return value.value;
    } else {
      return undefined;
    }
  }

  public async deleteRequestById(id: number): Promise<void> {
    await this.db.delete('request', id);
    return undefined
  }

  public async updateRequest(requset: Requset): Promise<Requset | undefined> {
    const value: RequestStoreValue | undefined = await this.db.get('request', requset.id);
    if (value) {
      value.value = JSON.parse(JSON.stringify(requset));
      await this.db.put('request', value);
      return value.value;
    }
    return undefined;
  }


  public async addConsumerTemplate(consumerTemplate: ConsumerTemplate): Promise<void> {
    const value: ConsumerTemplateValue | undefined = await this.db.get('consumerTemplate', consumerTemplate.id);
    if (!value) {
      const createValue: ConsumerTemplateValue = { key: consumerTemplate.id, value: consumerTemplate };
      await this.db.put('consumerTemplate', createValue);
    }
  }

  public async getAllConsumerTemplate(): Promise<ConsumerTemplate[]> {
    const values: ConsumerTemplateValue[] = await this.db.getAll('consumerTemplate');
    return values.map((value) => value.value);
  }

  //添加合约信息
  public async addConsumerContract(consumerContract: ConsumerContract): Promise<void> {
    const value: ConsumerContractValue = { value: consumerContract, owner: consumerContract.owner, network: consumerContract.network };
    await this.db.add("consumerContract", value);
  }


  public async getConsumerContract(id: number): Promise<ConsumerContract | undefined> {
    const value: any = await this.db.get("consumerContract", id);
    if (value) {
      value.value.id = value.key
      return value.value;
    }
    return undefined;
  }

  //查询合约列表
  public async searchConsumerContractByOwnerAndNetwork(owner: string, network: string): Promise<ConsumerContract[]> {
    const objectStore = this.db.transaction("consumerContract").objectStore("consumerContract");
    const index = objectStore.index("owner_network");
    const values: any[] = await index.getAll([owner, network]);
    return values.map((value) => {
      value.value.id = value.key;
      return value.value
    });
  }

  //添加执行信息
  public async addExecuteRequest(executeRequest: ExecuteRequest): Promise<void> {
    const value: ExecuteRequestValue = { key: executeRequest.execId, value: executeRequest, consumerContractId: executeRequest.consumerContractId };
    await this.db.put("executeRequest", value);
  }
  //查询执行列表
  public async searchExecuteRequestByConsumerContractId(consumerContractId: string): Promise<ExecuteRequest[]> {
    const range = IDBKeyRange.only(consumerContractId);
    const values: ExecuteRequestValue[] = await this.db.getAllFromIndex("executeRequest", 'consumerContractId', range);
    return values.map((value) => value.value);
  }
}
