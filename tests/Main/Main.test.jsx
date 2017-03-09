/* eslint-env jest */
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import Main from '../../src/js/Components/Main';

let renderer;

describe('Main DOM rendering', () => {
   beforeEach(() => {
      renderer = ReactTestUtils.createRenderer();
   });
   it('renders correctly', () => {
      expect(renderer.render(
         <Main title='TheTitle'>
            <span>content</span>
         </Main>
      )).toMatchSnapshot();
   });
});
