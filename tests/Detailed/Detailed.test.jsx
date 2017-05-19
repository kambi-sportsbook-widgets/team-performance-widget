/* eslint-env jest */
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import Detailed from '../../src/js/Components/Detailed';
import mockData from '../mockData.json';

let renderer;

describe('Detailed DOM rendering', () => {

   beforeEach(() => {
      renderer = new ReactShallowRenderer();
   });

   it('renders correctly for mock data', () => {
      expect(renderer.render(
         <Detailed participants={mockData} />
      )).toMatchSnapshot();
   });

});
