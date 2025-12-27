
import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, Event, Registration, VolunteerRole, Notification, Club, ClubJoinRequest } from './types';
import { INITIAL_EVENTS, MOCK_STUDENT, MOCK_ORGANIZER, MOCK_FOOD_ORDERS, MOCK_ACTIVITIES, INITIAL_CLUBS } from './constants';
import Navigation from './components/Navigation';
import Explorer from './views/Explorer';
import StudentDashboard from './views/StudentDashboard';
import OrganizerDashboard from './views/OrganizerDashboard';
import CreateEventView from './views/CreateEventView';
import RegistrationModal from './views/RegistrationModal';
import VenuesView from './views/VenuesView';
import EventDetailsView from './views/EventDetailsView';
import ProfileView from './views/ProfileView';
import ClubsView from './views/ClubsView';
import EditProfileView from './views/EditProfileView';
import { Loader2, Calendar, ShieldAlert } from 'lucide-react';
import { calculateDistance } from './utils/geoUtils';
import { ref, set } from "firebase/database";
import { db } from "./firebase";


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState('landing');
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [clubRequests, setClubRequests] = useState<ClubJoinRequest[]>([]);
  const [selectedEventToRegister, setSelectedEventToRegister] = useState<Event | null>(null);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const detectLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.warn("Location access denied:", error.message);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    };
    detectLocation();
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginAttempt = (role: UserRole) => {
    setLoginError('');
    const email = loginEmail.toLowerCase().trim();
    
    if (!email.endsWith('@klh.edu.in')) {
      setLoginError('Only @klh.edu.in emails are permitted.');
      return;
    }

    if (role === UserRole.ORGANIZER && email !== '2420030182@klh.edu.in') {
      setLoginError('This account is not authorized for organizer access.');
      return;
    }

    const mockUser = role === UserRole.STUDENT 
      ? { ...MOCK_STUDENT, email: email, name: email.split('@')[0] } 
      : { ...MOCK_ORGANIZER, email: email };
    
    setCurrentUser(mockUser);
    setActiveView('explore');
    setNotifications([{ id: '1', title: 'Welcome to CampusBuzz!', message: 'Explore KLH campus events and activities.', time: 'Just now', type: 'info', read: false }]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail('');
    setLoginError('');
    setActiveView('landing');
    setNotifications([]);
  };

  const handleCreateEvent = (newEvent: Event) => {
    setEvents(prev => [newEvent, ...prev]);
    setActiveView('explore');
    
    // Automatic broad notification simulate adding to all users
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Global Broadcast',
      message: `A new event "${newEvent.title}" has been automatically added to the campus feed for all @klh.edu.in users.`,
      time: 'Just now',
      type: 'success',
      read: false
    }, ...prev]);
  };

  const handleCreateClub = (newClub: Club) => {
    setClubs(prev => [newClub, ...prev]);
    setActiveView('clubs');
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'New Community Added',
      message: `"${newClub.name}" is now live and automatically available for all KLH users to join.`,
      time: 'Just now',
      type: 'success',
      read: false
    }, ...prev]);
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    setActiveView('profile');
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Profile Updated',
      message: 'Your CampusBuzz profile has been successfully updated.',
      time: 'Just now',
      type: 'success',
      read: false
    }, ...prev]);
  };

  const handleViewDetails = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEventForDetails(event);
      setActiveView('event-details');
    }
  };

  const handleRegister = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEventToRegister(event);
    }
  };

  const handleJoinClub = (clubId: string) => {
    if (!currentUser) return;
    const newRequest: ClubJoinRequest = {
      id: Math.random().toString(36).substr(2, 9),
      clubId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      status: 'Pending',
      requestedAt: new Date().toISOString()
    };
    setClubRequests(prev => [...prev, newRequest]);
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Club Join Request',
      message: `Request to join ${clubs.find(c => c.id === clubId)?.name} is now pending.`,
      time: 'Just now',
      type: 'info',
      read: false
    }, ...prev]);
  };

  const handleApproveClubRequest = (requestId: string) => {
    const request = clubRequests.find(r => r.id === requestId);
    if (!request) return;

    setClubRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r));
    
    if (currentUser?.id === request.userId) {
      setCurrentUser(prev => prev ? { 
        ...prev, 
        joinedClubIds: prev.joinedClubIds.includes(request.clubId) ? prev.joinedClubIds : [...prev.joinedClubIds, request.clubId] 
      } : null);
    }

    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Club Request Approved',
      message: `Membership status updated automatically for the student.`,
      time: 'Just now',
      type: 'success',
      read: false
    }, ...prev]);
  };

  const confirmRegistration = (role: VolunteerRole, foodSelected: boolean) => {
    if (!currentUser || !selectedEventToRegister) return;
    const newReg: Registration = {
      id: Math.random().toString(36).substr(2, 9),
      eventId: selectedEventToRegister.id,
      userId: currentUser.id,
      userName: currentUser.name,
      role,
      paymentStatus: 'Completed',
      foodSelected,
      registeredAt: new Date().toISOString(),
      checkedIn: false
    };
    setRegistrations(prev => [...prev, newReg]);
    setEvents(prev => prev.map(e => e.id === selectedEventToRegister.id ? { ...e, registeredCount: e.registeredCount + 1 } : e));
    setSelectedEventToRegister(null);
    setActiveView('dashboard');
  };

  if (loading) {
    return (
      <div className={`h-screen w-screen flex flex-col items-center justify-center ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <h2 className="text-xl font-black tracking-tight">CampusBuzz Initializing...</h2>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-10">
          <div className="flex flex-col items-center">
            <div className="bg-indigo-600 p-5 rounded-[2.5rem] shadow-2xl shadow-indigo-200 mb-8 rotate-3">
              <Calendar className="text-white w-12 h-12" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4 tracking-tighter">CampusBuzz</h1>
            <p className="text-slate-500 font-medium px-4">Exclusive KLH Campus Hub.</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">KLH ID Email</label>
              <input 
                type="email" 
                placeholder="242003xxxx@klh.edu.in"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              {loginError && <div className="flex items-center gap-2 text-red-500 text-xs font-bold mt-2 px-1"><ShieldAlert size={14} /> {loginError}</div>}
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => handleLoginAttempt(UserRole.STUDENT)} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95">Student Login</button>
              <button onClick={() => handleLoginAttempt(UserRole.ORGANIZER)} className="w-full py-5 bg-white border-2 border-slate-100 hover:border-indigo-600 text-indigo-600 font-black rounded-2xl transition-all active:scale-95">Admin Login</button>
            </div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest pt-2">Powered by KLH Tech Society</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50/50 text-slate-900'}`}>
      <Navigation 
        user={currentUser} 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={handleLogout}
        notifications={notifications}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {activeView === 'explore' && (
          <Explorer 
            user={currentUser} events={events} onRegister={handleRegister}
            onSave={(id) => setCurrentUser(prev => prev ? {...prev, savedEventIds: prev.savedEventIds.includes(id) ? prev.savedEventIds.filter(i => i!==id) : [...prev.savedEventIds, id]} : null)}
            onViewDetails={handleViewDetails} registeredEventIds={registrations.filter(r => r.userId === currentUser.id).map(r => r.eventId)}
            savedEventIds={currentUser.savedEventIds} initialLocation={userLocation}
          />
        )}
        {activeView === 'dashboard' && currentUser.role === UserRole.STUDENT && <StudentDashboard user={currentUser} events={events} registrations={registrations} onCheckIn={(id) => setRegistrations(prev => prev.map(r => r.id === id ? {...r, checkedIn: true} : r))} savedEvents={events.filter(e => currentUser.savedEventIds.includes(e.id))} />}
        {activeView === 'manage' && currentUser.role === UserRole.ORGANIZER && (
          <OrganizerDashboard 
            events={events} registrations={registrations} 
            clubRequests={clubRequests} onApproveClubRequest={handleApproveClubRequest}
            onToggleStatus={(id) => setEvents(prev => prev.map(e => e.id === id ? {...e, status: e.status === 'Open' ? 'Closed' : 'Open'} : e))} 
          />
        )}
        {activeView === 'profile' && <ProfileView user={currentUser} events={events} registrations={registrations.filter(r => r.userId === currentUser.id)} savedEvents={events.filter(e => currentUser.savedEventIds.includes(e.id))} foodOrders={MOCK_FOOD_ORDERS} activities={MOCK_ACTIVITIES} onEditProfile={() => setActiveView('edit-profile')} />}
        {activeView === 'edit-profile' && <EditProfileView user={currentUser} onUpdate={handleUpdateProfile} onBack={() => setActiveView('profile')} />}
        {activeView === 'clubs' && <ClubsView clubs={clubs} user={currentUser} onJoin={handleJoinClub} activeRequests={clubRequests.filter(r => r.userId === currentUser.id)} />}
        {activeView === 'create' && <CreateEventView onCreated={handleCreateEvent} onBack={() => setActiveView('manage')} />}
        {activeView === 'map' && <VenuesView onBack={() => setActiveView('explore')} />}
        {activeView === 'event-details' && selectedEventForDetails && <EventDetailsView event={selectedEventForDetails} onBack={() => setActiveView('explore')} onRegister={() => setSelectedEventToRegister(selectedEventForDetails)} isRegistered={registrations.some(r => r.eventId === selectedEventForDetails.id && r.userId === currentUser.id)} role={currentUser.role} distance={userLocation ? calculateDistance(userLocation.lat, userLocation.lng, selectedEventForDetails.lat, selectedEventForDetails.lng) : undefined} />}
      </main>

      {selectedEventToRegister && <RegistrationModal event={selectedEventToRegister} user={currentUser} onClose={() => setSelectedEventToRegister(null)} onConfirm={confirmRegistration} />}

      <footer className={`py-12 text-center border-t ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center"><Calendar size={16} className="text-indigo-600" /></div>
             <span className="font-bold">CampusBuzz</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2024 CampusBuzz • Official KLH Portal</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
