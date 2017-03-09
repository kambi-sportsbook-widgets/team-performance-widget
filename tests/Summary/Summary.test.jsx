/* eslint-env jest */
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import Summary from '../../src/js/Components/Summary';
import mockData from '../mockData.json';

let renderer;

describe('Summary DOM rendering', () => {
   beforeEach(() => {
      renderer = ReactTestUtils.createRenderer();
   });
   it('renders correctly for mock data', () => {
      expect(renderer.render(
         <Summary participants={mockData} />
      )).toMatchSnapshot();
   });
});
