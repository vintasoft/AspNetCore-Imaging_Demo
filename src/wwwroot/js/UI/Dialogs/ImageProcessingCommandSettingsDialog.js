/**
 A dialog that allows to show and change settings of image processing command.
*/
ImageProcessingCommandSettingsDialogJS = function (command) {
    // create WebPropertyGridJS object for imageProcessingCommand
    var imageProcessingCommandPropertyGrid = new Vintasoft.Shared.WebPropertyGridJS(command);
    // create PropertyGridControlJS
    var imageProcessingCommandPropertyGridControl = new PropertyGridControlJS(imageProcessingCommandPropertyGrid, "imageProcessingCommandSettingsPropertyGrid", { hideNestedElements: false, showReadOnlyElements: false });
    imageProcessingCommandPropertyGridControl.createMarkup();

    // show the dialog
    $('#imageProcessingCommandSettingsDialog').modal('show');
}
