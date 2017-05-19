/* eslint-env jest */
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import ParticipantSummary from '../../src/js/Components/ParticipantSummary';

let renderer;

describe('ParticipantSummary DOM rendering', () => {

   beforeEach(() => {
      renderer = new ReactShallowRenderer();
   });

   it('renders correctly', () => {
      expect(renderer.render(
         <ParticipantSummary>
            <span>content</span>
         </ParticipantSummary>
      )).toMatchSnapshot();
   });

});
