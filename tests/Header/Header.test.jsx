/* eslint-env jest */
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import Header from '../../src/js/Components/Header';

let renderer;

describe('Header DOM rendering', () => {

   beforeEach(() => {
      renderer = new ReactShallowRenderer();
   });

   it('renders correctly', () => {
      expect(renderer.render(
         <Header title='Title' />
      )).toMatchSnapshot();
   });

});
