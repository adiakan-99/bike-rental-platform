# ==========================================
# STAGE 1: Build & Publish
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files first to leverage Docker layer caching for NuGet restore
COPY ["booking-service.csproj", "./"]
RUN dotnet restore "booking-service.csproj"

# Copy the rest of the source code and build
COPY . .
RUN dotnet publish "booking-service.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ==========================================
# STAGE 2: Lightweight Runtime Image
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

ENV ASPNETCORE_HTTP_PORTS=8085

# Expose HTTP port 
EXPOSE 8085

# Copy published binaries from the build stage
COPY --from=build /app/publish .

# Define entrypoint to run the web API
ENTRYPOINT ["dotnet", "booking-service.dll"]