/* eslint-env jest */
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import Summary from '../../src/js/Components/Summary';
import mockData from '../mockData.json';

let renderer;

describe('Summary DOM rendering', () => {

   beforeEach(() => {
      renderer = new ReactShallowRenderer();
   });

   it('renders correctly for mock data', () => {
      expect(renderer.render(
         <Summary participants={mockData} />
      )).toMatchSnapshot();
   });

});
