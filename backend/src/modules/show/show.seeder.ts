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

const fixedTimeSlots = [
  { start: "09:00 AM", end: "11:30 AM" },
  { start: "12:30 PM", end: "03:00 PM" },
  { start: "04:00 PM", end: "06:30 PM" },
  { start: "07:30 PM", end: "10:00 PM" },
  { start: "10:30 PM", end: "01:00 AM" },
];

const BATCH_SIZE = 200;

export const reseedShows = async (windowDays = 7) => {
  const movies = await MovieModel.find();
  const theatres = await TheaterModel.find();

  if (!movies.length || !theatres.length) {
    console.warn("⚠️  Cannot seed shows: movies or theatres are missing.");
    return;
  }

  await ShowModel.deleteMany({});

  const today = dayjs().startOf("day");
  let batch: any[] = [];
  let total = 0;

  const flush = async () => {
    if (!batch.length) return;
    await ShowModel.insertMany(batch);
    total += batch.length;
    batch = [];
  };

  for (const movie of movies) {
    for (const theatre of theatres) {
      for (let d = 0; d < windowDays; d++) {
        const formattedDate = today.add(d, "day").format("DD-MM-YYYY");
        const numShows = Math.floor(Math.random() * 3) + 2;
        const selectedSlots = fixedTimeSlots.slice(0, numShows);

        for (const slot of selectedSlots) {
          batch.push({
            movie: movie._id,
            theater: theatre._id,
            location: (theatre as any).state,
            format: formats[Math.floor(Math.random() * formats.length)],
            audioType: "Dolby 7.1",
            startTime: slot.start,
            date: formattedDate,
            priceMap: generatePriceMap(),
            seatLayout: generateSeatLayout(),
          });

          if (batch.length >= BATCH_SIZE) await flush();
        }
      }
    }
  }

  await flush();
  console.log(`✅ Seeded ${total} shows across ${windowDays} days.`);
};

// Reseed only if today has no shows, so the deployed site always has
// shows matching the frontend's next-7-days selector.
export const ensureShowsFresh = async (windowDays = 7) => {
  try {
    const todayFormatted = dayjs().startOf("day").format("DD-MM-YYYY");
    const freshCount = await ShowModel.countDocuments({ date: todayFormatted });

    if (freshCount > 0) return;

    await reseedShows(windowDays);
  } catch (error) {
    console.error("❌ ensureShowsFresh failed:", error);
  }
};
