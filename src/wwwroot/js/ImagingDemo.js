var _fileService;

var _docViewer;

var _localizer;

var _openFileHelper;

var _previouslyUploadedFilesDialog;

var _blockUiDialog;



// === "File" toolbar, "Previously uploaded files" button ===

/**
 Creates UI button for showing the list with previously uploaded files.
*/
function __createPreviousUploadFilesButton() {
    // create the button that allows to show a dialog with previously uploaded image files and select image file
    var button = new Vintasoft.Imaging.UI.UIElements.WebUiButtonJS({
        cssClass: "uploadedFilesList",
        title: "Previously Uploaded Files",
        localizationId: "previousUploadFilesButton",
        onClick: __previousUploadFilesButton_clicked
    });
    return button;
}

function __previousUploadFilesButton_clicked(event, uiElement) {
    var docViewer = uiElement.get_RootControl();
    if (docViewer != null) {
        // if dialog does not exist
        if (_previouslyUploadedFilesDialog == null)
            // create dialog
            _previouslyUploadedFilesDialog = new PreviouslyUploadedFilesDialogJS(_fileService, docViewer, _openFileHelper, __showErrorMessage);
        // show the dialog
        _previouslyUploadedFilesDialog.show();
    }
}



// === "Tools" toolbar ===

/**
 Creates UI button for activating the visual tool, which allows to pan images in image viewer.
*/
function __createPanToolButton() {
    // if touch device is used
    if (__isTouchDevice()) {
        return new Vintasoft.Imaging.UI.UIElements.WebUiVisualToolButtonJS({
            cssClass: "vsdv-tools-panButton",
            title: "Pan, Zoom",
            localizationId: "panToolButton"
        }, "PanTool,ZoomTool");
    }
    else {
        return new Vintasoft.Imaging.UI.UIElements.WebUiVisualToolButtonJS({
            cssClass: "vsdv-tools-panButton",
            title: "Pan",
            localizationId: "panToolButton"
        }, "PanTool");
    }
}



// === Init UI ===

/**
 Registers custom UI elements in "WebUiElementsFactoryJS".
*/
function __registerNewUiElements() {
    // register the "Previously uploaded files" button in web UI elements factory
    Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.registerElement("previousUploadFilesButton", __createPreviousUploadFilesButton);

    // register the "Pan" button in web UI elements factory
    Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.registerElement("panToolButton", __createPanToolButton);
}

/**
 Initializes main menu of document viewer.
 @param {object} docViewerSettings Settings of document viewer.
*/
function __initMenu(docViewerSettings) {
    // get items of document viewer
    var items = docViewerSettings.get_Items();

    var uploadAndOpenFileButton = items.getItemByRegisteredId("uploadAndOpenFileButton");
    if (uploadAndOpenFileButton != null)
        uploadAndOpenFileButton.set_FileExtensionFilter(".bmp, .emf, .gif, .ico, .cur, .jpg, .jpeg, .jls, .pcx, .png, .psd, .tif, .tiff, .svg, .wmf, .jb2, .jbig2, .jp2, .j2k, .j2c, .jpc, .cr2, .crw, .nef, .nrw, .dng, .dcm, .dic, .acr, .pdf");

    var uploadAndAddFileButton = items.getItemByRegisteredId("uploadAndAddFileButton");
    if (uploadAndAddFileButton != null)
        uploadAndAddFileButton.set_FileExtensionFilter(".bmp, .emf, .gif, .ico, .cur, .jpg, .jpeg, .jls, .pcx, .png, .psd, .tif, .tiff, .svg, .wmf, .jb2, .jbig2, .jp2, .j2k, .j2c, .jpc, .cr2, .crw, .nef, .nrw, .dng, .dcm, .dic, .acr, .pdf");

    // get the "File" menu panel
    var fileMenuPanel = items.getItemByRegisteredId("fileToolbarPanel");
    // if menu panel is found
    if (fileMenuPanel != null) {
        // get items of file menu panel
        var fileMenuPanelItems = fileMenuPanel.get_Items();

        // add the "Previous uploaded files" button to the menu panel
        fileMenuPanelItems.insertItem(2, "previousUploadFilesButton");
    }
}

