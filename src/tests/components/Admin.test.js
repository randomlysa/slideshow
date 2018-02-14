import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Admin } from '../../components/Admin';
import * as adminActions from '../../actions/admin';
import * as slideshowActions from '../../actions/slideshow';

const actions = {...adminActions, ...slideshowActions};

const config = {
  slideDuration: 6,
  transitionDuration: 500
}

test ('should render Admin page correctly', () => {
  const wrapper = shallow(<Admin  config={config} />);
  expect(wrapper).toMatchSnapshot();
});

test ('should return default values when clicking submit', () => {
  const wrapper = shallow(<Admin
    config={config}
    actions={actions}
  />);

  expect(wrapper).toMatchSnapshot();
  wrapper.find('form').simulate('submit', {
    preventDefault: () => {}
  });
  expect(wrapper.state('slideDuration')).toEqual(6);
  expect(wrapper.state('transitionDuration')).toEqual(500);
  expect(wrapper).toMatchSnapshot();
});

test ('should set slideDuration on input change', () => {
  const value = 19;
  const wrapper = shallow(<Admin
    config={config}
    actions={actions}
  />);

  expect(wrapper).toMatchSnapshot();
  wrapper.find('input').at(0).simulate('change', {
    target: { id: 'slideDuration', value }
  });
  expect(wrapper.state('slideDuration')).toEqual(19);
  expect(wrapper).toMatchSnapshot();
});


test ('should set transitionDuration on input change', () => {
  const value = 750;
  const wrapper = shallow(<Admin
    config={config}
    actions={actions}
  />);

  expect(wrapper).toMatchSnapshot();
  wrapper.find('input').at(1).simulate('change', {
    target: { id: 'transitionDuration', value }
  });
  expect(wrapper.state('transitionDuration')).toEqual(750);
  expect(wrapper).toMatchSnapshot();
});

test ('should set activeFolder to bb1 when selected', () => {
  const value = 750;
  const wrapper = shallow(<Admin
    config={config}
    actions={actions}
  />);

  expect(wrapper).toMatchSnapshot();
  wrapper.find('select').simulate('change', {
    target: { value: 'bb1' }
  });
  expect(wrapper.state('activeFolder')).toEqual('bb1');
  expect(wrapper).toMatchSnapshot();
});
