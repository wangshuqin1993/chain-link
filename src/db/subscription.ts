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
}

export class SubscriptionDBApi {
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

  public async updateSubscriptionConsumers(id: number, consumers: string[]): Promise<Subscription | undefined> {
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
}
