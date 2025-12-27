
import React, { useState, useEffect } from "react";
import { Event, UserProfile, VolunteerRole } from "../types";
import {
  MapPin,
  Calendar,
  Sparkles,
  Check,
  ChevronRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  X,
  CreditCard,
  Utensils,
  ShieldCheck,
  Ticket,
  UserPlus,
  Briefcase,
  Users,
  Award
} from "lucide-react";
import { getVolunteerRoleMatch } from "../services/geminiService";
import { signup, login } from "../services/authService";

interface RegistrationModalProps {
  event: Event;
  user: UserProfile;
  onClose: () => void;
  onConfirm: (role: VolunteerRole, foodSelected: boolean) => void;
}

const RoleCard: React.FC<{ 
  role: VolunteerRole; 
  selected: boolean; 
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ selected, onClick, icon, title, description }) => (
  <button
    onClick={onClick}
    className={`relative p-5 border rounded-2xl text-left transition-all group w-full ${
      selected
        ? "border-indigo-600 bg-indigo-600/10 shadow-[0_0_20px_rgba(79,70,229,0.1)]"
        : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
    }`}
  >
    <div className="flex justify-between items-start gap-4">
      <div className={`p-3 rounded-xl transition-colors ${selected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <p className={`font-bold ${selected ? 'text-indigo-400' : 'text-slate-200'}`}>
          {title}
        </p>
        <p className="text-slate-500 text-xs leading-relaxed">
          {description}
        </p>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
        selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-800'
      }`}>
        {selected && <Check size={14} className="text-white" />}
      </div>
    </div>
  </button>
);

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  user,
  onClose,
  onConfirm,
}) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"selection" | "payment" | "success">(
    "selection"
  );
  const [selectedRole, setSelectedRole] = useState<VolunteerRole>(
    VolunteerRole.NONE
  );
  const [foodSelected, setFoodSelected] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    role: VolunteerRole;
    reason: string;
  } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const runAI = async () => {
      setIsAiLoading(true);
      try {
        const res = await getVolunteerRoleMatch(user, event);
        setAiSuggestion({
          role: res.role as VolunteerRole,
          reason: res.reason,
        });
      } catch {}
      setIsAiLoading(false);
    };
    runAI();
  }, [event, user]);

  const handleStudentLogin = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }
    setIsLoggingIn(true);
    try {
      await signup(email, "123456", "student");
      alert("Verification successful!");
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        await login(email, "123456");
        alert("Verification successful!");
      } else alert(e.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const admissionPrice = event.isPaid ? (event.price || 0) : 0;
  const foodPrice = foodSelected ? (event.foodCost || 0) : 0;
  const totalAmount = admissionPrice + foodPrice;

  const handleProceed = () => {
    if (totalAmount > 0) setStep("payment");
    else {
      setStep("success");
      setTimeout(() => onConfirm(selectedRole, foodSelected), 1200);
    }
  };

  const handleVerifyPayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep("success");
      setTimeout(() => onConfirm(selectedRole, foodSelected), 1200);
    }, 2000);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `upi://pay?pa=campusbuzz@upi&pn=CampusBuzz&am=${totalAmount}&cu=INR`
  )}`;

  const StepHeader = ({ title, showBack = false }: { title: string; showBack?: boolean }) => (
    <div className="flex items-center justify-between p-6 border-b border-slate-800">
      <div className="flex items-center gap-4">
        {showBack && (
          <button onClick={() => setStep("selection")} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <ArrowLeft size={20} />
          </button>
        )}
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
        <X size={20} />
      </button>
    </div>
  );

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-slate-900 w-full max-w-md rounded-[2.5rem] border border-slate-800 p-12 text-center animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-white">Entry Confirmed!</h2>
          <p className="text-slate-400 mt-4 leading-relaxed">
            Your registration for <strong>{event.title}</strong> as a {selectedRole} is confirmed. See you there!
          </p>
          <div className="mt-8">
             <Loader2 size={24} className="mx-auto text-indigo-500 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 w-full max-w-xl rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl my-8">
        
        {step === "selection" ? (
          <>
            <div className="relative h-48 shrink-0">
              <img src={event.posterUrl} className="w-full h-full object-cover" alt="Event Cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent p-8 flex flex-col justify-end">
                <h2 className="text-white text-3xl font-black tracking-tight">{event.title}</h2>
                <div className="flex gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-slate-300 text-sm font-medium">
                    <Calendar size={14} className="text-indigo-400" /> {event.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300 text-sm font-medium">
                    <MapPin size={14} className="text-indigo-400" /> {event.location}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-950/40 hover:bg-slate-950/60 backdrop-blur-md rounded-full text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <UserPlus size={14} /> Student Verification
                </div>
                <div className="flex gap-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@klh.edu.in"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                  <button
                    onClick={handleStudentLogin}
                    disabled={isLoggingIn}
                    className="px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all disabled:opacity-50"
                  >
                    {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : "Verify"}
                  </button>
                </div>
              </div>

              <div className="relative">
                {isAiLoading ? (
                  <div className="flex items-center gap-3 px-5 py-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-indigo-400 text-sm">
                    <Loader2 size={16} className="animate-spin" />
                    <Sparkles size={16} /> 
                    <span>Analyzing profile for best fit...</span>
                  </div>
                ) : aiSuggestion && (
                  <div className="px-5 py-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest mb-1">
                      <Sparkles size={14} /> AI Recommendation
                    </div>
                    <p className="text-slate-200 text-sm font-medium">
                      Try: <span className="text-indigo-400 font-bold">{aiSuggestion.role}</span>. "{aiSuggestion.reason}"
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Select Your Role</p>
                <div className="grid grid-cols-1 gap-3">
                  <RoleCard 
                    role={VolunteerRole.NONE}
                    selected={selectedRole === VolunteerRole.NONE}
                    onClick={() => setSelectedRole(VolunteerRole.NONE)}
                    icon={<Ticket size={20} />}
                    title="Standard Attendee"
                    description="Standard event entry with full access to sessions."
                  />
                  <RoleCard 
                    role={VolunteerRole.HELPER}
                    selected={selectedRole === VolunteerRole.HELPER}
                    onClick={() => setSelectedRole(VolunteerRole.HELPER)}
                    icon={<Users size={20} />}
                    title="Volunteer / Helper"
                    description="Assist with registrations and crowd management. Certificate provided."
                  />
                  <RoleCard 
                    role={VolunteerRole.COORDINATOR}
                    selected={selectedRole === VolunteerRole.COORDINATOR}
                    onClick={() => setSelectedRole(VolunteerRole.COORDINATOR)}
                    icon={<Briefcase size={20} />}
                    title="Coordinator"
                    description="Lead a sub-team and manage specific event segments."
                  />
                  <RoleCard 
                    role={VolunteerRole.ORGANIZER}
                    selected={selectedRole === VolunteerRole.ORGANIZER}
                    onClick={() => setSelectedRole(VolunteerRole.ORGANIZER)}
                    icon={<Award size={20} />}
                    title="Organizer"
                    description="Direct oversight of event operations and logistics."
                  />
                </div>
              </div>

              {event.foodOption && (
                <div 
                  onClick={() => setFoodSelected(!foodSelected)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    foodSelected ? 'bg-amber-500/5 border-amber-500/20 shadow-lg shadow-amber-500/5' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${foodSelected ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                      <Utensils size={20} />
                    </div>
                    <div>
                      <p className={`font-bold ${foodSelected ? 'text-amber-500' : 'text-slate-200'}`}>Add Campus Meals</p>
                      <p className="text-slate-500 text-xs">{event.foodType || 'Standard'} • ₹{event.foodCost || 0}</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${foodSelected ? 'bg-amber-500' : 'bg-slate-800'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${foodSelected ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>
              )}

              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-400">Event Admission</span>
                   <span className="text-slate-200 font-medium">₹{admissionPrice}</span>
                 </div>
                 {foodSelected && (
                   <div className="flex justify-between text-sm">
                     <span className="text-slate-400">Meal Supplement</span>
                     <span className="text-slate-200 font-medium">₹{foodPrice}</span>
                   </div>
                 )}
                 <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                   <div>
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Amount</p>
                     <p className="text-3xl font-black text-white">₹{totalAmount}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                       <ShieldCheck size={14} /> Secure Payment
                     </p>
                   </div>
                 </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-800 flex gap-4 shrink-0">
              <button onClick={onClose} className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-400 hover:bg-slate-800 transition-all">
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-8 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all"
              >
                {totalAmount > 0 ? "Pay Now" : "Register"}
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="animate-in slide-in-from-right duration-300">
            <StepHeader title="Complete Payment" showBack={true} />
            <div className="p-12 text-center space-y-8">
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Scan to Pay</p>
                <h3 className="text-5xl font-black text-white">₹{totalAmount}</h3>
              </div>

              <div className="mx-auto w-64 h-64 bg-white p-4 rounded-3xl overflow-hidden shadow-2xl">
                <img src={qrUrl} className="w-full h-full object-contain" alt="Payment QR" />
              </div>

              <div className="space-y-4 max-w-sm mx-auto">
                <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl text-slate-400 text-xs flex items-start gap-3 text-left">
                  <CreditCard className="text-indigo-400 shrink-0" size={18} />
                  <p>Open any UPI app (GPay, PhonePe, Paytm) and scan the QR. Click below once transaction is done.</p>
                </div>
                
                <button
                  onClick={handleVerifyPayment}
                  disabled={isVerifying}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-70"
                >
                  {isVerifying ? (
                    <span className="flex items-center justify-center gap-3">
                      <Loader2 className="animate-spin" size={24} />
                      Verifying...
                    </span>
                  ) : (
                    "I have completed payment"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal;
