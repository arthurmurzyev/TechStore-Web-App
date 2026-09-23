FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["TechStore.API/TechStore.API.csproj", "TechStore.API/"]
RUN dotnet restore "TechStore.API/TechStore.API.csproj"
COPY . .
WORKDIR "/src/TechStore.API"
RUN dotnet build "TechStore.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TechStore.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TechStore.API.dll"]
