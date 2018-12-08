import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { API_ROOT } from '../../config/api-config';
// Currently unused.
// import combineOrderedAndUnorderedSlides from '../helpers/slideshowOrder';

// Items noted with https://codesandbox.io/s/k260nyxq9v were copied/modified
// from that example.

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
      items: '',
      checkedItems: []
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  // Weather items.
  checkAllBoxes = () => {
    this.state.items.forEach(item => {
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
      this.state.items,
      result.source.index,
      result.destination.index
    );

    // Save item order to database.
    this.props.updateSlideOrder(items);
    this.setState({ items });
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

  componentWillReceiveProps(nextprops) {
    const { activeFolder } = nextprops;
    // When updating files or slideOrder, make sure dir/name = activeFolder.
    const { dir: files } = nextprops.slideshowItems;
    const { name: nextConfigFolder, slideOrder } = nextprops.config;

    // If slideOrder is empty, set slideOrder to slideshowItems.files.
    if (
      nextConfigFolder === activeFolder &&
      (slideOrder === '' || typeof slideOrder === 'undefined')
    ) {
      this.props.callUpdateConfigInDatabase(nextprops.slideshowItems.files);
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
    let makeArray = '';
    if (nextprops && nextprops.config.slidesToShowWeatherOn) {
      makeArray = JSON.parse(nextprops.config.slidesToShowWeatherOn);
      this.setState({ checkedItems: makeArray });
    }
    // Set this.selectedCheckboxes to whatever filesnames were loaded from the
    // database, or '' (nothing.)
    this.selectedCheckboxes = new Set(makeArray);

    // Set state.
    if (
      nextprops.config.slideOrder &&
      nextprops.config.slideOrder.length > 0 &&
      nextprops.config.name === activeFolder
    ) {
      this.props.updateSlideOrder(slideOrder);
      this.setState({ items: slideOrder });
    } else {
      this.props.updateSlideOrder(files);
      this.setState({ items: files });
    }
  }

  render() {
    if (this.props.activeFolder && this.state.items.length > 0) {
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
                  {this.state.items.map((fileObject, index) =>
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
