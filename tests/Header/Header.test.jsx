/* eslint-env jest */
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';
import Header from '../../src/js/Components/Header';

let renderer;

describe('Header DOM rendering', () => {
   beforeEach(() => {
      renderer = ReactTestUtils.createRenderer();
   });
   it('renders correctly', () => {
      expect(renderer.render(
         <Header title='Title' />
      )).toMatchSnapshot();
   });
});