/**
 Initializes side panel of document viewer.
 @param {object} docViewerSettings Settings of document viewer.
*/
function __initSidePanel(docViewerSettings) {
    // get items of document viewer
    var items = docViewerSettings.get_Items();

    var sidePanel = items.getItemByRegisteredId("sidePanel");
    if (sidePanel != null) {
        var sidePanelItems = sidePanel.get_PanelsCollection();
        sidePanelItems.addItem("imageProcessingPanel");

        var imageProcessingPanel = items.getItemByRegisteredId("imageProcessingPanel");
        if (imageProcessingPanel != null) {
            var imageProcessingUiHelper = new ImageProcessingUiHelperJS(_docViewer, __unblockUI);

            Vintasoft.Shared.subscribeToEvent(imageProcessingPanel, "settingsButtonClicked", __imageProcessingPanel_settingsButtonClicked);
            Vintasoft.Shared.subscribeToEvent(imageProcessingPanel, "processingStarting", imageProcessingUiHelper.imageProcessingPanel_processingStarting);
            Vintasoft.Shared.subscribeToEvent(imageProcessingPanel, "processingFinished", imageProcessingUiHelper.imageProcessingPanel_processingFinished);
        }
    }

    // get the thumbnail viewer panel of document viewer
    var thumbnailViewerPanel = items.getItemByRegisteredId("thumbnailViewerPanel");
    // if panel is found
    if (thumbnailViewerPanel != null) {
        // subscribe to the "actived" event of the thumbnail viewer panel of document viewer
        Vintasoft.Shared.subscribeToEvent(thumbnailViewerPanel, "activated", __thumbnailsPanelActivated);
        // enable ability to delete thumbnails
        thumbnailViewerPanel.set_CanDeleteThumbnailsUsingContextMenu(true);
        // enable ability to set custom thumbnail rotation
        thumbnailViewerPanel.set_CanSetCustomViewRotationUsingContextMenu(true);
        // enable ability to move thumbnail
        thumbnailViewerPanel.set_CanMoveThumbnailUsingContextMenu(true);
    }
}

/**
 Initializes image viewer panel of document viewer.
 @param {object} docViewerSettings Settings of document viewer.
*/
function __initImageViewerPanel(docViewerSettings) {
    // get items of document viewer
    var items = docViewerSettings.get_Items();

    // get the image viewer panel
    var imageViewerPanel = items.getItemByRegisteredId("imageViewerPanel");
    // if panel exists
    if (imageViewerPanel != null) {
        // enable ability to set custom image rotation
        imageViewerPanel.set_CanSetCustomViewRotationUsingContextMenu(true);
    }
}

/**
 Thumbnail viewer panel of document viewer is activated.
*/
function __thumbnailsPanelActivated() {
    var thumbnailViewer = this.get_ThumbnailViewer();
    if (thumbnailViewer != null) {
        // create the progress image
        var progressImage = new Image();
        progressImage.src = __getApplicationUrl() + "Images/fileUploadProgress.gif";
        // specify that the thumbnail viewer must use the progress image for indicating the thumbnail loading progress
        thumbnailViewer.set_ProgressImage(progressImage);

        // additional bottom space for text with page number under thumbnail
        var textCaptionHeight = 18;
        var padding = thumbnailViewer.get_ThumbnailPadding();
        padding[2] += textCaptionHeight
        thumbnailViewer.set_ThumbnailPadding(padding);
        thumbnailViewer.set_DisplayThumbnailCaption(true);
    }
}



// === Image processing ===

/**
 The "Settings" button in image processing panel is clicked.
 @param {object} event Event.
 @param {object} command Selected image processing command.
*/
function __imageProcessingPanel_settingsButtonClicked(event, command) {
    if (command != null) {
        var imageProcessingUiHelper = new ImageProcessingUiHelperJS(_docViewer, __unblockUI);
        imageProcessingUiHelper.showImageProcessingCommandSettingsDialog(command);
    }
}



// === Image viewer events ===

function __imageViewer_focusedIndexChanged() {
    // get visual tool of image viewer
    var visualTool = _docViewer.get_ImageViewer().get_VisualTool();
    // if visual tool is WebHighlightToolJS and it highlights barcode recognition results
    if (visualTool != null && (visualTool instanceof Vintasoft.Imaging.UI.VisualTools.WebHighlightToolJS)) {
        // clear visual tool in image viewer
        _docViewer.clearCurrentVisualTool();
    }
}



