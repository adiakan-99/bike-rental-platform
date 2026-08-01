using booking_service.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace booking_service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        [HttpPatch("{id:int}/return")]
        public IActionResult Return(int id) => StatusCode(StatusCodes.Status501NotImplemented);

        [HttpPatch("{id:int}/cancel")]
        public IActionResult Cancel(int id, [FromBody] CancelBookingRequest request)
            => StatusCode(StatusCodes.Status501NotImplemented);

    }
}
