export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  title: string;
  country: string;
}

export interface ExhibitionItem {
  id: string;
  name: string;
  country: string;
  media: MediaItem[];
}

export interface PortfolioData {
  bannerImage: string;
  profileImage: string;
  aboutMe: {
    name: string;
    jobTitle: string;
    company: string;
    yearsOfExperience: string;
    phoneNumbers: string[];
    emails: string[];
    facebookLink: string;
    websiteLink: string;
  };
  gallery: MediaItem[];
  studio: MediaItem[];
  exhibitions: ExhibitionItem[];
}

export const defaultPortfolioData: PortfolioData = {
  bannerImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2000",
  profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400",
  aboutMe: {
    name: "أمير لمعي محمود",
    jobTitle: "مدير التنسيق والاتش آر",
    company: "سوفت روز إنترناشيونال",
    yearsOfExperience: "10 سنوات",
    phoneNumbers: ["+20 123 456 7890"],
    emails: ["amir@example.com"],
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
  exhibitions: []
};
