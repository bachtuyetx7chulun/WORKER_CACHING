import convict from 'convict'

const config = convict({
  env: {
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  redis: {
    host: {
      format: String,
      default: 'localhost',
      env: 'REDIS_HOST',
    },
    port: {
      format: Number,
      default: 6379,
      env: 'REDIS_PORT',
    },
    username: {
      format: String,
      default: 'default',
      env: 'REDIS_USERNAME',
    },
    password: {
      format: String,
      default: '',
      env: 'REDIS_PASSWORD',
    },
    db: {
      format: Number,
      default: 0,
      env: 'REDIS_DB',
    },
  },
})

// Perform validation
config.validate({ allowed: 'strict' })

export { config }
