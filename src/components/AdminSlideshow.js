import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import $ from 'jquery';

import { API_ROOT } from '../config/api-config';

import combineOrderedAndUnorderedSlides from '../helpers/slideshowOrder';

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
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});
// End https://codesandbox.io/s/k260nyxq9v copy.

class AdminSlideshow extends Component {
  // https://codesandbox.io/s/k260nyxq9v
  constructor(props) {
    super(props);
    this.state = {
      items: ''
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  setWeatherSlide = (label) => {
    const activeFolder = this.props.activeFolder;
    const filename = label.target.value;

    // This if block and the whole 'Set' idea:
    // http://react.tips/checkboxes-in-react/
    if (this.selectedCheckboxes.has(filename)) {
      this.selectedCheckboxes.delete(filename);
    } else {
      this.selectedCheckboxes.add(filename);
    }

    // Update what checkboxes should be checked.
    this.setState({checkedItems: [...this.selectedCheckboxes]});

    // Update row 'name', column 'slidesToShowWeatherOn' with 'filename'
    // of checked box (slide to show weather on.)
    $.ajax({
      url: `${API_ROOT}/php/sqliteInsertslidesToShowWeatherOn.php`,
      type: 'post',
      dataType: 'json',
      data: {
        name: activeFolder,
        slidesToShowWeatherOn: [...this.selectedCheckboxes].join(";")
      }
    });
  } // setWeatherSlide

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
    const url = `${API_ROOT}/php/sqliteUpdateDatabaseConfig.php`;
    $.ajax({
      url,
      type: 'POST',
      data: {
        name: this.props.activeFolder,
        slideOrder: JSON.stringify(items)
      }
    })
    .done(data => {
      if (data === 'Row Updated') console.log('updated slideshow order')
      else console.log('there was an error updating the database', data);
    })
    .fail(e => {
      console.log(e);
    });

    this.setState({
      items,
    });
  }
  // End https://codesandbox.io/s/k260nyxq9v copy.

  deleteFile(filename) {
    if(window.confirm("Delete file?")) {
      let { activeFolder } = this.props;
      $.ajax({
        url: `${API_ROOT}/php/deleteFile.php`,
        type: 'POST',
        data: {
          fileToDelete: filename,
          folder: activeFolder
        }
      }) // ajax
      .done(data => {
        console.log('deleted', data);
        this.props.updateSlideshow(activeFolder);
      }) // ajax done
      .fail(e => {
        console.log('fail', e);
      }); // ajax fail
    } // if window.confirm
  } // deleteFile

  renderDraggable(fileObject, index) {
    const filename = fileObject.filename;
    const fileUrl =
      `${API_ROOT}/slideshows/${this.props.activeFolder}/${filename}`;

    let checkBoxStatus = '';
    if (this.props.config.slidesToShowWeatherOn &&
      this.props.config.slidesToShowWeatherOn.includes(filename)) {
      checkBoxStatus = 'checked';
    }

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
                alt="Slideshow Item"
                onClick={this.deleteFile.bind(this, filename)}
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
    )
  }

  componentWillReceiveProps(nextprops) {
    let makeArray = '';
    if (nextprops && nextprops.config.slidesToShowWeatherOn) {
      makeArray = nextprops.config.slidesToShowWeatherOn.split(";");
      this.setState({checkedItems: makeArray})
    }
    // Set this.selectedCheckboxes to whatever filesnames were loaded from the
    // database, or '' (nothing.)
    this.selectedCheckboxes = new Set(makeArray);


    // Set state to slideOrder if it exists.
    if (nextprops.config.slideOrder) {
      const slideOrder = JSON.parse(nextprops.config.slideOrder);
      const { slideshowItems } = nextprops;
      const finalOrder = combineOrderedAndUnorderedSlides(slideOrder, slideshowItems);
      this.setState({items: finalOrder });
    } else {
      this.setState({items: nextprops.slideshowItems.files});
    }
  }

  render() {
    if (this.props.activeFolder && this.state.items.length > 0) {
      // https://codesandbox.io/s/k260nyxq9v.
      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((fileObject, index) => (
                this.renderDraggable(fileObject, index)
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      )
      // End https://codesandbox.io/s/k260nyxq9v copy.
    } else {
      return (
        <div>Loading</div>
      )
    }
  }; // render
}

function mapStateToProps({ config, slideshowItems }) {
  return { config, slideshowItems };
}

export default connect(mapStateToProps)(AdminSlideshow);
