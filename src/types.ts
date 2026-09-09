export type BannerEffect = 'Intro' | 'Love it' | 'Parallax' | 'Fade' | 'Slide';

export interface BannerImage {
  id: string;
  url: string;
  fullUrl?: string;
  effect: BannerEffect;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  fullUrl?: string;
  thumbnailUrl: string;
  title: string;
  subtitle?: string;
  country: string;
  metadata?: string;
}

export interface ExhibitionItem {
  id: string;
  name: string;
  country: string;
  media: MediaItem[];
}

export interface Job {
  title: string;
  duration?: string;
}

export interface PortfolioData {
  bannerImage: string; // Legacy support
  bannerImages?: (string | BannerImage)[];
  bannerInterval?: number; // Supported legacy string[] and new BannerImage[]
  profileImage: string;
  profileImageFull?: string;
  aboutMe: {
    name: string;
    jobTitle: string; // Legacy support
    jobs?: Job[]; // New multiple jobs
    company: string;
    yearsOfExperience: string;
    phoneNumbers: string[];
    whatsappNumber?: string; // New WhatsApp
    emails: string[];
    facebookLink: string;
    websiteLink: string;
    linkedInLink?: string; // New
    mapLink?: string; // New
  };
  gallery: MediaItem[];
  studio: MediaItem[];
  exhibitions: ExhibitionItem[];
  visitorCount?: number;
  baseVisitorCount?: number;
  mediaViewCount?: number;
}

export const defaultPortfolioData: PortfolioData = {
  bannerImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2000",
  bannerImages: [
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000"
  ],
  profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400",
  aboutMe: {
    name: "خالد عاطف",
    jobTitle: "مصمم جرافيك", // Legacy support
    jobs: [
      { title: "مصمم جرافيك", duration: "10 سنوات" },
      { title: "مدير فني", duration: "5 سنوات" }
    ],
    company: "مستقل",
    yearsOfExperience: "10 سنوات",
    phoneNumbers: ["+20 123 456 7890"],
    whatsappNumber: "201234567890",
    emails: ["khaled@example.com"],
    facebookLink: "https://facebook.com",
    websiteLink: "https://example.com"
  },
  gallery: [
    {
      id: "1",
      type: "image",
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
      thumbnailUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400",
      title: "مبنى إداري",
      country: "مصر"
    },
    {
      id: "2",
      type: "image",
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
      thumbnailUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400",
      title: "تصميم داخلي",
      country: "السعودية"
    },
    {
      id: "3",
      type: "video",
      url: "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400",
      title: "جولة ميدانية",
      country: "الإمارات"
    },
    {
      id: "4",
      type: "image",
      url: "https://images.unsplash.com/photo-1431578500526-0d4512857154?auto=format&fit=crop&q=80&w=1200",
      thumbnailUrl: "https://images.unsplash.com/photo-1431578500526-0d4512857154?auto=format&fit=crop&q=80&w=400",
      title: "تنسيق فريق",
      country: "مصر"
    },
    {
      id: "5",
      type: "image",
      url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200",
      thumbnailUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400",
      title: "اجتماع عمل",
      country: "السعودية"
    }
  ],
  studio: [],
  exhibitions: [],
  visitorCount: 0,
  baseVisitorCount: 0,
  mediaViewCount: 0
};
