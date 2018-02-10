import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Admin } from '../../components/Admin';

test ('should render Admin page correctly', () => {
  const wrapper = shallow(<Admin  />);
  expect(wrapper).toMatchSnapshot();

});
