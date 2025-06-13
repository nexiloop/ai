#!/bin/bash
# Test movie search functionality

echo "Testing movie search functionality..."

# Check if TMDB API key is available
if [ -z "$TMDB_API_KEY" ]; then
    echo "❌ TMDB_API_KEY not set"
    echo "Please set TMDB_API_KEY in your environment"
    exit 1
else
    echo "✅ TMDB_API_KEY is set"
fi

# Test TMDB API connectivity
echo "Testing TMDB API connectivity..."
response=$(curl -s "https://api.themoviedb.org/3/search/movie?api_key=$TMDB_API_KEY&query=Inception" || echo "ERROR")

if echo "$response" | grep -q "results"; then
    echo "✅ TMDB API connection successful"
    echo "Sample response:"
    echo "$response" | head -n 5
else
    echo "❌ TMDB API connection failed"
    echo "Response: $response"
    exit 1
fi

echo ""
echo "🎬 Movie search functionality is ready!"
echo "Users can now search for movies and TV shows by asking questions like:"
echo "- 'What are some good movies to watch?'"
echo "- 'Find me action movies from 2023'"
echo "- 'Tell me about the movie Inception'"
echo "- 'What TV shows are similar to Breaking Bad?'"
