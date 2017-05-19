/* eslint-env jest */
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import Main from '../../src/js/Components/Main';

let renderer;

describe('Main DOM rendering', () => {

   beforeEach(() => {
      renderer = new ReactShallowRenderer();
   });

   it('renders correctly', () => {
      expect(renderer.render(
         <Main title='TheTitle'>
            <span>content</span>
         </Main>
      )).toMatchSnapshot();
   });

});
