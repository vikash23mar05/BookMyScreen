import dayjs from "dayjs";
import { MovieModel } from "../movie/movie.model";
import { TheaterModel } from "../theater/theater.model";
import { ShowModel } from "./show.model";
import { generateSeatLayout } from "../../utils";

const generatePriceMap = () =>
  new Map([
    ["PREMIUM", 510],
    ["EXECUTIVE", 290],
    ["NORMAL", 270],
  ]);

const formats = ["2D", "3D", "IMAX", "PVR PXL"];

// 🎞️ Realistic time slots
const fixedTimeSlots = [
  { start: "09:00 AM", end: "11:30 AM" },
  { start: "12:30 PM", end: "03:00 PM" },
  { start: "04:00 PM", end: "06:30 PM" },
  { start: "07:30 PM", end: "10:00 PM" },
  { start: "10:30 PM", end: "01:00 AM" },
];

/**
 * Regenerates all shows so they cover a rolling window starting today.
 * The window length must match the frontend date selector (next N days).
 */
export const reseedShows = async (windowDays = 7) => {
  const movies = await MovieModel.find();
  const theatres = await TheaterModel.find();

  if (!movies.length || !theatres.length) {
    console.warn(
      "⚠️  Cannot seed shows: movies or theatres are missing. Seed those first."
    );
    return;
  }

  await ShowModel.deleteMany({});

  const today = dayjs().startOf("day");
  const showsToInsert: any[] = [];

  for (const movie of movies) {
    for (const theatre of theatres) {
      for (let d = 0; d < windowDays; d++) {
        const showDate = today.add(d, "day");
        const formattedDate = showDate.format("DD-MM-YYYY");
        const numShows = Math.floor(Math.random() * 3) + 2; // 2–4 shows
        const selectedSlots = fixedTimeSlots.slice(0, numShows);

        for (const slot of selectedSlots) {
          showsToInsert.push({
            movie: movie._id,
            theater: theatre._id,
            location: (theatre as any).state,
            format: formats[Math.floor(Math.random() * formats.length)],
            audioType: "Dolby 7.1",
            startTime: slot.start,
            date: formattedDate, // "DD-MM-YYYY"
            priceMap: generatePriceMap(),
            seatLayout: generateSeatLayout(),
          });
        }
      }
    }
  }

  await ShowModel.insertMany(showsToInsert);
  console.log(
    `✅ Seeded ${showsToInsert.length} shows across ${windowDays} days for ${movies.length} movies × ${theatres.length} theatres.`
  );
};

/**
 * Self-healing check run on server startup.
 * If no shows exist for today's date, the show data is stale (or empty),
 * so we regenerate the full rolling window. This keeps the deployed site
 * working without anyone manually re-running the seed script.
 */
export const ensureShowsFresh = async (windowDays = 7) => {
  try {
    const todayFormatted = dayjs().startOf("day").format("DD-MM-YYYY");
    const freshCount = await ShowModel.countDocuments({ date: todayFormatted });

    if (freshCount > 0) {
      console.log(
        `🎬 Shows are fresh (${freshCount} shows for ${todayFormatted}). Skipping reseed.`
      );
      return;
    }

    console.log(
      `🕒 No shows found for ${todayFormatted}. Reseeding rolling ${windowDays}-day window...`
    );
    await reseedShows(windowDays);
  } catch (error) {
    // Never let seeding crash the server — just log and continue.
    console.error("❌ ensureShowsFresh failed:", error);
  }
};
