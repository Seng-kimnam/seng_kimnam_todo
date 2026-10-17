import { useEffect, useState } from "react";
import { getProfile, updateProfile, type Profile } from "@/api/profile";
import { ApiError } from "@/api/client";

const UserDetailPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    const fetchProfile = async () => {
      try {
        if (!active) return;
        setLoading(true);
        const data = await getProfile();
        if (active) {
          setProfile(data);
          setUsername(data.username ?? "");
          setDisplayName(data.displayName ?? "");
          setEmail(data.email ?? "");
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : "Something went wrong.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    void fetchProfile();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);

    if (!username.trim() || !displayName.trim() || !email.trim()) {
      setStatus({ type: "error", message: "Please fill in all fields." });
      return;
    }
    if (username.trim().length < 3) {
      setStatus({
        type: "error",
        message: "Username must be at least 3 characters.",
      });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setStatus({ type: "error", message: "Please enter a valid email." });
      return;
    }

    try {
      const updated = await updateProfile({
        username: username.trim(),
        displayName: displayName.trim(),
        email: email.trim(),
      });
      setProfile(updated);
      setStatus({ type: "success", message: "Profile updated." });
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof ApiError ? err.message : "Failed to update profile.",
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-sm text-slate-600">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-sm text-red-700">{error ?? "Profile not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-extrabold uppercase">
              {profile.displayName?.charAt(0) || profile.username?.charAt(0)}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 truncate">
                {profile.displayName || profile.username}
              </h1>
              <p className="text-sm text-slate-500 truncate">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Account Details</h2>
          <p className="text-sm text-slate-500 mt-1">
            Update your username, display name and email address.
          </p>

          {status && (
            <div
              className={`mt-4 px-4 py-3 rounded-xl text-sm border ${
                status.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="profile-username"
                className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
              >
                Username
              </label>
              <input
                id="profile-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl border border-slate-200 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="profile-displayname"
                className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
              >
                Display Name
              </label>
              <input
                id="profile-displayname"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl border border-slate-200 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
              >
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl border border-slate-200 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors active:scale-[0.98]"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
