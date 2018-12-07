import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import * as slideshowActions from '../../actions/actions_slideshow';
import * as slideshowConfigActions from '../../actions/actions_slideshowConfig';
const actions = { ...slideshowActions, ...slideshowConfigActions };

import { Slideshow } from '../../components/Slideshow';

const config = {
  // loadedCsv goes here but I don't need it.
};

const match = {
  params: {
    name: 'bb1'
  }
};

const slideshowItems = [{ filename: 'file1.jpg ' }, { filename: 'file2.jpg' }];

test('should render "Loading"', () => {
  const wrapper = shallow(
    <Slideshow
      config={config}
      match={match}
      actions={actions}
      slideshowItems={slideshowItems}
    />
  );
  expect(wrapper.html()).toEqual('<h1 class="loading">Loading</h1>');
});

test('should render a #slideshowContainer and #slideshow div', () => {
  const wrapper = shallow(
    <Slideshow
      config={config}
      match={match}
      actions={actions}
      slideshowItems={slideshowItems}
    />
  );
  wrapper.setState({ finalSlideOrder: slideshowItems });
  expect(wrapper.find('#slideshowContainer').exists()).toEqual(true);
  expect(wrapper.find('#slideshow').exists()).toEqual(true);
});
