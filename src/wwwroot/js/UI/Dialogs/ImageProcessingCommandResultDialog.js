/**
 A dialog that allows to view result of image processing command.
*/
ImageProcessingCommandResultDialogJS = function (docViewer, imageProcessingResult) {
    // create WebPropertyGridJS object for imageProcessingCommand
    var imageProcessingResultPropertyGrid = new Vintasoft.Shared.WebPropertyGridJS(imageProcessingResult);
    // create PropertyGridControlJS
    var imageProcessingResultPropertyGridControl = new PropertyGridControlJS(imageProcessingResultPropertyGrid, "imageProcessingCommandResultPropertyGrid", { hideNestedElements: false, editable: false });
    imageProcessingResultPropertyGridControl.createMarkup();

    // show the dialog
    $('#imageProcessingCommandResultDialog').modal('show');

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
