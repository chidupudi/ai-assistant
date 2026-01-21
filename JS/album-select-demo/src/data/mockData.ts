export interface Photo {
  id: string;
  filename: string;
  url: string;
  selected: boolean;
  flagged: boolean;
}

export interface Folder {
  id: string;
  name: string;
  photos: Photo[];
}

export interface Project {
  id: string;
  name: string;
  pin: string;
  clientName: string;
  weddingDate: string;
  folders: Folder[];
  createdAt: string;
}

// Organize images by ceremony type
const sangeethImages = [
  '/sangeeth.png',
  '/image.png',
  '/image copy.png',
  '/image copy 2.png',
  '/image copy 3.png',
];

const muhurthamImages = [
  '/muhurtham.png',
  '/image copy 4.png',
  '/image copy 5.png',
  '/image copy 6.png',
];

const receptionImages = [
  '/reception.png',
  '/image copy 7.png',
  '/image copy 8.png',
  '/image copy 9.png',
];

const haldiImages = [
  '/haldi.png',
  '/image copy 10.png',
  '/image copy 11.png',
];

const mehendiImages = [
  '/mehendi.png',
  '/image copy 12.png',
  '/image copy 13.png',
];

const brideGroomImages = [
  '/bride.png',
  '/image copy 14.png',
];

// Helper function to get image for specific folder
const getImageForFolder = (folderName: string, index: number): string => {
  const lowerName = folderName.toLowerCase();

  if (lowerName.includes('sangeeth')) {
    return sangeethImages[index % sangeethImages.length];
  } else if (lowerName.includes('muhurtham') || lowerName.includes('saptapadi')) {
    return muhurthamImages[index % muhurthamImages.length];
  } else if (lowerName.includes('reception')) {
    return receptionImages[index % receptionImages.length];
  } else if (lowerName.includes('haldi')) {
    return haldiImages[index % haldiImages.length];
  } else if (lowerName.includes('mehendi') || lowerName.includes('mehndi')) {
    return mehendiImages[index % mehendiImages.length];
  } else if (lowerName.includes('engagement') || lowerName.includes('pelli') || lowerName.includes('kashi')) {
    return brideGroomImages[index % brideGroomImages.length];
  }

  // Default fallback
  return sangeethImages[index % sangeethImages.length];
};

// Generate image URLs - now uses folder-specific images
const generatePhotoUrl = (seed: number, folderName: string = 'sangeeth') => {
  return getImageForFolder(folderName, seed);
};

const generateLandscapeUrl = (seed: number, folderName: string = 'sangeeth') => {
  return getImageForFolder(folderName, seed);
};

