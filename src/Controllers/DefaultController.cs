using Microsoft.AspNetCore.Mvc;

namespace AspNetCoreImagingDemo.Controllers
{
    public class DefaultController : Controller
    {

        public DefaultController()
        {
        }

        public IActionResult Index()
        {
            return View();
        }

    }
}