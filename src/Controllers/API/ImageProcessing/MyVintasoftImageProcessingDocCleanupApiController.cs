using Microsoft.AspNetCore.Hosting;
using Vintasoft.Imaging.ImageProcessing.DocCleanup.AspNetCore.ApiControllers;

namespace AspNetCoreImagingDemo.Controllers
{
    /// <summary>
    /// A Web API controller for processing web document image.
    /// </summary>
    public class MyVintasoftImageProcessingDocCleanupApiController : VintasoftImageProcessingDocCleanupApiController
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="MyVintasoftImageProcessingDocCleanupApiController"/> class.
        /// </summary>
        public MyVintasoftImageProcessingDocCleanupApiController(IWebHostEnvironment hostingEnvironment)
            : base(hostingEnvironment)
        {
        }

    }
}
