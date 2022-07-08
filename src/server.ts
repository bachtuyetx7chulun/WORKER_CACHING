require('dotenv').config()
import 'regenerator-runtime/runtime'
import 'reflect-metadata'
import Redis from 'ioredis'
import Queue from 'bull'
import Worker from '@worker'
import { MESSAGE_LOG } from '@constants/index'
import { RedisInstance, logger } from '@commons/index'
import { InitServiceInstance } from '@services/index'
;(async () => {
  await RedisInstance.connect()
  await InitServiceInstance.initSubscriber()
  const queue = new Queue('worker-queue', {
    prefix: process.env.REDIS_PREFIX,
    createClient() {
      if ((process.env.REDIS_CLUSTER as string) === 'ON') {
        return new Redis.Cluster(RedisInstance.listRedisNode)
      } else {
        return new Redis(RedisInstance.redisConfig)
      }
    },
  })

  queue.on('error', (err: any) => {
    logger.error(err.stack)
  })

  const worker = new Worker(queue)
  worker.startWorker()
  worker.app.listen(process.env.WORKER_PORT, () => {
    logger.info(
      MESSAGE_LOG.SERVER_STARTED + ' with port ' + process.env.WORKER_PORT
    )
  })
})()
