import mongoose from "mongoose";
import dotenv from "dotenv";
import { MovieModel } from "../modules/movie/movie.model";
import { config } from "../config/config";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const syncLatestMovies = async () => {
  if (!TMDB_API_KEY) {
    console.error("❌ TMDB_API_KEY is not defined in environment variables.");
    process.exit(1);
  }

  try {
    // Connect to database
    console.log("Connecting to database...");
    await mongoose.connect(config.databaseReplicaSet as string, {
      family: 4,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected to MongoDB ✅");

    // Fetch now playing movies
    console.log("Fetching now playing movies from TMDB...");
    const nowPlayingRes = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1&region=IN`
    );

    if (!nowPlayingRes.ok) {
      throw new Error(`TMDB now_playing request failed: ${nowPlayingRes.statusText}`);
    }

    const nowPlayingData = await nowPlayingRes.json();
    const results = nowPlayingData.results || [];
    console.log(`Fetched ${results.length} movies from TMDB. Fetching details...`);

    const mappedMovies = [];

    // Loop through movies to fetch details (runtime, certification)
    for (const movie of results) {
      if (!movie.poster_path) continue; // Skip movies without poster

      try {
        console.log(`Fetching details for: ${movie.title}...`);
        const detailRes = await fetch(
          `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&append_to_response=release_dates`
        );

        if (!detailRes.ok) {
          console.warn(`⚠️ Failed to fetch details for ${movie.title}, skipping.`);
          continue;
        }

        const details = await detailRes.json();

        // 1. Format Duration (runtime in minutes to "Xh Ym")
        const runtime = details.runtime || 130; // Default fallback to 130m
        const hours = Math.floor(runtime / 60);
        const mins = runtime % 60;
        const duration = `${hours}h ${mins}m`;

        // 2. Fetch Certification (US or IN release date certification)
        let certification = "UA"; // Default fallback
        const releaseDatesResults = details.release_dates?.results || [];

        // Check for Indian certification first
        const indiaRelease = releaseDatesResults.find((r: any) => r.iso_3166_1 === "IN");
        const usRelease = releaseDatesResults.find((r: any) => r.iso_3166_1 === "US");
        const activeRelease = indiaRelease || usRelease || releaseDatesResults[0];

        if (activeRelease && activeRelease.release_dates?.length > 0) {
          const certVal = activeRelease.release_dates[0].certification;
          if (certVal) {
            certification = certVal;
          }
        }

        // 3. Map Genres
        const genres = details.genres?.map((g: any) => g.name) || ["Drama"];

        // 4. Map Spoken Languages
        const languages = details.spoken_languages?.map((l: any) => l.english_name) || ["English"];

        // Format subset mapping
        const formatOptions = [["2D"], ["2D", "3D"], ["2D", "3D", "IMAX 2D"]];
        const randomFormat = formatOptions[Math.floor(Math.random() * formatOptions.length)];

        mappedMovies.push({
          title: movie.title,
          description: movie.overview || "No description available.",
          duration,
          genre: genres,
          releaseDate: new Date(movie.release_date || Date.now()),
          languages,
          certification,
          posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          backdropUrl: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          rating: Number((movie.vote_average || 7.5).toFixed(1)),
          votes: movie.vote_count || 120,
          format: randomFormat,
        });
      } catch (err) {
        console.error(`❌ Error mapping movie details for ${movie.title}:`, err);
      }
    }

    if (mappedMovies.length === 0) {
      console.log("⚠️ No movies mapped. Aborting sync.");
      process.exit(1);
    }

    // Replace existing database movies
    console.log(`Clearing existing movies (Count: ${await MovieModel.countDocuments()})...`);
    await MovieModel.deleteMany({});

    console.log(`Inserting ${mappedMovies.length} new movies into MongoDB...`);
    await MovieModel.insertMany(mappedMovies);

    console.log("✨ Successfully synced latest movies from TMDB! ✨");
    process.exit(0);
  } catch (error) {
    console.error("❌ Sync execution failed:", error);
    process.exit(1);
  }
};

syncLatestMovies();
