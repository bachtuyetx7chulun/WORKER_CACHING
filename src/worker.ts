import { Queue } from 'bull'
import express, { Application } from 'express'
import { WORKER_JOB } from '@constants/index'
import { ExampleJob } from './jobs/example.job'
import { logger } from './commons'

export default class Worker {
  app: Application
  queue: Queue
  exampleJob = new ExampleJob()

  constructor(queue: Queue) {
    this.app = express()
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.queue = queue
    this.initWorker()
    this.initRouter()
  }

  public initWorker() {
    logger.info('Init worker is running...')
    // * Caching with jobs
    this.queue.process(
      WORKER_JOB.SIMPLE_CACHING_WORKER,
      (job: any, done: any) => {
        this.exampleJob.simpleCaching(job.data, done)
      }
    )
  }

  public startWorker() {
    if (process.env.SIMPLE_CACHING === 'ON') {
      setInterval(() => {
        this.queue.add(WORKER_JOB.SIMPLE_CACHING_WORKER, {
          title: 'Simple caching worker',
          description: 'Simple caching worker',
          payload: {
            title: 'Simple caching worker',
            description: 'Simple caching worker',
          },
        })
      }, +process.env.LOOP_TIME! || WORKER_JOB.DEFAULT_LOOP_TIME)
    }
  }

  public initRouter() {
    logger.info('Init router is running...')
  }

  public checkQueue() {
    console.log(this.queue)
  }
}
