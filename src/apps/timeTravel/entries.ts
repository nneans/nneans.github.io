export type TimeTravelCategory = "Travel" | "Conference" | "Field Trip" | "Event";
export type TimeTravelLayout = "standard" | "wide" | "tall" | "large";

/**
 * Edit each photo's date, title, and description here.
 * The gallery year is generated automatically from the first four digits of date.
 */
export interface TimeTravelPhoto {
  src: string;
  alt: string;
  date: string;
  title: string;
  description: string;
  layout: TimeTravelLayout;
}

export interface TimeTravelEntry {
  id: string;
  location: string;
  country: string;
  category: TimeTravelCategory;
  photos: TimeTravelPhoto[];
}

export const timeTravelEntries: TimeTravelEntry[] = [
  {
    id: "fukuoka-2026",





















    location: "Fukuoka",
    country: "Japan",
    category: "Travel",
    photos: [
      {
        src: "/assets/time-travel/2026-08-28-fukuoka-01.jpg",
        alt: "An evening stop inside a restaurant in Fukuoka",
        date: "2026.08.28",
        title: "somewhere in Fukuoka",
        description: "looking for a somthing special in Fukuoka.",
        layout: "tall",
      },
      {
        src: "/assets/time-travel/2026-08-28-fukuoka-02.jpg",
        alt: "A roast beef bowl served at a restaurant in Fukuoka",
        date: "2026.08.28",
        title: "Roast Beef Bowl",
        description: "A memorable roast beef bowl during the Fukuoka trip.",
        layout: "tall",
      },
      {
        src: "/assets/time-travel/2026-08-28-fukuoka-03.jpg",
        alt: "A yakiniku dinner table in Fukuoka",
        date: "2026.08.28",
        title: "Yakiniku in Fukuoka",
        description: "Dinner around a charcoal grill in Fukuoka.",
        layout: "tall",
      },
      {
        src: "/assets/time-travel/2026-08-28-fukuoka-04.jpg",
        alt: "Grilled beef and egg served at a restaurant in Fukuoka",
        date: "2026.08.28",
        title: "One More Plate",
        description: "One more plate from the food-filled Fukuoka trip.",
        layout: "tall",
      },
      {
        src: "/assets/time-travel/2026-08-28-fukuoka-05.jpg",
        alt: "An ASPAI and Process Mining Summer School T-shirt",
        date: "2026.08.28",
        title: "ASPAI T-shirt in Fukuoka",
        description: "ASPAI and Process Mining Summer School T-shirt from the Fukuoka trip.",
        layout: "wide",
      },
    ],
  },
  {
    id: "veterans-data-award-2026",
    location: "Ministry of Patriots and Veterans Affairs",
    country: "Republic of Korea",
    category: "Event",
    photos: [{
      src: "/assets/time-travel/2026-08-27-veterans-data-award.jpg",
      alt: "Flowers and a certificate from the veterans public data and AI idea competition",
      date: "2026.08.27",
      title: "보훈 공공데이터·AI 활용 아이디어 공모전 입상",
      description: "An award from the 2026 Veterans Public Data and AI Idea Competition.",
      layout: "tall",
    }],
  },
  {
    id: "aspai-2026",
    location: "POSTECH, Pohang",
    country: "Republic of Korea",
    category: "Conference",
    photos: [
      {
        src: "/assets/time-travel/2026-08-24-aspai-presentation.jpg",
        alt: "Godfather of Process Mining, Wil van der Aalst",
        date: "2026.08.24",
        title: "Process Mining Industry and Academia Symposium",
        description: "Process Mining Industry and Academia Symposium (ASPAI 2026) at POSTECH, Pohang.",
        layout: "wide",
      },
      {
        src: "/assets/time-travel/2026-08-24-best-paper-runner-up.jpg",
        alt: "Best Paper Runner-up Award certificate from ASPAI 2026",
        date: "2026.08.24",
        title: "Best Paper Runner-up Award",
        description: "PaCHITA received the Best Paper Runner-up Award at ASPAI 2026.",
        layout: "wide",
      },
    ],
  },
  {
    id: "graduation-address-2026",
    location: "Pusan National University",
    country: "Republic of Korea",
    category: "Event",
    photos: [{
      src: "/assets/time-travel/2026-08-21-graduation-address.jpg",
      alt: "Delivering the graduate representative address at Pusan National University",
      date: "2026.08.21",
      title: "Graduate Representative Address",
      description: "Delivering the representative address at the August 2026 graduation ceremony.",
      layout: "tall",
    }],
  },
  {
    id: "changwon-2026",
    location: "Changwon",
    country: "Republic of Korea",
    category: "Travel",
    photos: [
      {
        src: "/assets/time-travel/2026-08-02-changwon-imhanbyeol.jpg",
        alt: "A group photo taken in Changwon",
        date: "2026.08.02",
        title: "Interview with Imhanbyeol in Changwon",
        description: "A summer day in Changwon, saved as one of the moments worth keeping.",
        layout: "wide",
      },
      {
        src: "/assets/time-travel/2026-08-02-pingpong-01.jpg",
        alt: "Friends playing table tennis in Changwon",
        date: "2026.08.02",
        title: "Ping-Pong in Changwon",
        description: "A table-tennis match during the Changwon trip.",
        layout: "wide",
      },
      {
        src: "/assets/time-travel/2026-08-02-pingpong-02.jpg",
        alt: "A retro digital-camera photograph from a table-tennis match",
        date: "2026.08.02",
        title: "Ping-Pong, Take Two",
        description: "Another frame from the table-tennis match, captured with a compact camera.",
        layout: "wide",
      },
    ],
  },
  {
    id: "ddori-and-maru-2026",
    location: "Busan",
    country: "Republic of Korea",
    category: "Event",
    photos: [{
      src: "/assets/time-travel/2026-07-04-ddori-and-maru.jpg",
      alt: "Two cats named Ddori and Maru reaching for treats",
      date: "2026.07.04",
      title: "Ddori & Maru",
      description: "A treat break with Ddori and Maru.",
      layout: "tall",
    }],
  },
  {
    id: "sports-day-2026",
    location: "Pusan National University",
    country: "Republic of Korea",
    category: "Event",
    photos: [{
      src: "/assets/time-travel/2026-05-08-bae-lab-sports-day.jpg",
      alt: "BAE LAB group photo in a gym after a sports day",
      date: "2026.05.08",
      title: "BAE LAB Sports Day",
      description: "A sports day with BAE LAB, recorded after the games.",
      layout: "standard",
    }],
  },
  {
    id: "hyukjun-birthday-2026",
    location: "Busan",
    country: "Republic of Korea",
    category: "Event",
    photos: [{
      src: "/assets/time-travel/2026-04-26-hyukjun-birthday.jpg",
      alt: "Hyukjun at his birthday party",
      date: "2026.04.26",
      title: "Hyukjun's Birthday Party",
      description: "A birthday party for Hyukjun—sorry, Hyukjun.",
      layout: "tall",
    }],
  },
  {
    id: "cherry-blossoms-2026",
    location: "Busan",
    country: "Republic of Korea",
    category: "Travel",
    photos: [{
      src: "/assets/time-travel/2026-04-05-cherry-blossoms.jpg",
      alt: "A selfie under cherry blossoms at night",
      date: "2026.04.05",
      title: "Cherry Blossoms at Night",
      description: "A spring night spent looking at cherry blossoms.",
      layout: "tall",
    }],
  },
  {
    id: "mukho-2026",
    location: "Mukho",
    country: "Republic of Korea",
    category: "Travel",
    photos: [{
      src: "/assets/time-travel/2026-01-30-mukho.jpg",
      alt: "An instant photo taken by the sea in Mukho",
      date: "2026.01.30",
      title: "Winter Sea in Mukho",
      description: "A winter day by the sea in Mukho, captured on instant film.",
      layout: "tall",
    }],
  },
  {
    id: "seongju-2026",
    location: "Seongju",
    country: "Republic of Korea",
    category: "Travel",
    photos: [{
      src: "/assets/time-travel/2026-01-25-seongju.jpg",
      alt: "A handmade banner from the Seongju trip",
      date: "2026.01.25",
      title: "The Seongju Banner",
      description: "A handmade banner that became part of the trip's memory.",
      layout: "tall",
    }],
  },
  {
    id: "industry-academia-award-2025",
    location: "Pusan National University",
    country: "Republic of Korea",
    category: "Event",
    photos: [{
      src: "/assets/time-travel/2025-11-24-industry-academia-award.jpg",
      alt: "Team photo with an excellence award from the industry-academia competition",
      date: "2025.11.24",
      title: "지·산·학 경진대회 우수상",
      description: "An excellence award at the 2025 Industry-Academia Mathematics and Data Competition.",
      layout: "tall",
    }],
  },
  {
    id: "geumjeongsan-2025",
    location: "Geumjeongsan, Busan",
    country: "Republic of Korea",
    category: "Travel",
    photos: [{
      src: "/assets/time-travel/2025-11-16-geumjeongsan.jpg",
      alt: "Group photo at Godangbong Peak on Geumjeongsan",
      date: "2025.11.16",
      title: "At Godangbong Peak",
      description: "A group photo at the summit of Geumjeongsan.",
      layout: "tall",
    }],
  },
  {
    id: "osaka-august-20-2025",
    location: "Osaka",
    country: "Japan",
    category: "Travel",
    photos: [
      {
        src: "/assets/time-travel/2025-08-20-osaka-01.jpg",
        alt: "Instant photographs spread across a table in Osaka",
        date: "2025.08.20",
        title: "Instax Memories in Osaka",
        description: "A table covered with instant photographs from Osaka.",
        layout: "wide",
      },
      {
        src: "/assets/time-travel/2025-08-20-osaka-02.jpg",
        alt: "Friends gathered around a restaurant table in Osaka",
        date: "2025.08.20",
        title: "Dinner in Osaka",
        description: "A late summer dinner with friends in Osaka.",
        layout: "tall",
      },
    ],
  },
  {
    id: "rainy-kyoto-2025",
    location: "Kyoto",
    country: "Japan",
    category: "Travel",
    photos: [{
      src: "/assets/time-travel/2025-08-18-rainy-kyoto.jpg",
      alt: "Walking down a wet street in Kyoto",
      date: "2025.08.18",
      title: "Rainy Kyoto",
      description: "Walking through a quiet Kyoto street after the rain.",
      layout: "large",
    }],
  },
  {
    id: "osaka-august-16-2025",
    location: "Osaka",
    country: "Japan",
    category: "Travel",
    photos: [{
      src: "/assets/time-travel/2025-08-16-osaka.jpg",
      alt: "A bright summer street in Osaka",
      date: "2025.08.16",
      title: "A Summer Afternoon in Osaka",
      description: "Walking through Osaka on a bright summer afternoon.",
      layout: "tall",
    }],
  },
  {
    id: "night-run-2025",
    location: "Busan",
    country: "Republic of Korea",
    category: "Event",
    photos: [{
      src: "/assets/time-travel/2025-07-27-night-run-with-moon-and-chan.jpg",
      alt: "A motion-blurred photo during a night run with Moon and Chan",
      date: "2025.07.27",
      title: "Night Run with Moon & Chan",
      description: "A fast and slightly blurry night run with Moon and Chan.",
      layout: "wide",
    }],
  },
  {
    id: "tokyo-beer-2025",
    location: "Tokyo",
    country: "Japan",
    category: "Travel",
    photos: [{
      src: "/assets/time-travel/2025-07-22-tokyo-beer.jpg",
      alt: "Friends raising beer glasses at a restaurant in Tokyo",
      date: "2025.07.22",
      title: "Beer in Tokyo",
      description: "Raising a glass together during a summer night in Tokyo.",
      layout: "tall",
    }],
  },
  {
    id: "ikaho-2025",
    location: "Ikaho, Gunma",
    country: "Japan",
    category: "Travel",
    photos: [{
      src: "/assets/time-travel/2025-07-20-ikaho.jpg",
      alt: "Friends posing beneath a clear sky in Ikaho",
      date: "2025.07.20",
      title: "A Clear Day in Ikaho",
      description: "A clear summer day overlooking the mountains in Ikaho.",
      layout: "wide",
    }],
  },
  {
    id: "tokyo-ueno-2025",
    location: "Ueno, Tokyo",
    country: "Japan",
    category: "Travel",
    photos: [
      {
        src: "/assets/time-travel/2025-07-19-tokyo-ueno-01.jpg",
        alt: "Friends posing together in Ueno, Tokyo",
        date: "2025.07.19",
        title: "An Afternoon in Ueno",
        description: "A summer afternoon walking through Ueno with friends.",
        layout: "tall",
      },
      {
        src: "/assets/time-travel/2025-07-19-tokyo-ueno-02.jpg",
        alt: "Friends sitting together at a summer festival in Ueno",
        date: "2025.07.19",
        title: "Ueno Summer Festival",
        description: "Sitting together beside the lively summer festival in Ueno.",
        layout: "wide",
      },
    ],
  },
  {
    id: "ddaibums-day-2025",
    location: "Busan",
    country: "Republic of Korea",
    category: "Event",
    photos: [{
      src: "/assets/time-travel/2025-07-16-ddaibums-day.jpg",
      alt: "A two-frame photo strip from Ddaibum's day",
      date: "2025.07.16",
      title: "Ddaibum's Day",
      description: "Two frames from a night out for Ddaibum's day.",
      layout: "tall",
    }],
  },
  {
    id: "bbongsoon-birthday-2025",
    location: "Busan",
    country: "Republic of Korea",
    category: "Event",
    photos: [
      {
        src: "/assets/time-travel/2025-06-29-bbongsoon-birthday-01.jpg",
        alt: "Friends taking a mirror photo at Bbongsoon's birthday party",
        date: "2025.06.29",
        title: "Bbongsoon's Birthday — Photo Booth",
        description: "A mirror photo together during Bbongsoon's birthday celebration.",
        layout: "tall",
      },
      {
        src: "/assets/time-travel/2025-06-29-bbongsoon-birthday-02.jpg",
        alt: "Friends gathered around a birthday dinner table",
        date: "2025.06.29",
        title: "Bbongsoon's Birthday Dinner",
        description: "Dinner, cake, and friends gathered around the table for Bbongsoon's birthday.",
        layout: "tall",
      },
    ],
  },
  {
    id: "daegu-hip-hop-festival-2025",
    location: "Daegu",
    country: "Republic of Korea",
    category: "Event",
    photos: [{
      src: "/assets/time-travel/2025-06-28-daegu-hip-hop-festival.jpg",
      alt: "Friends posing together at the Daegu hip-hop festival",
      date: "2025.06.28",
      title: "Daegu Hip-hop Festival",
      description: "A summer evening with friends at the Daegu hip-hop festival.",
      layout: "wide",
    }],
  },
  {
    id: "best-friend-2025",
    location: "Busan",
    country: "Republic of Korea",
    category: "Event",
    photos: [{
      src: "/assets/time-travel/2025-06-20-best-friend.jpg",
      alt: "Two instant photographs taken with a best friend",
      date: "2025.06.20",
      title: "Instant Photos with My Best Friend",
      description: "Two instant photographs from a summer night with my best friend.",
      layout: "tall",
    }],
  },
  {
    id: "hyukjun-first-performance-2025",
    location: "Busan",
    country: "Republic of Korea",
    category: "Event",
    photos: [{
      src: "/assets/time-travel/2025-05-31-hyukjun-first-performance.jpg",
      alt: "Hyukjun signing a poster after his first performance",
      date: "2025.05.31",
      title: "Hyukjun's First Performance",
      description: "Signing a poster after Hyukjun's first performance.",
      layout: "standard",
    }],
  },
  {
    id: "my-birthday-2025",
    location: "Busan",
    country: "Republic of Korea",
    category: "Event",
    photos: [
      {
        src: "/assets/time-travel/2025-05-10-my-birthday-01.jpg",
        alt: "A birthday cake with a handwritten message",
        date: "2025.05.10",
        title: "Birthday Cake",
        description: "A birthday cake and handwritten message waiting at the table.",
        layout: "tall",
      },
      {
        src: "/assets/time-travel/2025-05-10-my-birthday-02.jpg",
        alt: "Mingyun wearing a party hat beside a birthday cake",
        date: "2025.05.10",
        title: "My Birthday",
        description: "A birthday dinner with a party hat, cake, and friends.",
        layout: "tall",
      },
    ],
  },
  {
    id: "dragons-house-2025",
    location: "Dragon's House",
    country: "Republic of Korea",
    category: "Event",
    photos: [{
      src: "/assets/time-travel/2025-05-05-at-dragons-house.jpg",
      alt: "Friends gathered together at Dragon's house with a video call on a tablet",
      date: "2025.05.05",
      title: "At Dragon's House",
      description: "A night together at Dragon's house, with one friend joining by video call.",
      layout: "tall",
    }],
  },
  {
    id: "shanghai-bund-2025",
    location: "The Bund, Shanghai",
    country: "China",
    category: "Travel",
    photos: [{
      src: "/assets/time-travel/2025-01-20-shanghai-bund.jpg",
      alt: "A nighttime portrait at the Bund in Shanghai",
      date: "2025.01.20",
      title: "The Bund at Night",
      description: "A nighttime walk along the Bund in Shanghai.",
      layout: "tall",
    }],
  },
  {
    id: "shanghai-water-town-2025",
    location: "Shanghai",
    country: "China",
    category: "Travel",
    photos: [{
      src: "/assets/time-travel/2025-01-19-shanghai-water-town.jpg",
      alt: "A group photograph beside an illuminated pagoda near Shanghai",
      date: "2025.01.19",
      title: "Shanghai Water Town",
      description: "An evening visit to a water town near Shanghai.",
      layout: "tall",
    }],
  },
];
