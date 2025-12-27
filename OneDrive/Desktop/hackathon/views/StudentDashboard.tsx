import React from "react";
import {
  UserProfile,
  Event,
  Registration,
} from "../types";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import {
  Award,
  Clock,
  Star,
  ShieldCheck,
  MapPin,
  Rocket,
  History,
} from "lucide-react";

interface StudentDashboardProps {
  user: UserProfile;
  events: Event[];
  registrations: Registration[];
  onCheckIn: (regId: string) => void;
  savedEvents: Event[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  events,
  registrations,
}) => {
  const userRegistrations = registrations.filter(
    (r) => r.userId === user.id
  );

  const registeredEvents = events.filter((e) =>
    userRegistrations.some((r) => r.eventId === e.id)
  );

  const volunteerHours = userRegistrations.length * 4;
  const totalPoints = user.points ?? 0;

  const getBadge = () => {
    if (totalPoints >= 150)
      return { name: "Gold Volunteer", color: "from-amber-400 to-yellow-600", icon: "🏆" };
    if (totalPoints >= 50)
      return { name: "Silver Citizen", color: "from-slate-300 to-slate-500", icon: "🥈" };
    return { name: "Bronze Explorer", color: "from-orange-400 to-orange-700", icon: "🥉" };
  };

  const badge = getBadge();

  const data = [
    { name: "Tech", value: 1 },
    { name: "Volunteer", value: 1 },
    { name: "Cultural", value: 1 },
  ];

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b"];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Campus Buzz Impact
          </h1>
          <p className="text-slate-500">
            Your engagement metrics and event passes.
          </p>
        </div>

        <div className={`px-6 py-3 rounded-2xl bg-gradient-to-br ${badge.color} text-white shadow-xl flex items-center gap-3`}>
          <span className="text-3xl">{badge.icon}</span>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest opacity-80">
              KLH Rank
            </div>
            <div className="text-lg font-black leading-tight">
              {badge.name}
            </div>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Clock />} value={`${volunteerHours}h`} label="Service Hours" />
        <StatCard icon={<Award />} value={userRegistrations.length} label="Passes Active" />
        <StatCard icon={<Star />} value={totalPoints} label="Impact Score" />
        <StatCard
          icon={<ShieldCheck />}
          value={`Lvl ${Math.floor(totalPoints / 25) + 1}`}
          label="Engage Level"
        />
      </div>

      {/* MY EVENT PASSES */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
          <History className="text-indigo-600" size={22} />
          My Event Passes
        </h3>

        {registeredEvents.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            No registrations yet.
          </div>
        )}

        <div className="space-y-6">
          {registeredEvents.map((event) => {
            const reg = userRegistrations.find(
              (r) => r.eventId === event.id
            )!;

            return (
              <div
                key={event.id}
                className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* QR CODE */}
                  <div className="w-28 h-28 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        `ATTENDANCE_${reg.id}_${event.id}`
                      )}`}
                      alt="Attendance QR"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* EVENT INFO */}
                  <div className="flex-1">
                    <div className="font-bold text-lg text-slate-900">
                      {event.title}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <MapPin size={14} />
                      {event.location}
                    </div>
                    <div className="mt-3 text-xs font-semibold text-indigo-600">
                      Show this QR at entry for attendance
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVITY MIX */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-black text-slate-900 mb-6">
          Activity Mix
        </h3>
        <div className="h-[240px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={8}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PROMO */}
      <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
        <div className="flex items-center gap-2 mb-4 text-amber-400">
          <Rocket size={18} />
          <h3 className="font-bold text-sm uppercase tracking-widest">
            CampusBuzz Plus
          </h3>
        </div>
        <p className="text-slate-400 text-sm">
          Group registrations and offline passes coming soon.
        </p>
      </div>
    </div>
  );
};

/* SMALL CARD */
const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: any;
  label: string;
}) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
    <div className="text-indigo-600">{icon}</div>
    <div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {label}
      </div>
    </div>
  </div>
);

export default StudentDashboard;
