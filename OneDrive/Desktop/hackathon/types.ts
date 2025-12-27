
export enum UserRole {
  STUDENT = 'STUDENT',
  ORGANIZER = 'ORGANIZER'
}

export enum EventCategory {
  TECH = 'Tech',
  CULTURAL = 'Cultural',
  VOLUNTEER = 'Volunteer',
  COMMUNITY = 'Community'
}

export enum VolunteerRole {
  ORGANIZER = 'Organizer',
  HELPER = 'Helper',
  COORDINATOR = 'Coordinator',
  NONE = 'None'
}

export enum FoodType {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  SNACKS = 'Snacks',
  DINNER = 'Dinner'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  college?: string;
  branch?: string;
  year?: string;
  skills: string[];
  interests: string[];
  organizationName?: string;
  isVerified?: boolean;
  savedEventIds: string[];
  joinedClubIds: string[];
  points: number;
}

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  lat: number;
  lng: number;
  price: number;
  isPaid: boolean;
  capacity: number;
  registeredCount: number;
  posterUrl: string;
  foodOption: boolean;
  foodType?: FoodType;
  foodCost?: number;
  status: 'Open' | 'Full' | 'Closed';
}

export interface Club {
  id: string;
  name: string;
  description: string;
  organizerId: string;
  membersCount: number;
  logoUrl: string;
  category: string;
}

export interface ClubJoinRequest {
  id: string;
  clubId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  role: VolunteerRole;
  paymentStatus: 'Pending' | 'Completed';
  foodSelected: boolean;
  registeredAt: string;
  checkedIn: boolean;
  checkInTime?: string;
}

export interface FoodOrder {
  id: string;
  eventId: string;
  eventName: string;
  items: string[];
  status: 'Preparing' | 'Ready' | 'Delivered';
  time: string;
}

export interface Activity {
  id: string;
  type: 'registration' | 'checkin' | 'point' | 'badge' | 'club_join';
  title: string;
  description: string;
  time: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'info' | 'success';
  read: boolean;
}

/**
 * Added Venue interface for the map and venues view
 */
export interface Venue {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
}
