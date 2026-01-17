import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { User } from '../types';

interface AdminDashboardProps {
  user: User;
}

const POSITIONS = [
  'সদস্য',
  'সভাপতি',
  'সহ-সভাপতি',
  'সাধারণ সম্পাদক',
  'সহ-সাধারণ সম্পাদক',
  'অর্থ সম্পাদক',
  'নির্বাহী সদস্য',
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [reviewingUser, setReviewingUser] = useState<User | null>(null);

  // 🔹 LOAD MEMBERS (REAL DB)
  const loadMembers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data as User[]);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // 🔹 APPROVE MEMBER (FIXED)
  const approveMember = async () => {
    if (!reviewingUser) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        approved: true,
        role: 'member',
        name: reviewingUser.name,
        position: reviewingUser.position,
        monthly_amount: reviewingUser.monthly_amount || 200,
      })
      .eq('id', reviewingUser.id);

    if (error) {
      alert('Approve failed');
    } else {
      alert('Member approved');
      setReviewingUser(null);
      loadMembers();
    }
  };

  // 🔹 UPDATE APPROVED MEMBER
  const updateMember = async () => {
    if (!reviewingUser) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name: reviewingUser.name,
        position: reviewingUser.position,
        monthly_amount: reviewingUser.monthly_amount,
      })
      .eq('id', reviewingUser.id);

    if (error) {
      alert('Update failed');
    } else {
      alert('Member updated');
      setReviewingUser(null);
      loadMembers();
    }
  };

  // 🔹 REJECT MEMBER
  const rejectMember = async () => {
    if (!reviewingUser) return;

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', reviewingUser.id);

    if (!error) {
      alert('Member rejected');
      setReviewingUser(null);
      loadMembers();
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.includes(search)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-black mb-6">Admin Dashboard</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="নাম বা ইমেইল দিয়ে খুঁজুন"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-72 px-4 py-2 border rounded-lg font-bold"
      />

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-xs uppercase">নাম</th>
              <th className="p-4 text-xs uppercase">ইমেইল</th>
              <th className="p-4 text-xs uppercase">স্ট্যাটাস</th>
              <th className="p-4 text-xs uppercase text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-4 font-bold">{u.name}</td>
                <td className="p-4 text-sm">{u.email}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      u.approved
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {u.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setReviewingUser(u)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-slate-400">
                  কোনো সদস্য পাওয়া যায়নি
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {reviewingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-2xl p-8">
            <h2 className="text-xl font-black mb-4">Member Management</h2>

            <div className="space-y-3">
              <input
                value={reviewingUser.name}
                onChange={(e) =>
                  setReviewingUser({ ...reviewingUser, name: e.target.value })
                }
                className="w-full border px-4 py-2 rounded font-bold"
                placeholder="নাম"
              />

              <select
                value={reviewingUser.position || 'সদস্য'}
                onChange={(e) =>
                  setReviewingUser({
                    ...reviewingUser,
                    position: e.target.value,
                  })
                }
                className="w-full border px-4 py-2 rounded font-bold"
              >
                {POSITIONS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>

              <input
                type="number"
                value={reviewingUser.monthly_amount || 200}
                onChange={(e) =>
                  setReviewingUser({
                    ...reviewingUser,
                    monthly_amount: Number(e.target.value),
                  })
                }
                className="w-full border px-4 py-2 rounded font-bold"
                placeholder="Monthly Amount"
              />
            </div>

            <div className="flex gap-4 mt-6">
              {!reviewingUser.approved ? (
                <>
                  <button
                    onClick={approveMember}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-black"
                  >
                    Approve
                  </button>
                  <button
                    onClick={rejectMember}
                    className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-black"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <button
                  onClick={updateMember}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-black"
                >
                  Update Member
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
