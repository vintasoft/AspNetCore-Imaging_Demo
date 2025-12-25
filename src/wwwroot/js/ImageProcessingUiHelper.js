/**
 A helper that helps to apply image processing commands to an image.
*/
ImageProcessingUiHelperJS = function (docViewer, unblockUiFunc) {

    // a value indicating whether image processing command uses image region from rectangular selection visual tool
    var _isVisualToolSelectionUsed = false;
    var _imageProcessingCommandSettingsDialog = null;
    var _imageProcessingCommandResultDialog = null;
    // a value indicating whether the image processing command settings dialog was shown
    var _isImageProcessingCommandSettingsDialogShown = false;


    /**
     Shows image processing command settings dialog.
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

        // if the image processing settings dialog was not shown earlier
        if (!_isImageProcessingCommandSettingsDialogShown) {
            // get a value indicating whether the undo manager is enabled in image viewer
            var isUndoManagerEnabled = viewer.get_UndoManager().get_IsEnabled();
            // if undo manager is enabled
            if (isUndoManagerEnabled)
                // specify that the image processing command should not change the source image file
                imageProcessingCommand.set_ChangeSource(false);
        }

        // if previous image processing dialog exists
        if (_imageProcessingCommandSettingsDialog != null) {
            // remove dialog from web document viewer
            docViewer.get_Items().removeItem(_imageProcessingCommandSettingsDialog);
            // destroy dialog
            delete _imageProcessingCommandSettingsDialog;
            // clear link to dialog
            _imageProcessingCommandSettingsDialog = null;
        }

        // create the property grid for image processing command
        var propertyGrid = new Vintasoft.Shared.WebPropertyGridJS(imageProcessingCommand);

        // create the image processing dialog
        _imageProcessingCommandSettingsDialog = new Vintasoft.Imaging.UI.Dialogs.WebUiPropertyGridDialogJS(
            propertyGrid,
            {
                title: "Image processing command settings",
                cssClass: "vsui-dialog imageProcessingSettings",
                localizationId: "imageProcessingSettingsDialog"
            });
        // add dialog to the web document viewer
        docViewer.get_Items().addItem(_imageProcessingCommandSettingsDialog);

        // remember that the image processing settings dialog was shown
        _isImageProcessingCommandSettingsDialogShown = true;

        // show the dialog
        _imageProcessingCommandSettingsDialog.show();
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

            // if the image processing settings dialog was not shown earlier
            if (!_isImageProcessingCommandSettingsDialogShown) {
                // get a value indicating whether the undo manager is enabled in image viewer
                var isUndoManagerEnabled = viewer.get_UndoManager().get_IsEnabled();
                // if undo manager is enabled
                if (isUndoManagerEnabled)
                    // specify that the image processing command should not change the source image file
                    imageProcessingCommand.set_ChangeSource(false);
            }

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


        // if previous image processing command result dialog exists
        if (_imageProcessingCommandResultDialog != null) {
            // remove dialog from web document viewer
            docViewer.get_Items().removeItem(_imageProcessingCommandResultDialog);
            // destroy dialog
            delete _imageProcessingCommandResultDialog;
            // clear link to dialog
            _imageProcessingCommandResultDialog = null;
        }

        // create the property grid for image processing command result
        var propertyGrid = new Vintasoft.Shared.WebPropertyGridJS(imageProcessingResult);

        // create the image processing result dialog
        _imageProcessingCommandResultDialog = new Vintasoft.Imaging.UI.Dialogs.WebUiPropertyGridDialogJS(
            propertyGrid,
            {
                title: "Image processing command result",
                cssClass: "vsui-dialog imageProcessingResult",
                localizationId: "imageProcessingResultDialog",
                hideNestedElements: false,
                editable: false
            });
        // add dialog to the web document viewer
        docViewer.get_Items().addItem(_imageProcessingCommandResultDialog);

        // show the dialog
        _imageProcessingCommandResultDialog.show();


        var documentRegions = imageProcessingResult.documentRegions;
        var regions = imageProcessingResult.regions;
        var halftoneRegions = imageProcessingResult.halftoneRegions;
        if (documentRegions != null || regions != null || halftoneRegions != null) {
            var fillColor = "rgba(255,255,0,0.3)";
            var highlightRegions;
            if (documentRegions != null) {
                highlightRegions = documentRegions;
                fillColor = "rgba(255,255,0,0.3)";
            }
            else if (regions != null) {
                highlightRegions = regions;
                fillColor = "rgba(0,255,0,0.3)";
            }
            else if (halftoneRegions != null) {
                highlightRegions = halftoneRegions;
                fillColor = "rgba(0,0,255,0.3)";
            }
            // highlight regions in image viewer
            __highlightInformativeImageProcessingCommandResults(docViewer, highlightRegions, fillColor)
        }
    }

    /**
     Highlights regions in image viewer.
     @param {object} docViewer DocumentViewer.
     @param {object} highlightRegions Regions.
     @param {string} fillColor Fill color.
    */
    function __highlightInformativeImageProcessingCommandResults(docViewer, highlightRegions, fillColor) {
        // get the highlight tool from web document viewer
        var highlightVisualTool = docViewer.getVisualToolById("HighlightTool");
        // set the highlight tool as current visual tool of web document viewer
        docViewer.set_CurrentVisualTool(highlightVisualTool);

        // array of WebHighlightObjectsJS
        var highlightObjects = [];

        // if highlight regions are defined
        if (highlightRegions != null) {
            // for each region
            for (var i = 0; i < highlightRegions.length; i++) {
                // get current region
                var region = highlightRegions[i];
                var highlightObject;
                // if source region is rectangle
                if (region.width != null)
                    // create WebHighlightObjectJS
                    highlightObject = Vintasoft.Imaging.UI.VisualTools.WebHighlightObjectJS.createObjectFromRectangle(region);
                // if source region is array of points
                else
                    // create WebHighlightObjectJS
                    highlightObject = Vintasoft.Imaging.UI.VisualTools.WebHighlightObjectJS.createObjectFromPolygon(region);
                // if region contains information about region type
                if (region.type != null)
                    // add region type as tooltip
                    highlightObject.set_ToolTip(region.type);

                // add created WebHighlightObjectJS
                highlightObjects.push(highlightObject);
            }
        }

        // clear highlight regions in highlight tool
        highlightVisualTool.clearItems();
        // add highlight regions to the highlight tool
        highlightVisualTool.addItems(new Vintasoft.Imaging.UI.VisualTools.WebHighlightObjectsJS(highlightObjects, fillColor, 'rgba(0,0,0,1)'));
    }

}
