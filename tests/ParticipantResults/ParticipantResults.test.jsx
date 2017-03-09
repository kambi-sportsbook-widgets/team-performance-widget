/* eslint-env jest */
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ParticipantResults from '../../src/js/Components/ParticipantResults';

let renderer;

describe('ParticipantResults DOM rendering', () => {
   beforeEach(() => {
      renderer = ReactTestUtils.createRenderer();
   });
   it('renders correctly', () => {
      expect(renderer.render(
         <ParticipantResults name='TheName'>
            <span>content</span>
         </ParticipantResults>
      )).toMatchSnapshot();
   });
});