// === Document viewer events ===

function __docViewer_warningOccured(event, eventArgs) {
    // show the alert if warning occured
    __showErrorMessage(eventArgs.message);
}

function __docViewer_asyncOperationStarted(event, data) {
    // get description of asynchronous operation
    var description = data.description;

    // if image is prepared for printing
    if (description === "Image prepared to print") {
        // do not block UI when images are preparing for printing
    }
    else {
        // block UI
        __blockUI(data.description);
    }
}

function __docViewer_asyncOperationFinished(event, data) {
    // unblock UI
    __unblockUI();
}

function __docViewer_asyncOperationFailed(event, data) {
    // get description of asynchronous operation
    var description = data.description;
    // get additional information about asynchronous operation
    var additionalInfo = data.data;
    // if additional information exists
    if (additionalInfo != null)
        // show error message
        __showErrorMessage(additionalInfo);
    // if additional information does NOT exist
    else
        // show error message
        __showErrorMessage(description + ": unknown error.");
}

function __docViewer_thumbnailsDeleting(event, eventArgs) {
    // reset the active visual tool in image viewer
    _docViewer.get_ImageViewer().get_VisualTool().reset();

    var message;
    if (eventArgs.indexes.length == 1)
        message = "Do you want to remove thumbnail?";
    else
        message = "Do you want to remove thumbnails?";

    if (!confirm(message)) {
        eventArgs.cancel = true;
    }
}



// === Utils ===

/**
 Blocks the UI. 
 @param {string} text Message that describes why UI is blocked.
*/
function __blockUI(text) {
    _blockUiDialog = new BlockUiDialogJS(text);
}

/**
 Unblocks the UI.
*/
function __unblockUI() {
    if (_blockUiDialog != null) {
        _blockUiDialog.close();
        _blockUiDialog = null;
    }
}

/**
 Shows an error message.
 @param {object} data Information about error.
*/
function __showErrorMessage(data) {
    __unblockUI();
    new ErrorMessageDialogJS(data);
}

/**
 Returns application URL.
*/
function __getApplicationUrl() {
    var applicationUrl = window.location.toString();
    if (applicationUrl[applicationUrl.length - 1] != '/')
        applicationUrl = applicationUrl + '/';
    return applicationUrl;
}



// === Localization ===

/**
 Creates the dictionary for localization of application UI.
*/
function __createUiLocalizationDictionary() {
    var tempDialogs = [];
    __createDocumentViewerDialogsForLocalization(tempDialogs);

    var localizationDict = _localizer.getDocumentLocalizationDictionary();
    var localizationDictString = JSON.stringify(localizationDict, null, '\t');
    console.log(localizationDictString);

    var floatingContainer = document.getElementById("documentViewerContainer");
    for (var i = 0; i < tempDialogs.length; i++) {
        floatingContainer.removeChild(tempDialogs[i].get_DomElement());
        delete tempDialogs[i];
    }
}

