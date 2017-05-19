/* eslint-env jest */
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import ParticipantResults from '../../src/js/Components/ParticipantResults';

let renderer;

describe('ParticipantResults DOM rendering', () => {

   beforeEach(() => {
      renderer = new ReactShallowRenderer();
   });

   it('renders correctly', () => {
      expect(renderer.render(
         <ParticipantResults name='TheName'>
            <span>content</span>
         </ParticipantResults>
      )).toMatchSnapshot();
   });

});
