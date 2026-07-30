using System;
using System.Text;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Booking.Api.Infrastructure.Persistence.Converters;

// Stores C# PascalCase enums as SCREAMING_SNAKE_CASE strings in Postgres.
// e.g. DepositStatus.PendingSettlement <-> "PENDING_SETTLEMENT"
public sealed class ScreamingSnakeEnumConverter<TEnum> : ValueConverter<TEnum, string>
    where TEnum : struct, Enum
{
    public ScreamingSnakeEnumConverter()
        : base(
            e => ToSnake(e.ToString()),
            s => (TEnum)Enum.Parse(typeof(TEnum), ToPascal(s), true))
    { }

    private static string ToSnake(string pascal)
    {
        var sb = new StringBuilder();
        for (int i = 0; i < pascal.Length; i++)
        {
            if (i > 0 && char.IsUpper(pascal[i])) sb.Append('_');
            sb.Append(char.ToUpperInvariant(pascal[i]));
        }
        return sb.ToString();
    }

    private static string ToPascal(string snake)
    {
        var sb = new StringBuilder();
        foreach (var part in snake.Split('_', StringSplitOptions.RemoveEmptyEntries))
        {
            sb.Append(char.ToUpperInvariant(part[0]));
            if (part.Length > 1) sb.Append(part[1..].ToLowerInvariant());
        }
        return sb.ToString();
    }
}