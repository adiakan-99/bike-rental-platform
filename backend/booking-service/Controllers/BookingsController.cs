using booking_service.Contracts;
using booking_service.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace booking_service.Controllers
{
    [Route("api/v1/bookings")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingQuoteService _qouteService;

        public BookingsController(IBookingQuoteService qouteService)
        {
            _qouteService = qouteService;
        }

        [HttpPost("quote")]
        public async Task<ActionResult<QuoteResponseDto>> GetBookingQuote([FromBody] QuoteRequestDto request)
        {
            try
            {
                var quote = await _qouteService.CalculateQuoteAsync(request);
                return Ok(quote);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
    }
}
