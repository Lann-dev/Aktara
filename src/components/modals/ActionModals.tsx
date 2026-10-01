import React, { useState } from 'react';
import { PendingAction, ProgramCohort, NotificationItem } from '../../types';

// 1. New Placement Modal
export const NewPlacementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [company, setCompany] = useState('PT. Teknologi Maju');
  const [studentName, setStudentName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [mentorName, setMentorName] = useState('Budi Santoso');
  const [startDate, setStartDate] = useState('2024-07-01');
  const [endDate, setEndDate] = useState('2024-12-31');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/12 text-white">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h3 className="text-[18px] font-bold text-white">New Placement Registration</h3>
            <p className="text-[12px] text-white/60">Assign a student to an approved enterprise partner</p>
          </div>
          <button onClick={onClose} className="p-1 text-white/60 hover:text-white cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ company, studentName, department, mentorName, startDate, endDate });
            onClose();
          }}
          className="space-y-4 mt-4 text-[14px]"
        >
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Student Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Raditya Pratama"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Vocational Program
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              >
                <option value="Computer Science & Engineering" className="bg-[#131127] text-white">Computer Science & Engineering</option>
                <option value="Business Administration" className="bg-[#131127] text-white">Business Administration</option>
                <option value="Multimedia & Animation" className="bg-[#131127] text-white">Multimedia & Animation</option>
                <option value="Information Systems" className="bg-[#131127] text-white">Information Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Industry Partner
              </label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              >
                <option value="PT. Teknologi Maju" className="bg-[#131127] text-white">PT. Teknologi Maju</option>
                <option value="PT. Astra Digital" className="bg-[#131127] text-white">PT. Astra Digital</option>
                <option value="Bank Mandiri Fintech" className="bg-[#131127] text-white">Bank Mandiri Fintech</option>
                <option value="Telkom Indonesia" className="bg-[#131127] text-white">Telkom Indonesia</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Assigned Industry Mentor
            </label>
            <input
              type="text"
              value={mentorName}
              onChange={(e) => setMentorName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 hover:text-white rounded-xl font-semibold cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-violet-900/40 border border-white/10 cursor-pointer transition-all"
            >
              Register Placement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. Create Program Cohort Modal
export const CreateProgramModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (program: Partial<ProgramCohort>) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [status, setStatus] = useState<'DRAFT' | 'OPEN' | 'RUNNING'>('OPEN');
  const [capacity, setCapacity] = useState(50);
  const [duration, setDuration] = useState('July - Dec 2024');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/12 text-white">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h3 className="text-[18px] font-bold text-white">Create Internship Cohort</h3>
            <p className="text-[12px] text-white/60">Set up new academic internship batch for SMK students</p>
          </div>
          <button onClick={onClose} className="p-1 text-white/60 hover:text-white cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              id: `prog-${Date.now()}`,
              title: title || `Academic Year ${academicYear} - Batch ${Math.floor(Math.random() * 5) + 1}`,
              department,
              academicYear,
              status,
              duration,
              startDate: '2024-07-01',
              endDate: '2024-12-31',
              enrolled: 0,
              capacity: Number(capacity),
              competencyCount: 16,
            });
            onClose();
          }}
          className="space-y-4 mt-4 text-[14px]"
        >
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Program Title
            </label>
            <input
              type="text"
              placeholder="e.g. Academic Year 2024/2025 - Batch 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              >
                <option value="Computer Science & Engineering" className="bg-[#131127] text-white">Computer Science & Engineering</option>
                <option value="Business Administration" className="bg-[#131127] text-white">Business Administration</option>
                <option value="Multimedia & Animation" className="bg-[#131127] text-white">Multimedia & Animation</option>
                <option value="Information Systems" className="bg-[#131127] text-white">Information Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              >
                <option value="2024/2025" className="bg-[#131127] text-white">2024/2025</option>
                <option value="2023/2024" className="bg-[#131127] text-white">2023/2024</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              >
                <option value="OPEN" className="bg-[#131127] text-white">OPEN</option>
                <option value="RUNNING" className="bg-[#131127] text-white">RUNNING</option>
                <option value="DRAFT" className="bg-[#131127] text-white">DRAFT</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Capacity
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Duration Period
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. July - Dec 2024"
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 hover:text-white rounded-xl font-semibold cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-violet-900/40 border border-white/10 cursor-pointer transition-all"
            >
              Create Cohort
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. Mentor Review / Validation Modal
export const ReviewActionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  action: PendingAction | null;
  onApprove: (actionId: string, feedback: string) => void;
  onReject: (actionId: string, feedback: string) => void;
}> = ({ isOpen, onClose, action, onApprove, onReject }) => {
  const [feedback, setFeedback] = useState('');

  if (!isOpen || !action) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/12 text-white">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300 bg-violet-500/20 border border-violet-500/30 px-2.5 py-0.5 rounded-full">
              {action.type} Review
            </span>
            <h3 className="text-[18px] font-bold text-white mt-1">{action.studentName}</h3>
            <p className="text-[12px] text-white/60">{action.department}</p>
          </div>
          <button onClick={onClose} className="p-1 text-white/60 hover:text-white cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-[14px]">
          <div className="p-3.5 bg-white/[0.04] rounded-xl border border-white/10">
            <p className="text-[11px] font-semibold text-white/50 uppercase mb-1">
              Submission Title & Details
            </p>
            <p className="font-bold text-white">{action.details.title || 'Weekly Log'}</p>
            <p className="text-[13px] text-white/70 mt-1 leading-relaxed">
              {action.details.description}
            </p>
          </div>

          {action.details.tasks && action.details.tasks.length > 0 && (
            <div>
              <p className="text-[12px] font-semibold text-white/60 uppercase mb-1.5">
                Key Accomplished Tasks
              </p>
              <ul className="list-disc list-inside text-[13px] text-white/80 space-y-1 bg-white/[0.04] p-3 rounded-xl border border-white/10">
                {action.details.tasks.map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Mentor Feedback & Evaluation Note
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Excellent attention to clean code and prompt execution."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none text-[13px]"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
          <button
            type="button"
            onClick={() => {
              onReject(action.id, feedback);
              onClose();
            }}
            className="px-4 py-2 text-rose-300 hover:bg-rose-500/20 rounded-xl text-[13px] font-semibold cursor-pointer transition-colors border border-rose-500/30"
          >
            Request Revision
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 rounded-xl text-[13px] font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onApprove(action.id, feedback || 'Approved without additional notes.');
                onClose();
              }}
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-violet-900/40 border border-white/10 cursor-pointer transition-all"
            >
              Approve & Validate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Student Add Daily Journal Modal
export const AddJournalModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (journalData: any) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(8);
  const [competency, setCompetency] = useState('Software Engineering');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/12 text-white">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h3 className="text-[18px] font-bold text-white">Add Daily Internship Journal</h3>
            <p className="text-[12px] text-white/60">Log your daily practical training activities</p>
          </div>
          <button onClick={onClose} className="p-1 text-white/60 hover:text-white cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ title, description, hours, competency, date: new Date().toLocaleDateString() });
            onClose();
          }}
          className="space-y-4 mt-4 text-[14px]"
        >
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Activity Title / Focus Area
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implemented User Authentication Module in React"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Hours Dedicated
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Primary Skill Domain
              </label>
              <select
                value={competency}
                onChange={(e) => setCompetency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              >
                <option value="Software Engineering" className="bg-[#131127] text-white">Software Engineering</option>
                <option value="Data Analysis" className="bg-[#131127] text-white">Data Analysis</option>
                <option value="Communication & Documentation" className="bg-[#131127] text-white">Communication & Documentation</option>
                <option value="Teamwork & Agile Process" className="bg-[#131127] text-white">Teamwork & Agile Process</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Detailed Work Summary & Problem Solving Reflection
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe tasks finished, technical challenges overcome, and mentorship guidance received..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none text-[13px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-violet-900/40 border border-white/10 cursor-pointer transition-all"
            >
              Submit Journal Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 5. Check-In Action Modal / Confirmation
export const CheckInModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  alreadyCheckedIn: boolean;
}> = ({ isOpen, onClose, onConfirm, alreadyCheckedIn }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/12 text-center text-white">
        <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
          <span className="material-symbols-outlined text-[32px]">
            {alreadyCheckedIn ? 'verified' : 'location_on'}
          </span>
        </div>

        <h3 className="text-[20px] font-bold text-white">
          {alreadyCheckedIn ? 'Today’s Attendance Logged' : 'On-Site Attendance Check-In'}
        </h3>
        <p className="text-[13px] text-white/60 mt-2 leading-relaxed">
          {alreadyCheckedIn
            ? 'You have successfully verified attendance at PT. Teknologi Maju for today’s session.'
            : 'Verifying GPS geolocation at PT. Teknologi Maju (Menara Astra, Jakarta). Click confirm to log your present status.'}
        </p>

        <div className="bg-white/[0.04] p-3.5 rounded-xl border border-white/10 mt-4 text-left text-[12px] space-y-1.5">
          <div className="flex justify-between">
            <span className="text-white/50">Location:</span>
            <span className="font-semibold text-white">Jakarta Tech Hub (On-Premises)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Time Recorded:</span>
            <span className="font-semibold text-violet-300">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Supervisor:</span>
            <span className="font-semibold text-white">Budi Santoso</span>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 rounded-xl font-semibold cursor-pointer text-[14px] transition-colors"
          >
            Close
          </button>
          {!alreadyCheckedIn && (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold cursor-pointer text-[14px] shadow-lg shadow-violet-900/40 border border-white/10 transition-all"
            >
              Confirm Check-In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 6. Detailed Competency Grid Modal
export const CompetencyGridModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const competencies = [
    { name: 'Full-Stack Web Architecture', cat: 'Software Engineering', level: 'Advanced', score: 85 },
    { name: 'REST API & Microservices', cat: 'Software Engineering', level: 'Expert', score: 90 },
    { name: 'Database Query Optimization', cat: 'Data Analytics', level: 'Intermediate', score: 65 },
    { name: 'Automated Unit & E2E Testing', cat: 'Quality Assurance', level: 'Intermediate', score: 70 },
    { name: 'UI/UX Prototyping & Figma', cat: 'Design Systems', level: 'Advanced', score: 80 },
    { name: 'Technical Documentation & Presentation', cat: 'Communication', level: 'Intermediate', score: 60 },
    { name: 'Agile Scrum Sprint Collaboration', cat: 'Teamwork', level: 'Expert', score: 95 },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-white/12 max-h-[90vh] flex flex-col text-white">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h3 className="text-[18px] font-bold text-white">Internship Competency Matrix</h3>
            <p className="text-[12px] text-white/60">SMK Vocational Standard Evaluation Framework</p>
          </div>
          <button onClick={onClose} className="p-1 text-white/60 hover:text-white cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="overflow-y-auto hide-scrollbar py-4 space-y-3">
          {competencies.map((comp, idx) => (
            <div key={idx} className="p-3.5 bg-white/[0.04] rounded-xl border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-[14px] font-bold text-white">{comp.name}</h4>
                  <span className="text-[11px] font-semibold text-violet-400">{comp.cat}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {comp.level} ({comp.score}%)
                </span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full" style={{ width: `${comp.score}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl border border-white/10 shadow-lg shadow-violet-900/40 cursor-pointer transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// 7. Notifications Drawer Modal
export const NotificationsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}> = ({ isOpen, onClose, notifications, onMarkAllRead }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-2xl max-w-md w-full p-5 shadow-2xl border border-white/12 text-white">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <h3 className="text-[16px] font-bold text-white">Notifications</h3>
          <button onClick={onClose} className="p-1 text-white/60 hover:text-white cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="py-3 space-y-2.5 max-h-[60vh] overflow-y-auto hide-scrollbar">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-xl border text-[13px] ${
                notif.read
                  ? 'bg-white/[0.03] border-white/10 text-white/70'
                  : 'bg-violet-500/15 border-violet-500/30 text-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="font-bold text-white">{notif.title}</p>
                <span className="text-[10px] text-white/40">{notif.time}</span>
              </div>
              <p className="text-white/60 mt-1 text-[12px]">{notif.message}</p>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between items-center">
          <button
            onClick={onMarkAllRead}
            className="text-[12px] font-bold text-violet-400 hover:text-violet-300 cursor-pointer transition-colors"
          >
            Mark all as read
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white rounded-xl font-semibold text-[12px] cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// 8. Add Tenant / Partner Modal (Super Admin)
export const AddTenantModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tenantData: any) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState<'school' | 'industry'>('school');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('SMK Negeri');
  const [city, setCity] = useState('Jakarta Pusat');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quota, setQuota] = useState(50);

  const handleQuickFill = () => {
    if (type === 'school') {
      setName('SMK Negeri 57 Jakarta');
      setCode('20109941');
      setCategory('SMK Pusat Keunggulan');
      setCity('Jakarta Selatan');
      setAddress('Jl. Margasatwa No. 38, Pasar Minggu');
      setContactName('Drs. Ahmad Rifai, M.Pd.');
      setEmail('humas@smkn57jkt.sch.id');
      setPhone('021-7805400');
      setQuota(520);
    } else {
      setName('PT. Astra Digital Solusi');
      setCode('DUDI-IND-778');
      setCategory('Technology & IT');
      setCity('Jakarta Pusat');
      setAddress('Menara Astra Lt. 32, Jl. Jend. Sudirman Kav. 5-6');
      setContactName('Raditya Pratama, S.Kom, M.T.');
      setEmail('internship@astradigital.id');
      setPhone('021-50882000');
      setQuota(35);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="glass-card bg-[#0e1124]/95 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-white/15 text-white my-8 relative">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Super Admin Multi-Tenant Provisioning
              </span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full cursor-pointer transition-colors flex items-center gap-1"
                title="Isi form otomatis dengan contoh data valid"
              >
                <span className="material-symbols-outlined text-[13px]">auto_fix_high</span>
                <span>Auto-Fill Contoh</span>
              </button>
            </div>
            <h3 className="text-[18px] font-bold text-white mt-1.5">
              {type === 'school' ? 'Registrasi Sekolah / SMK Baru' : 'Registrasi Mitra DUDI Baru'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              id: `tenant-${Date.now()}`,
              type,
              name,
              code: code || (type === 'school' ? 'NPSN-2010' + Math.floor(1000 + Math.random() * 9000) : 'DUDI-IND-' + Math.floor(100 + Math.random() * 900)),
              category,
              city,
              address,
              contactName,
              email,
              phone,
              quota: Number(quota),
              status: 'active',
              joinedDate: new Date().toISOString().split('T')[0],
            });
            onClose();
          }}
          className="space-y-4 mt-4 text-[14px]"
        >
          {/* Tenant Type Selector */}
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Tipe Tenant Entitas
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setType('school');
                  setCategory('SMK Negeri');
                }}
                className={`py-2.5 px-4 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  type === 'school'
                    ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-900/40'
                    : 'bg-white/[0.04] border-white/10 text-white/60 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">school</span>
                <span>Institusi SMK (Sekolah)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('industry');
                  setCategory('Technology & IT');
                }}
                className={`py-2.5 px-4 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  type === 'industry'
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40'
                    : 'bg-white/[0.04] border-white/10 text-white/60 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">domain</span>
                <span>Mitra Industri / DUDI</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Nama Lengkap {type === 'school' ? 'Sekolah' : 'Perusahaan'}
              </label>
              <input
                type="text"
                required
                placeholder={type === 'school' ? 'e.g. SMK Negeri 10 Jakarta' : 'e.g. PT. Global Solusi Digital'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                {type === 'school' ? 'Nomor Pokok Sekolah (NPSN)' : 'Kode Registrasi DUDI'}
              </label>
              <input
                type="text"
                placeholder={type === 'school' ? '20109928' : 'DUDI-TECH-04'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Kategori / Sektor
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              >
                {type === 'school' ? (
                  <>
                    <option value="SMK Negeri" className="bg-[#131127] text-white">SMK Negeri</option>
                    <option value="SMK Swasta" className="bg-[#131127] text-white">SMK Swasta</option>
                    <option value="SMK Pusat Keunggulan" className="bg-[#131127] text-white">SMK PK (Pusat Keunggulan)</option>
                  </>
                ) : (
                  <>
                    <option value="Technology & IT" className="bg-[#131127] text-white">Technology & IT</option>
                    <option value="Automotive & Manufacture" className="bg-[#131127] text-white">Automotive & Manufacture</option>
                    <option value="Banking & Financial" className="bg-[#131127] text-white">Banking & Fintech</option>
                    <option value="Creative & Media" className="bg-[#131127] text-white">Creative & Media</option>
                    <option value="Healthcare & Pharmacy" className="bg-[#131127] text-white">Healthcare & Pharma</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Wilayah Kota
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              >
                <option value="Jakarta Pusat" className="bg-[#131127] text-white">Jakarta Pusat</option>
                <option value="Jakarta Selatan" className="bg-[#131127] text-white">Jakarta Selatan</option>
                <option value="Jakarta Barat" className="bg-[#131127] text-white">Jakarta Barat</option>
                <option value="Jakarta Timur" className="bg-[#131127] text-white">Jakarta Timur</option>
                <option value="Jakarta Utara" className="bg-[#131127] text-white">Jakarta Utara</option>
                <option value="Luar DKI Jakarta" className="bg-[#131127] text-white">Luar DKI Jakarta</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                {type === 'school' ? 'Kapasitas Siswa' : 'Kuota Magang'}
              </label>
              <input
                type="number"
                min="1"
                max="2000"
                value={quota}
                onChange={(e) => setQuota(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Alamat Lengkap Kantor / Kampus
            </label>
            <input
              type="text"
              placeholder="e.g. Jl. Medan Merdeka Barat No. 12"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none text-[13px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Penanggung Jawab (PIC)
              </label>
              <input
                type="text"
                placeholder="Nama PIC"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Email Korespondensi
              </label>
              <input
                type="email"
                placeholder="admin@tenant.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                No. Telepon / WhatsApp
              </label>
              <input
                type="tel"
                placeholder="0812-xxxx-xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none text-[13px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-violet-900/40 border border-white/10 cursor-pointer transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">domain_add</span>
              <span>Simpan & Buat Tenant</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 9. Student Logbook / Buku Saku Detail Modal
export const StudentLogbookModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  onVerifyJournal?: (journalId: string) => void;
  studentDepartment?: string;
  studentCompany?: string;
  studentNis?: string;
}> = ({
  isOpen,
  onClose,
  studentName = 'Raditya Pratama',
  onVerifyJournal,
  studentDepartment = 'Rekayasa Perangkat Lunak',
  studentCompany = 'PT. Teknologi Maju (Menara Astra)',
  studentNis = '2024-1082',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'journals' | 'attendance' | 'competencies' | 'notes'>('journals');
  const [teacherNote, setTeacherNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([
    { author: 'Dra. Sri Wahyuni (Guru Pembimbing)', date: '28 Agu 2026', text: 'Kunjungan supervisi perdana. Siswa beradaptasi baik dengan tim frontend dan mematuhi SOP K3.' },
  ]);

  if (!isOpen) return null;

  const sampleJournals = [
    { id: 'journal-31-aug', date: '31 Agu 2026', title: 'Implementasi Role-Based Authorization & Session Cache', hours: 8, status: 'approved', mentor: 'Bayu Pratama, S.T.' },
    { id: 'journal-30-aug', date: '30 Agu 2026', title: 'Unit Testing REST Endpoints & Error Handling', hours: 8, status: 'approved', mentor: 'Bayu Pratama, S.T.' },
    { id: 'journal-29-aug', date: '29 Agu 2026', title: 'Refactoring Component Tree & State Orchestration', hours: 8, status: 'approved', mentor: 'Bayu Pratama, S.T.' },
    { id: 'journal-28-aug', date: '28 Agu 2026', title: 'Integrasi Database Migration & ERD Schema Supabase', hours: 8, status: 'pending', mentor: 'Menunggu Validasi' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="glass-card rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-white/15 text-white my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-start pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
              {studentName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Buku Saku Digital Magang
                </span>
                <span className="text-[11px] text-white/50">NIS: {studentNis}</span>
              </div>
              <h3 className="text-[20px] font-extrabold text-white mt-0.5">{studentName}</h3>
              <p className="text-[12px] text-white/70">{studentDepartment} • {studentCompany}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/60 hover:text-white cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/10 py-3 text-[13px] font-semibold">
          <button
            onClick={() => setActiveSubTab('journals')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'journals' ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Jurnal Harian (24)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'attendance' ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
            <span>Presensi GPS (98%)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('competencies')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'competencies' ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Kompetensi SKKNI</span>
          </button>
          <button
            onClick={() => setActiveSubTab('notes')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'notes' ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">rate_review</span>
            <span>Catatan Supervisi ({savedNotes.length})</span>
          </button>
        </div>

        {/* Sub Tab Contents */}
        <div className="overflow-y-auto hide-scrollbar py-4 space-y-3 flex-1 text-[13px]">
          {activeSubTab === 'journals' && (
            <div className="space-y-3">
              {sampleJournals.map((j, idx) => (
                <div key={idx} className="p-3.5 bg-white/[0.04] rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] font-semibold text-violet-300">{j.date} • {j.hours} Jam Kerja</span>
                    <h4 className="font-bold text-white text-[14px] mt-0.5">{j.title}</h4>
                    <p className="text-[11px] text-white/50 mt-1">Reviewer: {j.mentor}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                    j.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {j.status === 'approved' ? 'Tervalidasi' : 'Pending'}
                  </span>
                  {j.status === 'pending' && onVerifyJournal && (
                    <button
                      type="button"
                      onClick={() => onVerifyJournal(j.id)}
                      className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Validasi
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'attendance' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-500/15 rounded-xl border border-emerald-500/30 text-center">
                  <p className="text-[20px] font-black text-emerald-300">42 Hari</p>
                  <p className="text-[11px] text-emerald-400 font-semibold uppercase">Hadir Tepat Waktu</p>
                </div>
                <div className="p-3 bg-sky-500/15 rounded-xl border border-sky-500/30 text-center">
                  <p className="text-[20px] font-black text-sky-300">1 Hari</p>
                  <p className="text-[11px] text-sky-400 font-semibold uppercase">Izin / Sakit</p>
                </div>
                <div className="p-3 bg-purple-500/15 rounded-xl border border-purple-500/30 text-center">
                  <p className="text-[20px] font-black text-purple-300">336 Jam</p>
                  <p className="text-[11px] text-purple-400 font-semibold uppercase">Total Jam Kerja</p>
                </div>
              </div>
              <p className="text-white/60 text-[12px]">Koordinat Geofence: -6.2088° S, 106.8456° E (Radius 100m Terverifikasi Valid).</p>
            </div>
          )}

          {activeSubTab === 'competencies' && (
            <div className="space-y-2.5">
              {[
                { name: 'Implementasi Algoritma Pemrograman', code: 'J.620100.004.02', level: 'Mandiri / Valid', score: 92 },
                { name: 'Membuat Arsitektur Basis Data Relasional', code: 'J.620100.016.01', level: 'Mandiri / Valid', score: 88 },
                { name: 'Melakukan Pengujian Unit Software', code: 'J.620100.025.02', level: 'Bimbingan Lanjutan', score: 78 },
                { name: 'Menerapkan K3 dalam Lingkungan IT', code: 'J.620100.001.01', level: 'Mandiri / Valid', score: 95 },
              ].map((c, i) => (
                <div key={i} className="p-3 bg-white/[0.04] rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-white">{c.name}</h5>
                    <span className="text-[11px] text-violet-300">{c.code}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {c.level} ({c.score}%)
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'notes' && (
            <div className="space-y-3">
              <div className="space-y-2">
                {savedNotes.map((note, idx) => (
                  <div key={idx} className="p-3 bg-white/[0.04] rounded-xl border border-white/10">
                    <div className="flex justify-between text-[11px] text-white/50 mb-1">
                      <span className="font-bold text-violet-300">{note.author}</span>
                      <span>{note.date}</span>
                    </div>
                    <p className="text-white/80 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
                  Tambah Catatan Monitoring Guru
                </label>
                <textarea
                  rows={2}
                  value={teacherNote}
                  onChange={(e) => setTeacherNote(e.target.value)}
                  placeholder="Tuliskan evaluasi perkembangan, teguran, atau arahan khusus untuk siswa..."
                  className="w-full px-3 py-2 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 text-[12px] outline-none focus:ring-2 focus:ring-violet-500/40"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!teacherNote.trim()) return;
                      setSavedNotes([
                        ...savedNotes,
                        {
                          author: 'Dra. Sri Wahyuni (Guru Pembimbing)',
                          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                          text: teacherNote,
                        },
                      ]);
                      setTeacherNote('');
                    }}
                    className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-[12px] font-bold cursor-pointer transition-all"
                  >
                    Simpan Catatan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white font-bold rounded-xl text-[13px] cursor-pointer transition-all"
          >
            Tutup Buku Saku
          </button>
        </div>
      </div>
    </div>
  );
};

// 10. Schedule Supervision Modal (Teacher Mentor)
export const ScheduleSupervisionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (scheduleData: any) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [partner, setPartner] = useState('PT. Teknologi Maju');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'On-site Visit' | 'Virtual Sync' | 'Emergency Call'>('On-site Visit');
  const [agenda, setAgenda] = useState('Supervisi Berkala & Sinkronisasi Capaian SKKNI');
  const [students, setStudents] = useState('Raditya Pratama, Siti Nurhaliza, Ahmad Fauzi');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/12 text-white">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h3 className="text-[18px] font-bold text-white">Jadwalkan Kunjungan Supervisi</h3>
            <p className="text-[12px] text-white/60">Monitoring siswa magang di lokasi industri mitra</p>
          </div>
          <button onClick={onClose} className="p-1 text-white/60 hover:text-white cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              id: `sup-${Date.now()}`,
              partner,
              visitDate,
              type,
              agenda,
              students,
              status: 'Scheduled',
            });
            onClose();
          }}
          className="space-y-4 mt-4 text-[14px]"
        >
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Mitra Industri Tujuan
            </label>
            <select
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
            >
              <option value="PT. Teknologi Maju" className="bg-[#131127] text-white">PT. Teknologi Maju (Menara Astra)</option>
              <option value="PT. Astra Digital" className="bg-[#131127] text-white">PT. Astra Digital (Sunter)</option>
              <option value="Bank Mandiri Fintech" className="bg-[#131127] text-white">Bank Mandiri Fintech (Gatot Subroto)</option>
              <option value="Telkom Indonesia" className="bg-[#131127] text-white">Telkom Indonesia (Telkom Landmark)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Tanggal Kunjungan
              </label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Metode Supervisi
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              >
                <option value="On-site Visit" className="bg-[#131127] text-white">Kunjungan Langsung (On-site)</option>
                <option value="Virtual Sync" className="bg-[#131127] text-white">Virtual Meet / Video Call</option>
                <option value="Emergency Call" className="bg-[#131127] text-white">Mediasi Mendesak</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Daftar Siswa Dimonitor
            </label>
            <input
              type="text"
              value={students}
              onChange={(e) => setStudents(e.target.value)}
              placeholder="e.g. Raditya Pratama, Siti Nurhaliza"
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Fokus / Agenda Supervisi
            </label>
            <textarea
              rows={3}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="Jelaskan pokok bahasan bersama mentor industri dan siswa..."
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none text-[13px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-violet-900/40 border border-white/10 cursor-pointer transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
              <span>Konfirmasi Jadwal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 11. Add Industry Mentor Modal (Industry Admin)
export const AddIndustryMentorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mentorData: any) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Senior Software Engineer');
  const [department, setDepartment] = useState('Software Engineering');
  const [email, setEmail] = useState('');
  const [maxCapacity, setMaxCapacity] = useState(5);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/12 text-white">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h3 className="text-[18px] font-bold text-white">Tambah Pembimbing Industri</h3>
            <p className="text-[12px] text-white/60">Tugaskan mentor internal untuk membimbing siswa magang</p>
          </div>
          <button onClick={onClose} className="p-1 text-white/60 hover:text-white cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              id: `m-ind-${Date.now()}`,
              name,
              title,
              department,
              email,
              assignedInterns: 0,
              maxCapacity: Number(maxCapacity),
              status: 'active',
            });
            onClose();
          }}
          className="space-y-4 mt-4 text-[14px]"
        >
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Nama Lengkap Mentor
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bayu Pratama, S.T."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Divisi / Departemen
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none text-[13px]"
              >
                <option value="Software Engineering" className="bg-[#131127] text-white">Software Engineering</option>
                <option value="Cloud Infrastructure" className="bg-[#131127] text-white">Cloud Infrastructure</option>
                <option value="Product & UI/UX" className="bg-[#131127] text-white">Product & UI/UX</option>
                <option value="Cyber Security" className="bg-[#131127] text-white">Cyber Security</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Kapasitas Siswa
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white focus:ring-2 focus:ring-violet-500/40 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Jabatan / Posisi Kerja
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lead Software Architect"
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Email Perusahaan
            </label>
            <input
              type="email"
              required
              placeholder="mentor@perusahaan.co.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/12 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-violet-500/40 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-violet-900/40 border border-white/10 cursor-pointer transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Daftarkan Mentor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 12. Adjust Department Quota Modal (Industry Admin)
export const AdjustQuotaModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quotas: { unit: string; quota: number }[]) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [quotas, setQuotas] = useState([
    { unit: 'Software Engineering & App Dev', quota: 15, filled: 12 },
    { unit: 'Cloud Infrastructure & DevOps', quota: 10, filled: 8 },
    { unit: 'Product Design & UI/UX Studio', quota: 8, filled: 6 },
    { unit: 'Cyber Security Operations', quota: 6, filled: 4 },
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/12 text-white">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h3 className="text-[18px] font-bold text-white">Atur Kuota Divisi Magang</h3>
            <p className="text-[12px] text-white/60">Sesuaikan kuota penerimaan siswa per unit kerja industri</p>
          </div>
          <button onClick={onClose} className="p-1 text-white/60 hover:text-white cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(quotas);
            onClose();
          }}
          className="space-y-4 mt-4 text-[14px]"
        >
          <div className="space-y-3">
            {quotas.map((q, idx) => (
              <div key={idx} className="p-3.5 bg-white/[0.04] rounded-xl border border-white/10 flex justify-between items-center gap-4">
                <div>
                  <h4 className="font-bold text-white text-[13px]">{q.unit}</h4>
                  <span className="text-[11px] text-white/50">Terisi saat ini: {q.filled} Siswa</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] uppercase text-white/50 font-bold">Kuota:</label>
                  <input
                    type="number"
                    min={q.filled}
                    max={50}
                    value={q.quota}
                    onChange={(e) => {
                      const updated = [...quotas];
                      updated[idx].quota = Number(e.target.value);
                      setQuotas(updated);
                    }}
                    className="w-18 px-2 py-1.5 bg-white/[0.08] border border-white/15 rounded-lg text-white font-bold text-center outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-violet-900/40 border border-white/10 cursor-pointer transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Simpan Kuota</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
