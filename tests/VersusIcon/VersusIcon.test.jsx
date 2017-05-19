/* eslint-env jest */
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import VersusIcon from '../../src/js/Components/VersusIcon';

let renderer;

describe('VersusIcon DOM rendering', () => {

   beforeEach(() => {
      renderer = new ReactShallowRenderer();
   });

   it('renders correctly', () => {
      expect(renderer.render(
         <VersusIcon />
      )).toMatchSnapshot();
   });

});
