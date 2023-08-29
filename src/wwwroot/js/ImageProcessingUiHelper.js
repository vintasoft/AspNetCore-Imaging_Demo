/**
 A helper that helps to apply image processing commands to an image.
*/
ImageProcessingUiHelperJS = function (docViewer, unblockUiFunc) {

    // a value indicating whether image processing command uses image region from rectangular selection visual tool
    var _isVisualToolSelectionUsed = false;



    /**
     Shows image processing command setting dialog.
    */
    ImageProcessingUiHelperJS.prototype.showImageProcessingCommandSettingsDialog = function (imageProcessingCommand) {
        var viewer = docViewer.get_ImageViewer();

        // if command is WebQuadrilateralWarpCommandJS
        if (imageProcessingCommand instanceof Vintasoft.Imaging.ImageProcessing.WebQuadrilateralWarpCommandJS) {
            // get the destination points
            var commandDestPoints = imageProcessingCommand.get_DestinationPoints();
            // if points do not exist
            if (commandDestPoints.length === 0) {
                // get focused image
                var focusedImage = viewer.get_FocusedImage();
                // if image exists
                if (focusedImage != null) {
                    var size = focusedImage.get_Size();
                    // create destination points
                    var destPoints = [{ x: 0, y: 0 }];
                    destPoints.push({ x: size.width / 2, y: 0 });
                    destPoints.push({ x: 0, y: size.height / 2 });
                    destPoints.push({ x: size.width / 2, y: size.height / 2 });

                    // set destination points for WebQuadrilateralWarpCommandJS
                    imageProcessingCommand.set_DestinationPoints(destPoints);
                }
            }
        }

        // show image processing command setting dialog
        new ImageProcessingCommandSettingsDialogJS(imageProcessingCommand);
    }

    /**
     Image processing finished.
     @param {object} event Event.
     @param {object} imageProcessingCommand Image processing command.
    */
    ImageProcessingUiHelperJS.prototype.imageProcessingPanel_processingStarting = function (event, imageProcessingCommand) {
        if (imageProcessingCommand != null) {
            var uiElement = event.target;
            var docViewer = uiElement.get_RootControl();
            var viewer = docViewer.get_ImageViewer();

            // if command can work with image region
            if ((imageProcessingCommand instanceof Vintasoft.Imaging.ImageProcessing.WebImageProcessingCommandWithRegionJS) ||
                (imageProcessingCommand instanceof Vintasoft.Imaging.ImageProcessing.WebImageProcessingCommandWithRegionAndSourceChangeJS)) {
                // get visual tool
                var visualTool = viewer.get_VisualTool();
                // if tool exists and tool is Rectangular selection
                if (visualTool != null && visualTool.get_Name() === "RectangularSelection") {
                    // get selection
                    var rect = visualTool.get_Rectangle();
                    if (rect.width !== 0 && rect.height !== 0) {
                        // use selection in command
                        imageProcessingCommand.set_Region(rect);
                        // specify that image processing command uses image region from rectangular selection visual tool
                        _isVisualToolSelectionUsed = true;
                    }
                }
            }
        }
    }

    /**
     Image processing is finished.
     @param {object} data
    */
    ImageProcessingUiHelperJS.prototype.imageProcessingPanel_processingFinished = function (event, eventArgs) {
        var docViewer = this.get_RootControl();
        var imageProcessingCommand = eventArgs.command;
        var data = eventArgs.data;
        if (data.success) {
            // if image processing command did not change the image, i.e. image processing command is information command
            if (data.processedImage == null)
                // show the image processing results
                __informativeImageProcessingCommand_success(docViewer, data);

            // if image processing command can work with image region
            if ((imageProcessingCommand instanceof Vintasoft.Imaging.ImageProcessing.WebImageProcessingCommandWithRegionJS) ||
                (imageProcessingCommand instanceof Vintasoft.Imaging.ImageProcessing.WebImageProcessingCommandWithRegionAndSourceChangeJS)) {
                // if image processing command uses image region from rectangular selection visual tool
                if (_isVisualToolSelectionUsed) {
                    // reset information about image region in image processing command
                    imageProcessingCommand.setRegion(0, 0, 0, 0);
                    // specify that image processing command does not use image region from rectangular selection visual tool
                    _isVisualToolSelectionUsed = false;
                }
            }
        }
    }

    /**
     Informative image processing command is executed successfully.
     @param {object} docViewer DocumentViewer.
     @param {object} imageProcessingResult The result of applying the command to an image.
    */
    function __informativeImageProcessingCommand_success(docViewer, imageProcessingResult) {
        // unblock the UI
        unblockUiFunc();

        delete imageProcessingResult.success;
        delete imageProcessingResult.blocked;
        delete imageProcessingResult.errorMessage;
        delete imageProcessingResult.guid;
        delete imageProcessingResult.sourceImage;

        new ImageProcessingCommandResultDialogJS(docViewer, imageProcessingResult);
    }

}
