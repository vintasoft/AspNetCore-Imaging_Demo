using Microsoft.AspNetCore.Hosting;
using Vintasoft.Imaging.ImageProcessing.AspNetCore.ApiControllers;

namespace AspNetCoreImagingDemo.Controllers
{
    /// <summary>
    /// A Web API controller for processing web image.
    /// </summary>
    public class MyVintasoftImageProcessingApiController : VintasoftImageProcessingApiController
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="MyVintasoftImageProcessingApiController"/> class.
        /// </summary>
        public MyVintasoftImageProcessingApiController(IWebHostEnvironment hostingEnvironment)
            : base(hostingEnvironment)
        {
        }

    }
}