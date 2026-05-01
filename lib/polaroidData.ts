export type PolaroidType =
  | "childhood"
  | "traditional"
  | "western"
  | "formal"
  | "casual"
  | "casual-video"
  | "together"
  | "together-video"
  | "special-sorry"
  | "special-magnificent"
  | "special-luck";

export type SpecialType = "sorry" | "magnificent" | "luck" | null;

export interface PolaroidItem {
  id: number;
  src: string;
  type: PolaroidType;
  label: string;
  date: string;
  compliment: string;
  isSpecial: boolean;
  specialType: SpecialType;
  isVideo: boolean;
  borderColor: string;
  glowClass: string;
  isFaceDown: boolean;
  isTirthChildhood: boolean;
}

export const polaroidData: PolaroidItem[] = [
  // ============ CHILDHOOD PHOTOS (4) ============
  {
    id: 1,
    src: "/media/childhood/childhood_01.jpg",
    type: "childhood",
    label: "2006 🌸",
    date: "",
    compliment:
      "look at this cutie pie omg 😭 you were THAT girl even back then panda  nothing has changed fr, you've always been this 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#c9a84c",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 2,
    src: "/media/childhood/childhood_02.jpg",
    type: "childhood",
    label: "cutest ever",
    date: "",
    compliment:
      "I don't think you realise how cute you were. scratch that — how cute you STILL are. this face hasn't changed one bit, panda 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#c9a84c",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 3,
    src: "/media/childhood/childhood_03.jpg",
    type: "childhood",
    label: "always her 🤍",
    date: "",
    compliment:
      "the same spark, the same eyes, the same energy. baby you were always going to grow up and ruin someone's life (mine) 😭🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#c9a84c",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 4,
    src: "/media/childhood/childhood_04.jpg",
    type: "childhood",
    label: "forever 🌸",
    date: "",
    compliment:
      "somewhere this little girl was just vibing and had no idea what was coming. I'm so glad the universe led her to me, panda 🌸",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#c9a84c",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },

  // ============ TRADITIONAL (6) ============
  {
    id: 5,
    src: "/media/traditional/traditional_01.jpg",
    type: "traditional",
    label: "my panda 😮‍💨",
    date: "",
    compliment:
      "I am FLAT. every single time, no thoughts, just 😮‍💨 you in a saree is something else panda . I genuinely melt and I always want more. always.",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#d4788a",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 6,
    src: "/media/traditional/traditional_02.jpg",
    type: "traditional",
    label: "flat every time",
    date: "",
    compliment:
      "there's something about you in traditional that literally stops time for me. I forget to breathe. not even exaggerating, panda 😮‍💨",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#d4788a",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 7,
    src: "/media/traditional/traditional_03.jpg",
    type: "traditional",
    label: "timeless 🤍",
    date: "",
    compliment:
      "timeless. literally timeless. you could be in any era, any decade, and you'd still make everyone turn and stare. that's just you, panda 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#d4788a",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 8,
    src: "/media/traditional/traditional_04.jpg",
    type: "traditional",
    label: "I melt.",
    date: "",
    compliment:
      "the sunglasses, the pose, the whole vibe — you look like you own the city from up there. and honestly? you kind of do, to me 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#d4788a",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 9,
    src: "/media/traditional/traditional_05.jpg",
    type: "traditional",
    label: "desi queen 🤍",
    date: "",
    compliment:
      "the kurta, the haveli, the whole scene this looks like a movie poster and you're the lead. I'd watch it on repeat, panda 😭",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#d4788a",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 10,
    src: "/media/traditional/traditional_06.jpg",
    type: "traditional",
    label: "stunner 🤍",
    date: "",
    compliment:
      "every time you dress up traditional, I lose a few brain cells because all I can think is HOW is she real and HOW is she mine 😵",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#d4788a",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },

  // ============ WESTERN (3) ============
  {
    id: 11,
    src: "/media/western/western_01.jpg",
    type: "western",
    label: "🔥 literally",
    date: "",
    compliment:
      "okay this is FIRE 🔥 you are hot, you know that right? western fit and you're literally just... mine.",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#4a9eed",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 12,
    src: "/media/western/western_02.jpg",
    type: "western",
    label: "mine.",
    date: "",
    compliment:
      "the red, the confidence, the whole aura  I'm actually speechless. you walked in looking like THAT and expected me to function normally? 🔥",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#4a9eed",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 13,
    src: "/media/western/western_03.jpg",
    type: "western",
    label: "city lights ✨",
    date: "",
    compliment:
      "you and the city lights behind you but honestly? you outshine all of them. the whole skyline is just your backdrop, Misu ✨",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#4a9eed",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },

  // ============ FORMAL (1) ============
  {
    id: 14,
    src: "/media/formal/formal_01.jpg",
    type: "formal",
    label: "stop it.",
    date: "",
    compliment:
      "I am going CRAZY looking at this. WHO gave you the right?? panda you in formals is genuinely illegal. I cannot handle this. 😵 someone stop her",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#c9a84c",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },

  // ============ CASUAL (2 photos, 2 videos) ============
  {
    id: 15,
    src: "/media/casual/casual_01.jpg",
    type: "casual",
    label: "this one 😭",
    date: "",
    compliment:
      "this is my favourite you  unfiltered, natkhatti, completely yourself 😭 I never want to forget this. ever. this moment is mine to keep. 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#e8e4dc",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 16,
    src: "/media/casual/casual_02.png",
    type: "casual",
    label: "my fav you",
    date: "",
    compliment:
      "no makeup, no filter, just you being you  and that's genuinely my favourite version. the one who laughs too loud and doesn't care 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#e8e4dc",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 17,
    src: "/media/casual/casual_video_01.mov",
    type: "casual-video",
    label: "natkhat 🤍",
    date: "",
    compliment:
      "the way you move, the way you laugh in this  I could watch this on loop forever. you're chaos in the most beautiful way, panda 😭",
    isSpecial: false,
    specialType: null,
    isVideo: true,
    borderColor: "#e8e4dc",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 18,
    src: "/media/casual/casual_video_02.mov",
    type: "casual-video",
    label: "always this",
    date: "",
    compliment:
      "videos hit different because I can hear your voice in them. and your voice is genuinely my favourite sound in the world 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: true,
    borderColor: "#e8e4dc",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },

  // ============ TOGETHER (7 photos, 1 video) ============
  {
    id: 19,
    src: "/media/together/together_01.jpg",
    type: "together",
    label: "us 🤍",
    date: "",
    compliment:
      "I can't forget this moment even if I try. and honestly? I never want to. this is mine to keep, babyy. 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#e8b4bc",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 20,
    src: "/media/together/together_02.jpg",
    type: "together",
    label: "this day",
    date: "",
    compliment:
      "the fact that we exist in the same photo, in the same frame, breathing the same air , that's my whole world right there 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#e8b4bc",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 21,
    src: "/media/together/together_03.jpg",
    type: "together",
    label: "ours 🤍",
    date: "",
    compliment:
      "every photo with you feels like proof. proof that something this good actually happened to me. I still can't believe it sometimes, panda 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#e8b4bc",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 22,
    src: "/media/together/together_04.jpg",
    type: "together",
    label: "always 🤍",
    date: "",
    compliment:
      "you know what I love about this one? we look like us. just us. no pretending, no posing. just two idiots who got lucky 😭🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#e8b4bc",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 23,
    src: "/media/together/together_05.jpg",
    type: "together",
    label: "my world",
    date: "",
    compliment:
      "look at us. just look. if someone told me a year ago this would be my life, I'd laugh. but here we are, panda. and I wouldn't trade it for anything 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#e8b4bc",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 24,
    src: "/media/together/together_06.jpg",
    type: "together",
    label: "home 🤍",
    date: "",
    compliment:
      "this one hits different. late night, just us two, no one else around. you smiled and I knew this is home. you are home, panda 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#e8b4bc",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 25,
    src: "/media/together/together_07.jpg",
    type: "together",
    label: "rooftop 🤍",
    date: "",
    compliment:
      "up on that rooftop with the kites flying around us , that whole day felt like a dream. the kind I never want to wake up from 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: false,
    borderColor: "#e8b4bc",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 26,
    src: "/media/together/together_video_01.mp4",
    type: "together-video",
    label: "remember? 🤍",
    date: "",
    compliment:
      "I saved this video because I never want to forget exactly how this moment felt. us, together, unscripted. this is everything, panda 🤍",
    isSpecial: false,
    specialType: null,
    isVideo: true,
    borderColor: "#e8b4bc",
    glowClass: "",
    isFaceDown: false,
    isTirthChildhood: false,
  },

  // ============ SPECIAL POLAROIDS (3) ============
  {
    id: 27,
    src: "",
    type: "special-sorry",
    label: "read this.",
    date: "",
    compliment: "",
    isSpecial: true,
    specialType: "sorry",
    isVideo: false,
    borderColor: "#c9a84c",
    glowClass: "glow-gold",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 28,
    src: "",
    type: "special-magnificent",
    label: "all of you.",
    date: "",
    compliment: "",
    isSpecial: true,
    specialType: "magnificent",
    isVideo: false,
    borderColor: "#d4788a",
    glowClass: "glow-pink",
    isFaceDown: false,
    isTirthChildhood: false,
  },
  {
    id: 29,
    src: "",
    type: "special-luck",
    label: "",
    date: "",
    compliment: "",
    isSpecial: true,
    specialType: "luck",
    isVideo: false,
    borderColor: "#1a1a1a",
    glowClass: "glow-black",
    isFaceDown: true,
    isTirthChildhood: false,
  },
];

export const soloPhotoSources = [
  { src: "/media/childhood/childhood_01.jpg", overlayText: "even back then..." },
  { src: "/media/childhood/childhood_02.jpg", overlayText: "you had that same smile." },
  { src: "/media/traditional/traditional_01.jpg", overlayText: "then you grew up." },
  { src: "/media/traditional/traditional_02.jpg", overlayText: "and honestly?" },
  { src: "/media/traditional/traditional_05.jpg", overlayText: "you take my breath away." },
  { src: "/media/western/western_01.jpg", overlayText: "every single time." },
  { src: "/media/western/western_02.jpg", overlayText: "in every single outfit." },
  { src: "/media/formal/formal_01.jpg", overlayText: "you own every room you walk into." },
  { src: "/media/casual/casual_01.jpg", overlayText: "but my absolute favourite..." },
];
