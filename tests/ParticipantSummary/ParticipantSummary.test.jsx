/* eslint-env jest */
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ParticipantSummary from '../../src/js/Components/ParticipantSummary';

let renderer;

describe('ParticipantSummary DOM rendering', () => {
   beforeEach(() => {
      renderer = ReactTestUtils.createRenderer();
   });
   it('renders correctly', () => {
      expect(renderer.render(
         <ParticipantSummary>
            <span>content</span>
         </ParticipantSummary>
      )).toMatchSnapshot();
   });
});
