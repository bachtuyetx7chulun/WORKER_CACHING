import { logger, RedisInstance } from '@commons/index'

class InitService {
  public async initSubscriber(): Promise<any> {
    return await new Promise(async (resolve, _reject) => {
      RedisInstance.subscribed.on(
        'pmessage',
        async (_pattern, channel, message) => {
          const key = channel ? channel.split(':')[1] : undefined
          const action = message
          console.log('CircuitBreaker', action, key)
          if (action === 'set' && key === 'CIRCUIT_OPEN_HALF') {
            logger.info('CIRCUIT_OPEN actived!')
          } else if (
            ['expired', 'del'].includes(action) &&
            key === 'CIRCUIT_OPEN_HALF'
          ) {
            logger.info('CIRCUIT_OPEN_HALF actived!')
          } else if (
            ['expired', 'del'].includes(action) &&
            key === 'CIRCUIT_OPEN'
          ) {
            logger.info('CIRCUIT_OPEN unactived!')
          }
        }
      )

      RedisInstance.subscribed.psubscribe('__key*__:CIRCUIT_OPEN*').then(() => {
        logger.info('Redis subscribe CIRCUIT_OPEN')
        resolve(null)
      })
    })
  }
}

const InitServiceInstance = new InitService()
export { InitServiceInstance }
