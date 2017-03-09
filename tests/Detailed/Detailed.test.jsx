/* eslint-env jest */
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import Detailed from '../../src/js/Components/Detailed';
import mockData from '../mockData.json';

let renderer;

describe('Detailed DOM rendering', () => {
   beforeEach(() => {
      renderer = ReactTestUtils.createRenderer();
   });
   it('renders correctly for mock data', () => {
      expect(renderer.render(
         <Detailed participants={mockData} />
      )).toMatchSnapshot();
   });
});
