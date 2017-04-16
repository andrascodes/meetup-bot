import React from 'react'
import renderer from 'react-test-renderer'

import { Loading } from './Loading'

describe('Loading', () => {

  test('renders correctly', () => {
    let tree = renderer.create(
      <Loading />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})