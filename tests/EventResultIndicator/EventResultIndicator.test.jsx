/* eslint-env jest */
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import EventResultIndicator from '../../src/js/Components/EventResultIndicator';

let renderer;

jest.mock('kambi-widget-core-library', () => ({
   translationModule: {
      getTranslation: (string) => {
         if (string === 'D') {
            return 'Defeat';
         }
         return string;
      }
   },
}));

describe('EventResultIndicator DOM rendering', () => {

   beforeEach(() => {
      renderer = new ReactShallowRenderer();
   });

   it('renders correctly', () => {
      expect(renderer.render(
         <EventResultIndicator result='D' />
      )).toMatchSnapshot();
   });

});
