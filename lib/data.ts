import { asset } from "@/lib/asset";

export const colorways = [
  {
    id: "cyber-neon",
    name: "Cyber Neon",
    finish: "Matte black, #00FF66 accent",
    hex: "#00FF66",
    mirror: false,
    accent: "#00FF66",
    glow: "rgba(0, 255, 102, 0.55)",
    image: asset("/images/scooter-cyber-neon.png"),
    swatch:
      "conic-gradient(from 210deg, #101012 0 62%, #00FF66 62% 78%, #101012 78% 100%)",
  },
  {
    id: "acid-green",
    name: "Acid Green",
    finish: "Solid high gloss #22C55E",
    hex: "#22C55E",
    mirror: false,
    accent: "#A3E635",
    glow: "rgba(163, 230, 53, 0.62)",
    image: asset("/images/scooter-acid-green.png"),
    swatch: "linear-gradient(145deg, #E4FF5A, #22C55E)",
  },
  {
    id: "stealth",
    name: "Stealth Shadow",
    finish: "Pure matte #0F0F11",
    hex: "#0F0F11",
    mirror: true,
    accent: "#00FF66",
    glow: "rgba(0, 255, 102, 0.28)",
    image: asset("/images/scooter-obsidian.png"),
    swatch: "linear-gradient(160deg, #3a3a40, #0F0F11 62%)",
  },
  {
    id: "toxic-white",
    name: "Toxic White",
    finish: "Ceramic #F8FAFC, green trim",
    hex: "#F8FAFC",
    mirror: false,
    accent: "#A3E635",
    glow: "rgba(190, 255, 214, 0.42)",
    image: asset("/images/scooter-toxic-white.png"),
    swatch: "linear-gradient(145deg, #FFFFFF, #E7FFF0 58%, #A3E635)",
  },
] as const;

export type ColorId = (typeof colorways)[number]["id"];

export function getColorway(id: string) {
  return colorways.find((color) => color.id === id) ?? colorways[0];
}

export const quickSpecs = [
  { label: "Acceleration", value: "2.6s" },
  { label: "Weight", value: "98 kg" },
  { label: "Charging", value: "80% in 55 mins" },
] as const;

export const heroChapters = [
  {
    badge: "01 / Instant Kinetic Torque",
    title: "Pure Electric Architecture. Zero Compromise.",
    body: "Engineered with a liquid-cooled PMSM motor and 4.2 kWh modular battery pack.",
  },
  {
    badge: "02 / Aerodynamic Precision",
    title: "Sculpted in the Dark. Built to Glide.",
    body: "",
  },
  {
    badge: "03 / Cyber Intelligence",
    title: "7-Inch Touchscreen with AuraOS 3.0.",
    body: "",
  },
] as const;

export const telemetry = [
  { label: "0–40 km/h in", value: 2.6, decimals: 1, unit: "s" },
  { label: "Top Speed", value: 105, decimals: 0, unit: " km/h" },
  { label: "True Range", value: 180, decimals: 0, unit: " km" },
] as const;

export const auraOsChips = ["Turn-by-Turn GPS", "OTA Updates", "Theft-Proof Digital Key"] as const;

export const rideModes = [
  { id: "eco", chip: "Eco (Max Range: 180 km)", range: 180 },
  { id: "city", chip: "City (Balanced: 145 km)", range: 145 },
  { id: "warp", chip: "Warp (Sport: 110 km)", range: 110 },
] as const;

export type RideModeId = (typeof rideModes)[number]["id"];