/**
 Creates the dialogs, which are used in Web Document Viewer, for localization.
*/
function __createDocumentViewerDialogsForLocalization(tempDialogs) {
    var floatingContainer = document.getElementById("documentViewerContainer");

    var documentPasswordDialog = new Vintasoft.Imaging.UI.Dialogs.WebUiDocumentPasswordDialogJS();
    documentPasswordDialog.render(floatingContainer);
    tempDialogs.push(documentPasswordDialog);

    var imageSelectionDialog = new Vintasoft.Imaging.UI.Dialogs.WebImageSelectionDialogJS();
    imageSelectionDialog.render(floatingContainer);
    tempDialogs.push(imageSelectionDialog);

    var documentLayoutSettingsDialog = new Vintasoft.Imaging.UI.Dialogs.WebDocumentLayoutSettingsDialogJS();
    documentLayoutSettingsDialog.render(floatingContainer);
    tempDialogs.push(documentLayoutSettingsDialog);

    var printImagesDialog = new Vintasoft.Imaging.UI.Dialogs.WebPrintImagesDialogJS();
    printImagesDialog.render(floatingContainer);
    tempDialogs.push(printImagesDialog);

    var imageViewerSettingsDialog = new Vintasoft.Imaging.UI.Dialogs.WebImageViewerSettingsDialogJS();
    imageViewerSettingsDialog.render(floatingContainer);
    tempDialogs.push(imageViewerSettingsDialog);

    var thumbnailViewerSettingsDialog = new Vintasoft.Imaging.UI.Dialogs.WebThumbnailViewerSettingsDialogJS();
    thumbnailViewerSettingsDialog.render(floatingContainer);
    tempDialogs.push(thumbnailViewerSettingsDialog);

    var uploadImageFromUrlDialog = new Vintasoft.Imaging.UI.Dialogs.WebUiUploadImageFromUrlDialogJS();
    uploadImageFromUrlDialog.render(floatingContainer);
    tempDialogs.push(uploadImageFromUrlDialog);

    var exportFileSettingsDialog = new Vintasoft.Imaging.UI.Dialogs.WebExportFileSettingsDialogJS();
    exportFileSettingsDialog.render(floatingContainer);
    tempDialogs.push(exportFileSettingsDialog);


    // create image viewer context menu panel
    var imageViewerContextMenu = new Vintasoft.Imaging.UI.UIElements.WebImageViewerContextMenuJS();
    imageViewerContextMenu.render(floatingContainer);
    tempDialogs.push(imageViewerContextMenu);
    
    // create thumbnail viewer context menu panel
    var thumbnailViewerContextMenu = new Vintasoft.Imaging.UI.UIElements.WebThumbnailViewerContextMenuJS();
    thumbnailViewerContextMenu.render(floatingContainer);
    tempDialogs.push(thumbnailViewerContextMenu);
}

/**
 Enables the localization of application UI.
*/
function __enableUiLocalization() {
    // if localizer is ready (localizer loaded localization dictionary)
    if (_localizer.get_IsReady()) {
        // localize DOM-elements of web page
        _localizer.localizeDocument();
    }
    // if localizer is NOT ready
    else
        // wait when localizer will be ready
        Vintasoft.Shared.subscribeToEvent(_localizer, "ready", function () {
            // localize DOM-elements of web page
            _localizer.localizeDocument();
        });

    // subscribe to the "dialogShown" event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "dialogShown", function (event, data) {
        _localizer.localizeDocument();
    });

    // subscribe to the "contextMenuShown" event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "contextMenuShown", function (event, data) {
        _localizer.localizeDocument();
    });
}

