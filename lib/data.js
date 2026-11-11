// Swap any `img` for a local /images/... file or an Unsplash URL (https://images.unsplash.com/...).
import { TOURISM_IMAGES } from "./images";

export const PLACES = [
  "Volcanoes National Park", "Nyungwe Forest National Park", "Akagera National Park",
  "Kigali Genocide Memorial", "Lake Kivu", "Gishwati-Mukura National Park", "Not sure yet",
];

export const DEST = [
  { n: "Volcanoes National Park", tag: "Mountain gorillas, golden monkeys and volcano hikes in the Virunga mountains.", place: PLACES[0], img: TOURISM_IMAGES.gorilla },
  { n: "Nyungwe Forest", tag: "One of Africa’s oldest rainforests, with a canopy walkway and chimpanzee tracking.", place: PLACES[1], img: TOURISM_IMAGES.forest },
  { n: "Akagera National Park", tag: "Rwanda’s savannah park: elephants, lions, giraffes and boat trips on the lake.", place: PLACES[2], img: TOURISM_IMAGES.elephant },
  { n: "Kigali Genocide Memorial", tag: "A quiet place to learn the history of 1994 and remember those who were lost.", place: PLACES[3], img: TOURISM_IMAGES.kigali },
  { n: "Lake Kivu", tag: "Calm beaches, boat rides and slow evenings on Rwanda’s western shore.", place: PLACES[4], img: TOURISM_IMAGES.lake },
];

export const TRIPS = [
  { n: "Volcanoes trek", img: TOURISM_IMAGES.mountain, t: "Climb through bamboo and mist to meet a gorilla family at the foot of the volcanoes. Move slowly, speak softly, and let the forest set the pace.", f: [["Duration", "2 days"], ["Level", "Moderate"], ["Best season", "Dry months"]] },
  { n: "Forest immersion", img: TOURISM_IMAGES.forestTrail, t: "Deep, ancient rainforest where the trails are steep and the rewards are quiet. Made for people who like their adventures a little wild.", f: [["Duration", "3 days"], ["Level", "Challenging"], ["Best season", "Dry months"]] },
  { n: "Savannah safari", img: TOURISM_IMAGES.savannah, t: "Spend a day and a night among elephants, giraffes and antelope, with a sunset boat ride to close the day.", f: [["Duration", "2 days"], ["Level", "Easy"], ["Best season", "Dry months"]] },
  { n: "Research camp hike", img: TOURISM_IMAGES.gorillaLodge, t: "Follow the path to the old research camp high on the slopes, where the story of mountain gorilla protection began.", f: [["Duration", "1 day"], ["Level", "Challenging"], ["Best season", "Dry months"]] },
  { n: "Lake rest", img: TOURISM_IMAGES.lakeIsland, t: "After the trek, slow down on the lake shore with sunsets, boats, and time to look back at the photos from the forest.", f: [["Duration", "2 days"], ["Level", "Easy"], ["Best season", "All year"]] },
];
export const MORE = " Local guides lead every group, keep numbers small, and make sure each visit supports the communities and conservation work around the park.";

export const FAQ = [
  ["When is the best time to visit?", "The dry months, roughly June to September and December to February, are easier for hiking. Gorillas can be visited all year."],
  ["How fit do I need to be?", "Treks range from easy to challenging depending on where the gorillas are that day. Tell us your comfort level and we plan around it."],
  ["Do I need a permit?", "Gorilla trekking needs a permit. We help you book it together with your transport, guide and stay."],
  ["Is there a minimum age?", "Gorilla trekking has a minimum age of 15. Other trips, such as the lake and the savannah, suit all ages."],
];
