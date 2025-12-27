
import { Event, EventCategory, UserRole, UserProfile, Club, FoodOrder, Activity, Venue, FoodType } from './types';

// Broad list of Clubs by Categories
export const INITIAL_CLUBS: Club[] = [
  // Technical Clubs
  { id: 'c-tech-1', name: 'Coding Club', description: 'Mastering algorithms and competitive programming.', organizerId: 'org1', membersCount: 250, logoUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=200', category: 'Technical' },
  { id: 'c-tech-2', name: 'Web Development Club', description: 'Building the modern web, one pixel at a time.', organizerId: 'org1', membersCount: 180, logoUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200', category: 'Technical' },
  { id: 'c-tech-3', name: 'AI & Machine Learning Club', description: 'Exploring the frontiers of artificial intelligence.', organizerId: 'org1', membersCount: 210, logoUrl: 'https://images.unsplash.com/photo-1555255707-c0796c886116?w=200', category: 'Technical' },
  { id: 'c-tech-4', name: 'Robotics Club', description: 'Designing and building the hardware of tomorrow.', organizerId: 'org1', membersCount: 120, logoUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200', category: 'Technical' },
  { id: 'c-tech-5', name: 'Blockchain Club', description: 'Decentralizing the world with DLT.', organizerId: 'org1', membersCount: 95, logoUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200', category: 'Technical' },

  // Cultural Clubs
  { id: 'c-cult-1', name: 'Dance Club', description: 'Expressing rhythm and emotion through movement.', organizerId: 'org1', membersCount: 140, logoUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200', category: 'Cultural' },
  { id: 'c-cult-2', name: 'Music Club', description: 'The rhythmic heart of KLH campus.', organizerId: 'org1', membersCount: 165, logoUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200', category: 'Cultural' },
  { id: 'c-cult-3', name: 'Photography Club', description: 'Capturing moments and campus memories.', organizerId: 'org1', membersCount: 110, logoUrl: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d84a?w=200', category: 'Cultural' },
  { id: 'c-cult-4', name: 'Drama / Theatre Club', description: 'Staging stories that provoke and entertain.', organizerId: 'org1', membersCount: 75, logoUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=200', category: 'Cultural' },

  // Volunteer & Social Clubs
  { id: 'c-vol-1', name: 'NSS Club', description: 'Not Me But You. National Service Scheme.', organizerId: 'org1', membersCount: 300, logoUrl: 'https://images.unsplash.com/photo-1559027615-cd2673bf752f?w=200', category: 'Volunteer' },
  { id: 'c-vol-2', name: 'Environmental Club', description: 'Pioneering a green and sustainable campus.', organizerId: 'org1', membersCount: 130, logoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200', category: 'Volunteer' },
  { id: 'c-vol-3', name: 'Blood Donation Club', description: 'Saving lives through community service.', organizerId: 'org1', membersCount: 190, logoUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=200', category: 'Volunteer' },

  // Sports & Fitness Clubs
  { id: 'c-sport-1', name: 'Cricket Club', description: 'The gentlemen\'s game on campus.', organizerId: 'org1', membersCount: 150, logoUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=200', category: 'Sports' },
  { id: 'c-sport-2', name: 'Football Club', description: 'High-octane football matches and training.', organizerId: 'org1', membersCount: 140, logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200', category: 'Sports' },
  { id: 'c-sport-3', name: 'Yoga & Meditation Club', description: 'Finding inner peace amidst campus life.', organizerId: 'org1', membersCount: 115, logoUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200', category: 'Sports' },
];

// Rich set of Events
export const INITIAL_EVENTS: Event[] = [
  {
    id: 'e-1',
    organizerId: 'org1',
    title: 'KLH Mega Hackathon',
    description: 'A 48-hour challenge to solve real-world industry problems.',
    category: EventCategory.TECH,
    date: '2024-11-15',
    time: '10:00 AM',
    location: 'Tech Hub Main Arena',
    lat: 17.4447,
    lng: 78.3788,
    price: 0,
    isPaid: false,
    capacity: 200,
    registeredCount: 85,
    posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    foodOption: true,
    foodType: FoodType.LUNCH,
    status: 'Open',
  },
  {
    id: 'e-2',
    organizerId: 'org1',
    title: 'Vibrance Cultural Fest',
    description: 'The biggest cultural night of the year with music, dance, and fashion shows.',
    category: EventCategory.CULTURAL,
    date: '2024-12-05',
    time: '06:00 PM',
    location: 'Open Air Theatre (OAT)',
    lat: 17.4452,
    lng: 78.3780,
    price: 150,
    isPaid: true,
    capacity: 1000,
    registeredCount: 450,
    posterUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    foodOption: true,
    foodType: FoodType.DINNER,
    foodCost: 100,
    status: 'Open',
  },
  {
    id: 'e-3',
    organizerId: 'org1',
    title: 'NSS Blood Donation Camp',
    description: 'Donate blood, save a life. Join the NSS initiative.',
    category: EventCategory.VOLUNTEER,
    date: '2024-11-20',
    time: '09:00 AM',
    location: 'Campus Medical Wing',
    lat: 17.4440,
    lng: 78.3795,
    price: 0,
    isPaid: false,
    capacity: 300,
    registeredCount: 110,
    posterUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800',
    foodOption: true,
    foodType: FoodType.SNACKS,
    status: 'Open',
  },
  {
    id: 'e-4',
    organizerId: 'org1',
    title: 'Inter-College Football Meet',
    description: 'Watch the KLH Lions take on competing universities in the finals.',
    category: EventCategory.COMMUNITY,
    date: '2024-11-28',
    time: '04:00 PM',
    location: 'Main Sports Field',
    lat: 17.4435,
    lng: 78.3770,
    price: 0,
    isPaid: false,
    capacity: 500,
    registeredCount: 200,
    posterUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    foodOption: false,
    status: 'Open',
  },
  {
    id: 'e-5',
    organizerId: 'org1',
    title: 'AI Bootcamp & Workshop',
    description: 'Hands-on learning session on Large Language Models and Generative AI.',
    category: EventCategory.TECH,
    date: '2024-11-18',
    time: '11:00 AM',
    location: 'Block C - Computer Lab 4',
    lat: 17.4447,
    lng: 78.3788,
    price: 200,
    isPaid: true,
    capacity: 50,
    registeredCount: 48,
    posterUrl: 'https://images.unsplash.com/photo-1555255707-c0796c886116?w=800',
    foodOption: true,
    foodType: FoodType.SNACKS,
    foodCost: 50,
    status: 'Open',
  }
];

export const INITIAL_VENUES: Venue[] = [
  { id: 'v1', name: 'Main Auditorium', city: 'Hyderabad', address: 'KL University, Block C, 2nd Floor', lat: 17.4447, lng: 78.3788 },
  { id: 'v2', name: 'Open Air Theatre', city: 'Hyderabad', address: 'KL University, Central Plaza', lat: 17.4452, lng: 78.3780 },
  { id: 'v3', name: 'Sports Arena', city: 'Hyderabad', address: 'KL University, Ground Complex', lat: 17.4435, lng: 78.3770 },
  { id: 'v4', name: 'Tech Hub', city: 'Hyderabad', address: 'KL University, Block A, Ground Floor', lat: 17.4450, lng: 78.3790 }
];

export const MOCK_FOOD_ORDERS: FoodOrder[] = [
  { id: 'fo1', eventId: 'e-1', eventName: 'KLH Mega Hackathon', items: ['Pizza Slice', 'Coke'], status: 'Delivered', time: 'Yesterday' }
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: 'a1', type: 'registration', title: 'Welcome to CampusBuzz', description: 'Joined the exclusive campus portal.', time: 'Just now' }
];

export const MOCK_STUDENT: UserProfile = {
  id: 'stu-1',
  name: 'KLH Student',
  email: '2420030001@klh.edu.in',
  role: UserRole.STUDENT,
  college: 'KL University Hyderabad',
  branch: 'CSE',
  year: '2nd Year',
  skills: ['Python', 'Problem Solving'],
  interests: ['Technology', 'Music'],
  isVerified: true,
  savedEventIds: [],
  joinedClubIds: ['c-tech-1'],
  points: 50
};

export const MOCK_ORGANIZER: UserProfile = {
  id: 'org1',
  name: 'CampusBuzz Admin',
  email: '2420030182@klh.edu.in',
  role: UserRole.ORGANIZER,
  organizationName: 'CampusBuzz Management',
  skills: [],
  interests: [],
  isVerified: true,
  savedEventIds: [],
  joinedClubIds: [],
  points: 0
};