export const mockProjects: Project[] = [
  {
    id: "proj-001",
    name: "Lakshmi & Arjun Wedding",
    pin: "284719",
    clientName: "Lakshmi Iyer",
    weddingDate: "2024-03-15",
    createdAt: "2024-02-01",
    folders: [
      {
        id: "folder-001",
        name: "Sangeeth",
        photos: [
          { id: "p1", filename: "IMG_1001.jpg", url: generatePhotoUrl(0, "Sangeeth"), selected: false, flagged: false },
          { id: "p2", filename: "IMG_1002.jpg", url: generateLandscapeUrl(1, "Sangeeth"), selected: true, flagged: false },
          { id: "p3", filename: "IMG_1003.jpg", url: generatePhotoUrl(2, "Sangeeth"), selected: false, flagged: true },
          { id: "p4", filename: "IMG_1004.jpg", url: generateLandscapeUrl(3, "Sangeeth"), selected: true, flagged: false },
          { id: "p5", filename: "IMG_1005.jpg", url: generatePhotoUrl(4, "Sangeeth"), selected: false, flagged: false },
          { id: "p6", filename: "IMG_1006.jpg", url: generateLandscapeUrl(0, "Sangeeth"), selected: false, flagged: false },
          { id: "p7", filename: "IMG_1007.jpg", url: generatePhotoUrl(1, "Sangeeth"), selected: true, flagged: false },
          { id: "p8", filename: "IMG_1008.jpg", url: generatePhotoUrl(2, "Sangeeth"), selected: false, flagged: true },
        ],
      },
      {
        id: "folder-002",
        name: "Muhurtham",
        photos: [
          { id: "p9", filename: "IMG_2001.jpg", url: generatePhotoUrl(0, "Muhurtham"), selected: true, flagged: false },
          { id: "p10", filename: "IMG_2002.jpg", url: generateLandscapeUrl(1, "Muhurtham"), selected: false, flagged: false },
          { id: "p11", filename: "IMG_2003.jpg", url: generatePhotoUrl(2, "Muhurtham"), selected: true, flagged: false },
          { id: "p12", filename: "IMG_2004.jpg", url: generateLandscapeUrl(3, "Muhurtham"), selected: false, flagged: false },
          { id: "p13", filename: "IMG_2005.jpg", url: generatePhotoUrl(0, "Muhurtham"), selected: false, flagged: true },
          { id: "p14", filename: "IMG_2006.jpg", url: generatePhotoUrl(1, "Muhurtham"), selected: true, flagged: false },
          { id: "p15", filename: "IMG_2007.jpg", url: generateLandscapeUrl(2, "Muhurtham"), selected: false, flagged: false },
          { id: "p16", filename: "IMG_2008.jpg", url: generatePhotoUrl(3, "Muhurtham"), selected: true, flagged: false },
          { id: "p17", filename: "IMG_2009.jpg", url: generateLandscapeUrl(0, "Muhurtham"), selected: false, flagged: false },
          { id: "p18", filename: "IMG_2010.jpg", url: generatePhotoUrl(1, "Muhurtham"), selected: false, flagged: false },
        ],
      },
      {
        id: "folder-003",
        name: "Reception",
        photos: [
          { id: "p19", filename: "IMG_3001.jpg", url: generatePhotoUrl(0, "Reception"), selected: false, flagged: false },
          { id: "p20", filename: "IMG_3002.jpg", url: generateLandscapeUrl(1, "Reception"), selected: true, flagged: false },
          { id: "p21", filename: "IMG_3003.jpg", url: generatePhotoUrl(2, "Reception"), selected: false, flagged: false },
          { id: "p22", filename: "IMG_3004.jpg", url: generateLandscapeUrl(3, "Reception"), selected: true, flagged: false },
          { id: "p23", filename: "IMG_3005.jpg", url: generatePhotoUrl(0, "Reception"), selected: false, flagged: true },
          { id: "p24", filename: "IMG_3006.jpg", url: generatePhotoUrl(1, "Reception"), selected: false, flagged: false },
        ],
      },
    ],
  },
  {
    id: "proj-002",
    name: "Priya & Karthik Kalyanam",
    pin: "947382",
    clientName: "Priya Menon",
    weddingDate: "2024-04-22",
    createdAt: "2024-03-10",
    folders: [
      {
        id: "folder-004",
        name: "Engagement",
        photos: [
          { id: "p25", filename: "IMG_4001.jpg", url: generatePhotoUrl(0, "Engagement"), selected: false, flagged: false },
          { id: "p26", filename: "IMG_4002.jpg", url: generateLandscapeUrl(1, "Engagement"), selected: false, flagged: false },
          { id: "p27", filename: "IMG_4003.jpg", url: generatePhotoUrl(0, "Engagement"), selected: true, flagged: false },
          { id: "p28", filename: "IMG_4004.jpg", url: generatePhotoUrl(1, "Engagement"), selected: false, flagged: false },
        ],
      },
      {
        id: "folder-005",
        name: "Haldi Ceremony",
        photos: [
          { id: "p29", filename: "IMG_5001.jpg", url: generatePhotoUrl(0, "Haldi"), selected: true, flagged: false },
          { id: "p30", filename: "IMG_5002.jpg", url: generateLandscapeUrl(1, "Haldi"), selected: false, flagged: true },
          { id: "p31", filename: "IMG_5003.jpg", url: generatePhotoUrl(2, "Haldi"), selected: false, flagged: false },
          { id: "p32", filename: "IMG_5004.jpg", url: generateLandscapeUrl(0, "Haldi"), selected: true, flagged: false },
          { id: "p33", filename: "IMG_5005.jpg", url: generatePhotoUrl(1, "Haldi"), selected: false, flagged: false },
        ],
      },
      {
        id: "folder-006",
        name: "Mehendi",
        photos: [
          { id: "p34", filename: "IMG_6001.jpg", url: generatePhotoUrl(0, "Mehendi"), selected: false, flagged: false },
          { id: "p35", filename: "IMG_6002.jpg", url: generateLandscapeUrl(1, "Mehendi"), selected: true, flagged: false },
          { id: "p36", filename: "IMG_6003.jpg", url: generatePhotoUrl(2, "Mehendi"), selected: false, flagged: false },
        ],
      },
    ],
  },
  {
    id: "proj-003",
    name: "Divya & Rajesh Thirumanam",
    pin: "583921",
    clientName: "Divya Krishnan",
    weddingDate: "2024-05-18",
    createdAt: "2024-04-05",
    folders: [
      {
        id: "folder-007",
        name: "Pelli Kuthuru",
        photos: [
          { id: "p37", filename: "IMG_7001.jpg", url: generatePhotoUrl(0, "Pelli Kuthuru"), selected: false, flagged: false },
          { id: "p38", filename: "IMG_7002.jpg", url: generateLandscapeUrl(1, "Pelli Kuthuru"), selected: false, flagged: false },
          { id: "p39", filename: "IMG_7003.jpg", url: generatePhotoUrl(0, "Pelli Kuthuru"), selected: false, flagged: false },
        ],
      },
      {
        id: "folder-008",
        name: "Sangeeth Night",
        photos: [
          { id: "p40", filename: "IMG_8001.jpg", url: generatePhotoUrl(0, "Sangeeth Night"), selected: false, flagged: false },
          { id: "p41", filename: "IMG_8002.jpg", url: generateLandscapeUrl(1, "Sangeeth Night"), selected: false, flagged: false },
        ],
      },
      {
        id: "folder-009",
        name: "Kashi Yatra",
        photos: [
          { id: "p42", filename: "IMG_9001.jpg", url: generatePhotoUrl(0, "Kashi Yatra"), selected: false, flagged: false },
          { id: "p43", filename: "IMG_9002.jpg", url: generateLandscapeUrl(1, "Kashi Yatra"), selected: false, flagged: false },
          { id: "p44", filename: "IMG_9003.jpg", url: generatePhotoUrl(0, "Kashi Yatra"), selected: false, flagged: false },
          { id: "p45", filename: "IMG_9004.jpg", url: generatePhotoUrl(1, "Kashi Yatra"), selected: false, flagged: false },
        ],
      },
      {
        id: "folder-010",
        name: "Saptapadi",
        photos: [
          { id: "p46", filename: "IMG_0001.jpg", url: generatePhotoUrl(0, "Saptapadi"), selected: false, flagged: false },
          { id: "p47", filename: "IMG_0002.jpg", url: generateLandscapeUrl(1, "Saptapadi"), selected: false, flagged: false },
          { id: "p48", filename: "IMG_0003.jpg", url: generatePhotoUrl(2, "Saptapadi"), selected: false, flagged: false },
        ],
      },
    ],
  },
];
