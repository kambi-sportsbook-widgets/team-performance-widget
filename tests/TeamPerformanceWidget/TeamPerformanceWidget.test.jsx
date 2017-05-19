/* eslint-env jest */
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import ReactTestRenderer from 'react-test-renderer';
import { widgetModule } from 'kambi-widget-core-library';
import { mount, shallow } from 'enzyme';
import TeamPerformanceWidget from '../../src/js/Components/TeamPerformanceWidget';
import enzymeToJson from 'enzyme-to-json';
import mockData from '../mockData.json';

let renderer;

jest.mock('kambi-widget-core-library', () => ({
   widgetModule: {
      adaptWidgetHeight: jest.fn(),
   },
   translationModule: {
      getTranslation: jest.fn()
   }
}));


describe('TeamPerformanceWidget DOM rendering', () => {
   beforeEach(() => {
      // enabling fake setTimeout/setInterval etc
      jest.useFakeTimers();

      renderer = new ReactShallowRenderer();
      window.innerWidth = 1024;
   });

   afterEach(() => {
      jest.useRealTimers();
   });

   it('renders correctly', () => {
      expect(renderer.render(
         <TeamPerformanceWidget
            title='theTitle'
            participants={mockData}
         />
      )).toMatchSnapshot();
   });

   it('resize testing', () => {
      // using ReactTestRenderer to test interactions
      // ReactTestRenderer does deep rendering
      // ReactTestUtils does not actually mount the object, so it does not work for this test
      const tree = ReactTestRenderer.create(
         <TeamPerformanceWidget
            title='theTitle'
            participants={mockData}
         />
      );

      widgetModule.adaptWidgetHeight.mockClear();

      const tmpInnerWidth = window.innerWidth;
      window.innerWidth = 480;
      window.dispatchEvent(new Event('resize'));

      expect(window.setTimeout).toHaveBeenCalledTimes(1)
      jest.runAllTimers();
      expect(widgetModule.adaptWidgetHeight).toHaveBeenCalledTimes(1);
   });
});


describe('TeamPerformanceWidget interaction', () => {

   beforeEach(() => {
      renderer = new ReactShallowRenderer();
      window.innerWidth = 1024;
   });

   it('handles switching to detailed view and back', () => {
      const tpi = shallow(
         <TeamPerformanceWidget
            title='theTitle'
            participants={mockData}
         />
      );

      // Detailed view off
      expect(enzymeToJson(tpi)).toMatchSnapshot();

      tpi.find('.KambiWidget-card-background-color').simulate('click', {});

      // Detailed view on
      expect(enzymeToJson(tpi)).toMatchSnapshot();

      tpi.find('.KambiWidget-card-background-color').simulate('click', {});

      // Detailed view off
      expect(enzymeToJson(tpi)).toMatchSnapshot();
   });

});
