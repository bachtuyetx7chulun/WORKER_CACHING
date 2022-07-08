import * as PromiseBluebird from 'bluebird'
import Redis, { Cluster, RedisOptions } from 'ioredis'
import { logger } from '@commons/index'
import { MESSAGE_LOG } from '@constants/index'

class RedisCommon {
  clientSync!: Redis | Cluster
  subscribed!: Redis | Cluster
  client: any
  listRedisNode: any[] =
    JSON.parse(process.env.REDIS_CLUSTER_NODE as string) || []
  redisConfig: RedisOptions = {
    port: parseInt(process.env.REDIS_PORT as string),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000)
      return delay
    },
  }

  public async connect(): Promise<void> {
    await this.getSetConnect()
    await this.subscribedConnect()
  }
  public async getSetConnect(): Promise<void> {
    await new Promise(async (resolve, _reject) => {
      if ((process.env.REDIS_CLUSTER as string) === 'ON') {
        logger.info(this.listRedisNode)
        this.clientSync = new Redis.Cluster(this.listRedisNode)
      } else {
        this.clientSync = new Redis(this.redisConfig)
      }
      logger.info(MESSAGE_LOG.REDIS_CONNECTING)
      let reconect = 0
      this.clientSync.on('error', function (err: any) {
        reconect = reconect + 1
        logger.info(String(reconect))
        logger.error(err.stack)
      })
      this.clientSync.on('connect', async () => {
        // @ts-ignore
        this.client = PromiseBluebird.promisifyAll(this.clientSync as object)
        logger.info(MESSAGE_LOG.REDIS_CONNECTED)
        resolve(null)
      })
    })
  }
  public async subscribedConnect(): Promise<void> {
    await new Promise(async (resolve, _reject) => {
      if ((process.env.REDIS_CLUSTER as string) === 'ON') {
        logger.info(this.listRedisNode)
        this.subscribed = new Redis.Cluster(this.listRedisNode)
      } else {
        this.subscribed = new Redis(this.redisConfig)
      }
      logger.info(MESSAGE_LOG.REDIS_PUBSUB_CONNECTING)
      let reconect = 0
      this.subscribed.on('error', function (err: any) {
        reconect = reconect + 1
        logger.info(String(reconect))
        logger.error(err.stack)
      })
      this.subscribed.on('connect', async () => {
        logger.info(MESSAGE_LOG.REDIS_PUBSUB_CONNECTED)
        resolve(null)
      })
    })
  }
}

const RedisInstance = new RedisCommon()
export { RedisInstance }
