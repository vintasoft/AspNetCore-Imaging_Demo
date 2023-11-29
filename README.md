# VintaSoft ASP.NET Core Imaging Demo

This ASP.NET Core project uses <a href="https://www.vintasoft.com/vsimaging-dotnet-index.html">VintaSoft Imaging .NET SDK</a>.
The client-side of project uses HTML+JavaScript+CSS. The server-side of project uses ASP.NET Core API controllers.<br />
<br />
The project demonstrates how to view and process images in ASP.NET Core:
* Open image file.
* View images in image viewer with ability to zoom and magnify image. Also image viewer can rotate an image display. Set up settings of image viewer.
* View image thumbnails in thumbnail viewer. Set up settings of thumbnail viewer.
* Apply 110+ image processing commands to the whole image or image region. Set up settings of image processing command.
* Print processed image.
* Download processed image.
* The application can be used in any modern HTML5 web browser.
* The application UI is localized into 45 languages (Afrikaans, Arabic, Armenian, Azerbaijan, Belarusian, Bulgarian, Chinese, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, Georgian, German, Greece, Hebrew, Hindi, Hungarian, Italian, Japanese, Kazakh, Korean, Kyrgyz, Latvian, Lithuanian, Norwegian, Portugese, Romanian, Russian, Slovakian, Slovenian, Spanish, Swahili, Swedish, Tajik, Tatar, Turkish, Turkmen, Ukrainian, Uzbek, Vietnamese, Zulu).


## Screenshot
<img src="vintasoft_aspnet.core-imaging_demo-region_selection_on_image.png" title="VintaSoft ASP.NET Core Imaging Demo, Select region on image"><br />
<img src="vintasoft_aspnet.core-imaging_demo-image_processing_command_settings.png" title="VintaSoft ASP.NET Core Imaging Demo, Set up settings for image processing command"><br />
<img src="vintasoft_aspnet.core-imaging_demo-invert_command_applied_to_image_region.png" title="VintaSoft ASP.NET Core Imaging Demo, Invert an image region"><br />
<img src="vintasoft_aspnet.core-imaging_demo-image_viewer_settings.png" title="VintaSoft ASP.NET Core Imaging Demo, Set up settings of image viewer"><br />
<img src="vintasoft_aspnet.core-imaging_demo-thumbnail_viewer_settings.png" title="VintaSoft ASP.NET Core Imaging Demo, Set up settings of thumbnail viewer"><br />
<img src="vintasoft_aspnet.core-imaging_demo-rotated_viewer_display.png" title="VintaSoft ASP.NET Core Imaging Demo, Display rotated image in image viewer"><br />
<img src="vintasoft_aspnet.core-imaging_demo-magnify_image.png" title="VintaSoft ASP.NET Core Imaging Demo, Magnify image in image viewer"><br />


## Usage
1. Get the 30 day free evaluation license for <a href="https://www.vintasoft.com/vsimaging-dotnet-index.html" target="_blank">VintaSoft Imaging .NET SDK</a> as described here: <a href="https://www.vintasoft.com/docs/vsimaging-dotnet/Licensing-Evaluation.html" target="_blank">https://www.vintasoft.com/docs/vsimaging-dotnet/Licensing-Evaluation.html</a>

2. Update the evaluation license in "src\Startup.cs" file:
   ```
   Vintasoft.Imaging.ImagingGlobalSettings.Register("REG_USER", "REG_EMAIL", "EXPIRATION_DATE", "REG_CODE");
   ```

3. Build the project ("AspNetCoreImagingDemo.Net8.csproj" file) in Visual Studio or using .NET CLI:
   ```
   dotnet build AspNetCoreImagingDemo.Net8.csproj
   ```

4. Run compiled application and try to view and annotate images and documents.


## Documentation
VintaSoft Imaging .NET SDK on-line User Guide and API Reference for Web developer is available here: https://www.vintasoft.com/docs/vsimaging-dotnet-web/


## Support
Please visit our <a href="https://myaccount.vintasoft.com/">online support center</a> if you have any question or problem.
