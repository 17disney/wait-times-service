'use strict'

const { app, assert } = require('egg-mock/bootstrap')
const mock = require('egg-mock')

describe('test/app/controller/wait_times.test.js', () => {
  const date = '2018-02-25'
  const local = 'shanghai'

  it('should GET /wait-times/park/:local/:date', async () => {
    const result = await app
      .httpRequest()
      .get(`/wait-times/park/${local}/${date}`)

    assert(result.status === 200)
    assert(result.body.date === date)
    assert(result.body.local === local)
  })
  it('should GET /wait-times/park/:local/:date ERROR', async () => {
    const result = await app
      .httpRequest()
      .get('/wait-times/park/shanghais/2018-02-27s')

    assert(result.status === 422)
  })

  it('should GET /wait-times/attractions/:local/:date', async () => {
    const result = await app
      .httpRequest()
      .get(`/wait-times/attractions/${local}/${date}`)

    assert(result.status === 200)
    assert(result.body[0]['date'] === date)
    assert(result.body[0]['local'] === local)
  })
  it('should GET /wait-times/attractions/:local/:date ERROR', async () => {
    const result = await app
      .httpRequest()
      .get('/wait-times/attractions/shanghais/2018-02-27s')

    assert(result.status === 422)
  })

  it('should GET /wait-times/attractions/:local/:date/:id', async () => {
    const result = await app
      .httpRequest()
      .get(
        `/wait-times/attractions/${local}/${date}/attAdventuresWinniePooh`
      )

    assert(result.status === 200)
    assert(result.body['date'] === date)
    assert(result.body['local'] === local)
  })
  it('should GET /wait-times/attractions/:local/:date/:id ERROR', async () => {
    const result = await app
      .httpRequest()
      .get(
        '/wait-times/attractions/shanghais/2018-02-27s/attAdventuresWinniePooh'
      )

    assert(result.status === 422)
  })
})
