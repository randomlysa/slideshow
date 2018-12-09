import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import immutable from 'immutable';

import { API_ROOT } from '../../config/api-config';
// Currently unused.
// import combineOrderedAndUnorderedSlides from '../helpers/slideshowOrder';

// Items noted with https://codesandbox.io/s/k260nyxq9v were copied/modified
// from that example.

const { List } = immutable;

// https://codesandbox.io/s/k260nyxq9v
// A little function to help us with reordering the result.
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// Size of border that changes color to indicate dragging.
// Default was 8.
const grid = 4;

const getItemStyle = (isDragging, draggableStyle) => ({
  // Some basic styles to make the items look a bit nicer.
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // Change background colour if dragging.
  background: isDragging ? 'lightgreen' : 'grey',

  // Styles we need to apply on draggables.
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250
});
// End https://codesandbox.io/s/k260nyxq9v copy.

class AdminSlideshow extends Component {
  // https://codesandbox.io/s/k260nyxq9v
  constructor(props) {
    super(props);
    this.state = {
      checkedItems: []
    };

    this.onDragEnd = this.onDragEnd.bind(this);
    this.items = [];
  }

  // Weather items.
  checkAllBoxes = () => {
    this.items.forEach(item => {
      this.selectedCheckboxes.add(item.filename);
    });
    this.setState(
      { checkedItems: [...this.selectedCheckboxes] },
      this.props.updateWeatherCheckboxes(this.selectedCheckboxes)
    );
  };

  uncheckAllBoxes = () => {
    this.selectedCheckboxes.clear();
    this.setState(
      { checkedItems: [...this.selectedCheckboxes] },
      this.props.updateWeatherCheckboxes(this.selectedCheckboxes)
    );
  };

  setWeatherSlide = label => {
    const filename = label.target.value;

    // This if block and the whole 'Set' idea:
    // http://react.tips/checkboxes-in-react/
    if (this.selectedCheckboxes.has(filename)) {
      this.selectedCheckboxes.delete(filename);
    } else {
      this.selectedCheckboxes.add(filename);
    }
    // Update what checkboxes should be checked.
    this.setState({ checkedItems: [...this.selectedCheckboxes] });
    // Update parent state.
    this.props.updateWeatherCheckboxes(this.selectedCheckboxes);
  }; // setWeatherSlide

  // Drag items.
  onDragEnd(result) {
    // Dropped outside the list.
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.items,
      result.source.index,
      result.destination.index
    );

    // Save item order to database.
    this.props.updateSlideOrder(items);
    this.items = items;
  }
  // End https://codesandbox.io/s/k260nyxq9v copy.

  renderDraggable(fileObject, index) {
    const filename = fileObject.filename;
    const fileUrl = `${API_ROOT}/slideshows/${
      this.props.activeFolder
    }/${filename}`;

    return (
      <Draggable key={filename} draggableId={filename} index={index}>
        {(provided, snapshot) => (
          <div>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              <img
                src={fileUrl}
                alt={filename}
                onClick={this.props.deleteFile.bind(
                  this,
                  filename,
                  this.props.activeFolder
                )}
              />
              <br />
              <input
                type="checkbox"
                value={filename}
                label={filename}
                // https://stackoverflow.com/a/6293626/3996097
                id={filename} // so label "Toggle show weather" is clickable.
                onChange={this.setWeatherSlide}
                checked={this.state.checkedItems.includes(filename)}
              />
              <label htmlFor={filename}>Toggle show weather</label>
              {provided.placeholder}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }

  componentDidUpdate() {
    const { activeFolder } = this.props;
    // Ignore changes when the config.name and slideshowItems.dir match EXCEPT
    // when this.items.length doesn't match. This fixes loading a page and going
    // back to the same folder.
    // This also ignores changes when checkboxes are checked (for weather) and
    // maybe some other good things.
    if (
      this.props.config.name === activeFolder &&
      this.props.slideshowItems.dir === activeFolder &&
      this.props.slideshowItems.files.length === this.items.length
    ) {
      return;
    }

    // When updating files or slideOrder, make sure dir/name = activeFolder.
    const { files } = this.props.slideshowItems;

    const { name: nextConfigFolder, slideOrder } = this.props.config;

    // If slideOrder is empty, set slideOrder to slideshowItems.files.
    if (
      nextConfigFolder === activeFolder &&
      (slideOrder === '' || typeof slideOrder === 'undefined')
    ) {
      this.props.callUpdateConfigInDatabase(this.props.slideshowItems.files);
    }

    // Check that slideOrder.length === files.length
    if (
      files &&
      slideOrder &&
      nextConfigFolder === activeFolder &&
      files.length !== slideOrder.length
    ) {
      // Todo: Possibly check if a file was added directly to the folder without
      // using the upload form.
      // const tempObject = {...files, ...slideOrder};
      // const mergedObjects = _.map(tempObject, (tempObject) => { return tempObject;});
      // this.props.callUpdateConfigInDatabase(mergedObjects);
    }

    // Set up which weather checkboxes should be checked.

    if (this.props && this.props.config.slidesToShowWeatherOn) {
      let makeArray = JSON.parse(this.props.config.slidesToShowWeatherOn);
      if (!List(makeArray).equals(List(this.state.checkedItems))) {
        this.setState({ checkedItems: makeArray });
        this.selectedCheckboxes = new Set(makeArray);
      }
    }

    // Set state.
    if (
      this.props.config.slideOrder &&
      this.props.config.slideOrder.length > 0 &&
      this.props.config.name === activeFolder
    ) {
      this.props.updateSlideOrder(slideOrder);
      this.items = slideOrder;
    } else {
      this.props.updateSlideOrder(files);
      this.items = files;
    }
  }

  render() {
    if (this.props.activeFolder && this.items.length > 0) {
      // https://codesandbox.io/s/k260nyxq9v.
      return (
        <div>
          <button onClick={this.checkAllBoxes}>
            Show weather on all slides
          </button>
          <br />
          <button onClick={this.uncheckAllBoxes}>Don't show weather</button>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {this.items.map((fileObject, index) =>
                    this.renderDraggable(fileObject, index)
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      );
      // End https://codesandbox.io/s/k260nyxq9v copy.
    } else {
      return <div>Loading</div>;
    }
  } // render
}

function mapStateToProps({ config, slideshowItems }) {
  return { config, slideshowItems };
}

export default connect(mapStateToProps)(AdminSlideshow);
