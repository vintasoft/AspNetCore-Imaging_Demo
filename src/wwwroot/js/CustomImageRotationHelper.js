/**
 A helper that helps to apply custom image rotation to an image in image viewer.
*/
CustomImageRotationHelperJS = function () {

    /**
     Creates "Apply custom rotation (90 degree clockwise) to image" button for context menu.
    */
    CustomImageRotationHelperJS.prototype.createApplyCustomImageRotationButton = function () {
        // create "Apply custom rotation to image" label
        var rotateImageClockwiseLabel = new Vintasoft.Imaging.UI.UIElements.WebUiLabelElementJS({ text: "Apply custom rotation (90 degree clockwise) to image", localizationId: "applyCustomImageRotation" });
        // create and return "Apply custom rotation (90 degree clockwise) to image" button
        return new Vintasoft.Imaging.UI.UIElements.WebUiElementContainerJS([rotateImageClockwiseLabel], {
            cssClass: "subMenu",
            onClick: { callback: __rotateImageClockwiseButton_clicked, data: rotateImageClockwiseLabel }
        });
    }

    /**
     Creates "Reset custom image rotation" button for context menu.
    */
    CustomImageRotationHelperJS.prototype.createResetCustomImageRotationButton = function () {
        // create "Reset custom image rotation" label
        var resetCustomImageRotationLabel = new Vintasoft.Imaging.UI.UIElements.WebUiLabelElementJS({ text: "Reset custom image rotation", localizationId: "resetCustomImageRotation" });
        // create and return "Reset custom image rotation" button
        return new Vintasoft.Imaging.UI.UIElements.WebUiElementContainerJS([resetCustomImageRotationLabel], {
            cssClass: "subMenu",
            onClick: { callback: __resetCustomImageRotationButton_clicked, data: resetCustomImageRotationLabel }
        });
    }

    /**
     "Apply custom rotation (90 degree clockwise) to image" button is clicked.
     @param {any} event Event.
     @param {any} uiElement "Apply custom rotation (90 degree clockwise) to image" label.
    */
    function __rotateImageClockwiseButton_clicked(event, uiElement) {
        var docViewer = uiElement.get_RootControl();
        var imageViewer = docViewer.get_ImageViewer();
        var focusedImageIndex = imageViewer.get_FocusedIndex();
        // if image viewer has focused image
        if (focusedImageIndex != -1) {
            // get custom rotation angle for focused image
            var focusedImageRotationAngle = imageViewer.getCustomImageRotationAngle(focusedImageIndex);
            // if focused image does not have custom rotation angle
            if (focusedImageRotationAngle == -1)
                // use rotate angle for all images as custom rotation angle for focused image
                focusedImageRotationAngle = imageViewer.get_ImageRotationAngle();

            // set custom rotation for focused image
            imageViewer.setCustomImageRotationAngle(focusedImageIndex, focusedImageRotationAngle + 90);
            // hide the context menu of image viewer
            __hideImageViewerContextMenu(docViewer);
        }
    }

    /**
     "Reset custom image rotation" button is clicked.
     @param {any} event Event.
     @param {any} uiElement "Reset custom image rotation" label.
    */
    function __resetCustomImageRotationButton_clicked(event, uiElement) {
        var docViewer = uiElement.get_RootControl();
        var imageViewer = docViewer.get_ImageViewer();
        var focusedImageIndex = imageViewer.get_FocusedIndex();
        // if image viewer has focused image
        if (focusedImageIndex != -1) {
            // reset custom rotation for focused image
            imageViewer.resetCustomImageRotationAngle(focusedImageIndex);
            // hide the context menu of image viewer
            __hideImageViewerContextMenu(docViewer);
        }
    }

    function __hideImageViewerContextMenu(docViewer) {
        var docViewerItems = docViewer.get_Items();

        // get the image viewer panel
        var imageViewerPanel = docViewerItems.getItemByRegisteredId("imageViewerPanel");
        // if panel exists
        if (imageViewerPanel != null) {
            var contextMenu = imageViewerPanel.get_ContextMenu();
            if (contextMenu != null) {
                // hide the context menu of image viewer
                contextMenu.hide();
            }
        }
    }

}
