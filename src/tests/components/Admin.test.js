import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

// Import named / not connected component.
// export class Admin extends Component
import { Admin } from '../../components/Admin';
import * as slideshowActions from '../../actions/actions_slideshow';
import * as slideshowConfigActions from '../../actions/actions_slideshowConfig';


const actions = {...slideshowActions, ...slideshowConfigActions};

const config = {
  slideDuration: 6,
  transitionDuration: 500
}

test ('should render Admin page correctly', () => {
  const wrapper = shallow(<Admin  config={config} />);
  expect(wrapper).toMatchSnapshot();
});

test ('should set state.activeFolder to bb1 when selected', () => {
  const wrapper = shallow(<Admin
    config={config}
    actions={actions}
  />);

  // expect(wrapper).toMatchSnapshot();
  wrapper.find('select').simulate('change',{target: { value : 'bb1'}});
  expect(wrapper.state('activeFolder')).toEqual('bb1');
  // expect(wrapper).toMatchSnapshot();

});

test ('should set slideDuration on input change', () => {
  const value = 15;
  const wrapper = shallow(<Admin
    config={config}
    actions={actions}
  />);

  // Most of the page doesn't load without an activeFolder.
  wrapper.setState({ activeFolder: 'bb1' });

  expect(wrapper).toMatchSnapshot();
  wrapper.find('#slideDuration').simulate('change', {
    target: { id: 'slideDuration', value }
  });
  expect(wrapper.state('slideDuration')).toEqual(15);
  expect(wrapper).toMatchSnapshot();
});


test ('should set transitionDuration on input change', () => {
  const value = 750;
  const wrapper = shallow(<Admin
    config={config}
    actions={actions}
  />);

  // Most of the page doesn't load without an activeFolder.
  wrapper.setState({ activeFolder: 'bb1' });

  expect(wrapper).toMatchSnapshot();
  wrapper.find('#transitionDuration').simulate('change', {
    target: { id: 'transitionDuration', value }
  });
  expect(wrapper.state('transitionDuration')).toEqual(750);
  expect(wrapper).toMatchSnapshot();
});
