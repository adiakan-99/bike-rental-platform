using booking_service.Contracts;
using booking_service.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace booking_service.Controllers
{
    [Route("api/v1/bookings")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingQuoteService _qouteService;
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingQuoteService qouteService, IBookingService bookingService)
        {
            _qouteService = qouteService;
            _bookingService = bookingService;
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

        [Authorize(Roles = "CUSTOMER")]
        [HttpPost]
        public async Task<ActionResult<BookingResponseDto>> CreateBooking([FromBody] CreateBookingRequestDto request)
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;

                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Invalid JWT token: 'userId' claim is missing or invalid." });
                }

                string authHeader = Request.Headers["Authorization"].ToString();

                var booking = await _bookingService.CreateBookingAsync(userId, request, authHeader);

                return StatusCode(StatusCodes.Status201Created, booking);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message }); 
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [Authorize(Roles = "CUSTOMER")]
        [HttpGet("mine")]
        public async Task<ActionResult<PagedResultDto<BookingResponseDto>>> GetMyBookings([FromBody] BookingFilterQueryDto query)
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;

                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Invalid JWT Token: 'userId' claim is missing or invalid." });
                }

                string authHeader = Request.Headers["Authorization"].ToString();

                var pagedBookings = await _bookingService.GetCustomerBookingsAsync(userId, query, authHeader);

                return Ok(pagedBookings);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred" });
            }
        }
    }
}