/**
 Returns a value indicating whether touch device is used.
*/
function __isTouchDevice() {
    return (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}



// === Main ===

/**
 Main function.
*/
function __main() {
    // set the session identifier
    var hiddenSessionFieldElement = document.getElementById('hiddenSessionField');
    Vintasoft.Shared.WebImagingEnviromentJS.set_SessionId(hiddenSessionFieldElement.value);

    // specify web services, which should be used in this demo

    _fileService = new Vintasoft.Shared.WebServiceControllerJS(__getApplicationUrl() + "vintasoft/api/MyVIntasoftFileApi");

    Vintasoft.Shared.WebServiceJS.defaultFileService = _fileService;
    Vintasoft.Shared.WebServiceJS.defaultImageCollectionService = new Vintasoft.Shared.WebServiceControllerJS(__getApplicationUrl() + "vintasoft/api/MyVintasoftImageCollectionApi");
    Vintasoft.Shared.WebServiceJS.defaultImageService = new Vintasoft.Shared.WebServiceControllerJS(__getApplicationUrl() + "vintasoft/api/MyVintasoftImageApi");

    Vintasoft.Shared.WebServiceJS.defaultImageProcessingService = new Vintasoft.Shared.WebServiceControllerJS(__getApplicationUrl() + "vintasoft/api/MyVintasoftImageProcessingApi");
    Vintasoft.Shared.WebServiceJS.defaultImageProcessingDocCleanupService = new Vintasoft.Shared.WebServiceControllerJS(__getApplicationUrl() + "vintasoft/api/MyVintasoftImageProcessingDocCleanupApi");

    // create UI localizer
    _localizer = new Vintasoft.Shared.VintasoftLocalizationJS();

    // register new UI elements
    __registerNewUiElements();

    // create the document viewer settings
    var docViewerSettings = new Vintasoft.Imaging.DocumentViewer.WebDocumentViewerSettingsJS("documentViewerContainer", "documentViewer");
    // enable image uploading from URL
    docViewerSettings.set_CanUploadImageFromUrl(true);
    // specify that document viewer should show "Export and download file" button instead of "Download file" button
    docViewerSettings.set_CanExportAndDownloadFile(true);
    docViewerSettings.set_CanDownloadFile(false);
    docViewerSettings.set_CanAddFile(true);
    docViewerSettings.set_CanClearSessionCache(true);

    // initialize main menu of document viewer
    __initMenu(docViewerSettings);

    // initialize side panel of document viewer
    __initSidePanel(docViewerSettings);

    // initialize image viewer panel
    __initImageViewerPanel(docViewerSettings);

    // create the document viewer
    _docViewer = new Vintasoft.Imaging.DocumentViewer.WebDocumentViewerJS(docViewerSettings);

    // subscribe to the "warningOccured" event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "warningOccured", __docViewer_warningOccured);
    // subscribe to the asyncOperationStarted event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "asyncOperationStarted", __docViewer_asyncOperationStarted);
    // subscribe to the asyncOperationFinished event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "asyncOperationFinished", __docViewer_asyncOperationFinished);
    // subscribe to the asyncOperationFailed event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "asyncOperationFailed", __docViewer_asyncOperationFailed);

    // subscribe to the thumbnailsDeleting event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "thumbnailsDeleting", __docViewer_thumbnailsDeleting);

    // get the thumbnail viewer of document viewer
    var thumbnailViewer1 = _docViewer.get_ThumbnailViewer();
    thumbnailViewer1.set_CanDragThumbnails(true);
    thumbnailViewer1.set_CanNavigateThumbnailsUsingKeyboard(true);
    thumbnailViewer1.set_CanSelectThumbnailsUsingKeyboard(true);
    thumbnailViewer1.set_CanDeleteThumbnailsUsingKeyboard(true);
    thumbnailViewer1.set_UseThumbnailActionsPanel(true);

    // get the image viewer of document viewer
    var imageViewer1 = _docViewer.get_ImageViewer();
    // specify that image viewer must show images in the single continuous column mode
    imageViewer1.set_DisplayMode(new Vintasoft.Imaging.WebImageViewerDisplayModeEnumJS("SingleContinuousColumn"));
    // specify that image viewer must show images in the fit width mode
    imageViewer1.set_ImageSizeMode(new Vintasoft.Imaging.WebImageSizeModeEnumJS("FitToWidth"));

    // create the progress image
    var progressImage = new Image();
    progressImage.src = __getApplicationUrl() + "Images/fileUploadProgress.gif";
    // specify that the image viewer must use the progress image for indicating the image loading progress
    imageViewer1.set_ProgressImage(progressImage);

    // subscribe to the focusedIndexChanged event of image viewer
    Vintasoft.Shared.subscribeToEvent(imageViewer1, "focusedIndexChanged", __imageViewer_focusedIndexChanged);

    // names of visual tools in composite visual tool
    var visualToolNames = "PanTool";
    // if touch device is used
    if (__isTouchDevice()) {
        // get zoom tool from document viewer
        var zoomTool = _docViewer.getVisualToolById("ZoomTool");
        // specify that zoom tool should not disable context menu
        zoomTool.set_DisableContextMenu(false);

        // add name of zoom tool to the names of visual tools of composite visual tool
        visualToolNames = visualToolNames + ",ZoomTool";
    }
    // get the visual tool, which allows to pan and zoom images in image viewer
    var tool = _docViewer.getVisualToolById(visualToolNames);
    // set the visual tool as active visual tool in image viewer
    _docViewer.set_CurrentVisualTool(tool);

    // copy the default file to the uploaded image files directory and open the file
    _openFileHelper = new OpenFileHelperJS(_docViewer, __showErrorMessage);
    _openFileHelper.openDefaultImageFile("VintasoftImagingDemo.pdf");

    $(document).ready(function () {
        //// create the dictionary for localization of application UI
        //__createUiLocalizationDictionary();

        // enable the localization of application UI
        __enableUiLocalization();
    });
}



// run main function
__main();
