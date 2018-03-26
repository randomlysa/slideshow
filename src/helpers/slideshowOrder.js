import _ from 'lodash';
// This function adds items that haven't been sorted to the end of the slideshow.

function combineOrderedAndUnorderedSlides(slideOrder, slideshowItems) {
    // Todo: check if files in slideOrder exists. Example - I renamed all
    // three files and now this whole feature is broken.

    // If slideOrder has no values, return the list of files.
    // Otherwise, slideOrder.map will cause an error.
    if (Object.values(slideOrder).length === 0) {
      return slideshowItems.files;
    }

    // Make an array of filenames that we have the sort order for.
    const slideOrderFiles = slideOrder.map(fileObject => {
      return fileObject.filename;
    });

    // Make an array of files that are in slideshowItems.files, but are not
    // in slideOrderFiles.
    const newFiles = _.filter(slideshowItems.files, fileObject => {
      return !slideOrderFiles.includes(fileObject.filename)
    })

    return [...slideOrder, ...newFiles];
}

export default combineOrderedAndUnorderedSlides;