export const hotspots = [
  {
    id: "battery",
    index: "01",
    node: "Floorboard",
    title: "4.2 kWh IP67 Battery Pack",
    summary: "Removable, fast-charge capable, flame-retardant casing.",
    x: 50,
    y: 63,
    box: { x: 40, y: 54, w: 20, h: 16 },
    specs: [
      ["Chemistry", "NMC modular"],
      ["Capacity", "4.2 kWh"],
      ["Sealing", "IP67"],
      ["Fast charge", "80% in 55 min"],
      ["Casing", "Flame-retardant"],
      ["Service", "Removable pack"],
    ],
    body: "The pack sits low in the floorboard, sealed to IP67 and wrapped in a flame-retardant composite shell. It unlatches for service, and on the fast home charger it reaches 80% in 55 minutes.",
  },
  {
    id: "motor",
    index: "02",
    node: "Rear Wheel Hub",
    title: "Mid-Drive PMSM Motor",
    summary: "6.8 kW peak power, zero belt lag.",
    x: 79,
    y: 73,
    box: { x: 70, y: 60, w: 16, h: 22 },
    specs: [
      ["Type", "Liquid-cooled PMSM"],
      ["Peak power", "6.8 kW"],
      ["Drive", "Direct, zero belt"],
      ["0–40 km/h", "2.6 seconds"],
      ["Cooling", "Liquid loop"],
      ["Feel", "Instant torque"],
    ],
    body: "A liquid-cooled PMSM delivers 6.8 kW peak straight to the rear hub. There is no belt between the twist of the throttle and the tyre — torque arrives as a single, silent shove.",
  },
  {
    id: "display",
    index: "03",
    node: "Handlebar Display",
    title: "AuraOS Touch Instrument Cluster",
    summary: "LTE, Bluetooth, and hill-hold assist.",
    x: 31,
    y: 30,
    box: { x: 20, y: 14, w: 20, h: 24 },
    specs: [
      ["Display", "7-inch touch"],
      ["Software", "AuraOS 3.0"],
      ["Radios", "LTE + Bluetooth"],
      ["Navigation", "Turn-by-turn GPS"],
      ["Updates", "OTA"],
      ["Hold", "Hill-hold assist"],
    ],
    body: "The 7-inch cluster runs AuraOS 3.0. LTE and Bluetooth keep turn-by-turn guidance, over-the-air updates, and a theft-proof digital key on the bars. Hill-hold keeps the Pulse still on a grade.",
  },
  {
    id: "brakes",
    index: "04",
    node: "Braking System",
    title: "Dual Disc CBS with Regenerative Kinetic Recovery",
    summary: "Mechanical discs for the stop. The motor feeds the pack on the way down.",
    x: 22,
    y: 74,
    box: { x: 13, y: 60, w: 16, h: 22 },
    specs: [
      ["Layout", "Dual disc CBS"],
      ["Front", "Disc, CBS linked"],
      ["Rear", "Disc + regen blend"],
      ["Recovery", "Kinetic regen"],
      ["Assist", "Hill-hold"],
      ["Feel", "Silent, linear"],
    ],
    body: "Dual disc CBS does the hard stop. As the throttle rolls closed, regenerative kinetic recovery blends the motor into the brake, putting energy back into the 4.2 kWh pack on every slowdown.",
  },
] as const;

export type Hotspot = (typeof hotspots)[number];

export const accessories = [
  {
    id: "helmet",
    name: "Smart Helmet",
    price: 4999,
    copy: "Bluetooth intercom, integrated brake light, matte obsidian shell.",
  },
  {
    id: "charger",
    name: "Fast Home Charger",
    price: 6499,
    copy: "Wall unit matched to the pack. 80% in 55 minutes.",
  },
] as const;

export const pinShortcuts = [
  { pin: "560001", city: "Bengaluru" },
  { pin: "400001", city: "Mumbai" },
  { pin: "110001", city: "New Delhi" },
  { pin: "600001", city: "Chennai" },
] as const;

const cityBook = [
  { prefix: "560", city: "Bengaluru", days: 7 },
  { prefix: "400", city: "Mumbai", days: 10 },
  { prefix: "110", city: "New Delhi", days: 12 },
  { prefix: "600", city: "Chennai", days: 14 },
  { prefix: "500", city: "Hyderabad", days: 11 },
  { prefix: "411", city: "Pune", days: 9 },
  { prefix: "700", city: "Kolkata", days: 16 },
  { prefix: "380", city: "Ahmedabad", days: 13 },
  { prefix: "122", city: "Gurugram", days: 8 },
  { prefix: "201", city: "Noida", days: 8 },
  { prefix: "302", city: "Jaipur", days: 15 },
  { prefix: "682", city: "Kochi", days: 18 },
  { prefix: "160", city: "Chandigarh", days: 14 },
  { prefix: "452", city: "Indore", days: 15 },
] as const;

export function estimateDelivery(pin: string) {
  if (!/^[1-9]\d{5}$/.test(pin)) return null;
  const hit = cityBook.find((city) => pin.startsWith(city.prefix));
  if (hit) return { city: hit.city, days: hit.days };
  const seed = pin.split("").reduce((sum, digit) => sum + Number(digit), 0);
  return { city: "Your city", days: 12 + (seed % 9) };
}
