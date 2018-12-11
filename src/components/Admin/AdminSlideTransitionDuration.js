import React from 'react';

function AdminSlideTransitionDuration(props) {
  return (
    <div>
      Slide duration (seconds):
      <input
        data-cy="slideDuration"
        type="number"
        id="slideDuration"
        placeholder="Number (seconds)"
        onChange={props.onInputChange}
        value={props.slideDuration}
      />
      <br />
      Transition duration (ms):
      <input
        data-cy="transitionDuration"
        type="number"
        id="transitionDuration"
        placeholder="Number (milliseconds)"
        onChange={props.onInputChange}
        value={props.transitionDuration}
      />{' '}
      (1000ms = 1s)
    </div>
  );
}

export default AdminSlideTransitionDuration;
