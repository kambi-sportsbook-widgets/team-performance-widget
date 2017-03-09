/* eslint-env jest */
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';
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
      renderer = ReactTestUtils.createRenderer();
   });
   it('renders correctly', () => {
      expect(renderer.render(
         <EventResultIndicator result='D' />
      )).toMatchSnapshot();
   });
});
