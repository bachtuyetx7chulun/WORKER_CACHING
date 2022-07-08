class ExampleJob {
  public healthCheck() {
    console.log('Example job is running')
  }

  public simpleCaching(data: any, done: Function) {
    console.log(data)
    return done()
  }
}

export { ExampleJob }
