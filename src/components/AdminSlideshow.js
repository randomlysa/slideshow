import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import $ from 'jquery';
import { API_ROOT } from '../config/api-config';


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
    .done(() => {
      console.log('updated slideshow order');
    })
    .fail(e => {
      console.log(e);
    });

    this.setState({
      items,
    });
  }
  // End https://codesandbox.io/s/k260nyxq9v copy.

  setWeatherSlide(name, newFilename) {
    const currentConfig = this.props.config.slidesToShowWeatherOn.split(';');
    let newConfig;
    // If new filename exists in currentConfig, remove it.
    if (currentConfig.includes(newFilename)) {
      newConfig = currentConfig.filter((filename) => {
        return filename !== newFilename;
      }); // filter
    // If new filename doesn't exist in currentConfig, add it.
    } else {
      newConfig = [...currentConfig, newFilename];
    }

    // Update row 'name', column 'slidesToShowWeatherOn' with 'filename'
    // of checked box (slide to show weather on.)
    $.ajax({
      url: `${API_ROOT}/php/sqliteInsertslidesToShowWeatherOn.php`,
      type: 'post',
      dataType: 'json',
      data: {
        name: name,
        slidesToShowWeatherOn: newConfig.join(';')
      }
    });
  } // setWeatherSlide

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
      .done((data) => {
        console.log('deleted', data);
        this.props.updateSlideshow(activeFolder);
      }) // ajax done
      .fail((e) => {
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
              <input type="checkbox"
                value={filename}
                name="check"
                onChange={this.setWeatherSlide.bind(this, this.props.activeFolder, filename)}
                checked={checkBoxStatus}
              />
              <label htmlFor={filename}></label>
                {provided.placeholder}

            </div>
            {provided.placeholder}
          </div>
        )}
     </Draggable>
    )
  }

  componentWillReceiveProps(nextprops) {
    // Set state to slideOrder if it exists.
    if (nextprops.config.slideOrder) {
      this.setState({items: JSON.parse(nextprops.config.slideOrder) });
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
