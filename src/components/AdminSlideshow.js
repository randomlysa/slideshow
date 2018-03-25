import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import $ from 'jquery';
import swal from 'sweetalert2';

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
      items: '',
      checkedItems: []
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  // Update row 'name', column 'slidesToShowWeatherOn' with 'filename'
  // of checked box (slide to show weather on.)
  updateCheckboxesInDatabase () {
    $.ajax({
      url: `${API_ROOT}/php/sqliteInsertslidesToShowWeatherOn.php`,
      type: 'post',
      dataType: 'json',
      data: {
        name: this.props.activeFolder,
        slidesToShowWeatherOn: JSON.stringify([...this.selectedCheckboxes])
      }
    });
  }

  checkAllBoxes = () => {
    this.state.items.forEach(item => {
      this.selectedCheckboxes.add(item.filename);
    });
    this.setState({checkedItems: [...this.selectedCheckboxes]},
      this.updateCheckboxesInDatabase()
    );
  }

  uncheckAllBoxes = () => {
    this.selectedCheckboxes.clear();
    this.setState({checkedItems: [...this.selectedCheckboxes]},
      this.updateCheckboxesInDatabase()
    );
  }

  setWeatherSlide = (label) => {
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
    this.updateCheckboxesInDatabase();
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
    this.props.updateSlideOrder(items);
    this.setState({items})
  }
  // End https://codesandbox.io/s/k260nyxq9v copy.

  deleteFile(filename) {

    swal({
      title: 'Are you sure?',
      text: "Delete file",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        let { activeFolder } = this.props;
      $.ajax({
        context: this,
        url: `${API_ROOT}/php/deleteFile.php`,
        type: 'POST',
        data: {
          fileToDelete: filename,
          folder: activeFolder
        }
      }) // ajax
      .done(data => {
        if (data === "Error: file or folder not found") {
          swal({
            timer: 3000,
            toast: true,
            type: 'error',
            position: 'bottom-end',
            text: 'There was an error deleting the file.'
          });;
          console.log(data);
        } else {
          swal({
            timer: 1500,
            toast: true,
            type: 'success',
            position: 'bottom-end',
            text: 'File deleted!'
          });;
        }
        // Remove filename from Set and update database.
        this.selectedCheckboxes.delete(filename);
        this.updateCheckboxesInDatabase();
        this.props.getConfigFromDatabase(activeFolder);
        this.props.getFilesInSlideshowDir(activeFolder);
      }) // ajax done
      .fail(e => {
        console.log('fail', e);
      }) // ajax fail

      .then(() => {
        // Remove the deleted file from state and from the database.
        const newList = this.state.items.filter(item => {
          return item.filename !== filename;
        });
        this.props.updateSlideOrder(newList);
        this.setState({ items: newList });
      }); // then
      }
    });
  } // deleteFile

  renderDraggable(fileObject, index) {
    const filename = fileObject.filename;
    const fileUrl =
      `${API_ROOT}/slideshows/${this.props.activeFolder}/${filename}`;

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
    // Set up which weather checkboxes should be checked.
    let makeArray = '';
    if (nextprops && nextprops.config.slidesToShowWeatherOn) {
      makeArray = JSON.parse(nextprops.config.slidesToShowWeatherOn);
      this.setState({checkedItems: makeArray})
    }
    // Set this.selectedCheckboxes to whatever filesnames were loaded from the
    // database, or '' (nothing.)
    this.selectedCheckboxes = new Set(makeArray);

    // Update state - remove a deleted file, replace old items with new (if
    // folder) changed, add unsorted slides to the end of a sorted list.
    if (nextprops.config.slideOrder) {
      let slideOrder;
      // An item has been deleted. The sort order hasn't changed, only one item
      // has been removed. Use nextprops.slideshowItems.files as the slideOrder.
      // Or folder has been changed.
      if (this.props.slideshowItems.files.length !== nextprops.slideshowItems.files.length) {
        slideOrder = nextprops.slideshowItems.files
      } else {
        // if (typeof nextprops.config.slideOrder === 'string') {
        //   slideOrder = JSON.parse(nextprops.config.slideOrder);
        // } else {
        slideOrder = nextprops.config.slideOrder;
        // }
      }

      // Get an array of objects that contains the file names of all files in
      // this folder.
      const { slideshowItems } = nextprops;
      // Combine slideOrder with any new items that haven't been sorted yet.
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
        <div>
          <button onClick={this.checkAllBoxes}>Show weather on all slides</button>
          <br />
          <button onClick={this.uncheckAllBoxes}>Don't show weather</button>
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
      </div>
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
