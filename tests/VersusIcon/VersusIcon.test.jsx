/* eslint-env jest */
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import VersusIcon from '../../src/js/Components/VersusIcon';

let renderer;

describe('VersusIcon DOM rendering', () => {
   beforeEach(() => {
      renderer = ReactTestUtils.createRenderer();
   });
   it('renders correctly', () => {
      expect(renderer.render(
         <VersusIcon />
      )).toMatchSnapshot();
   });
});
