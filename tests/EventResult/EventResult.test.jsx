/* eslint-env jest */
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import EventResult from '../../src/js/Components/EventResult';

let renderer;

describe('EventResult DOM rendering', () => {

   beforeEach(() => {
      renderer = new ReactShallowRenderer();
   });

   it('renders correctly homeScore > awayScore', () => {
      expect(renderer.render(
         // never forget
         <EventResult
            homeName='Brazil'
            awayName='Germany'
            homeScore={1}
            awayScore={7}
         />
      )).toMatchSnapshot();
   });

   it('renders correctly homeScore < awayScore', () => {
      expect(renderer.render(
         <EventResult
            homeName='Sweden'
            awayName='Italy'
            homeScore={4}
            awayScore={1}
         />
      )).toMatchSnapshot();
   });

   it('renders correctly homeScore == awayScore', () => {
      expect(renderer.render(
         <EventResult
            homeName='France'
            awayName='England'
            homeScore={2}
            awayScore={2}
         />
      )).toMatchSnapshot();
   });

});
