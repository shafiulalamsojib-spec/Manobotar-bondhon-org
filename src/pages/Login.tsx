const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    // 🔴 0️⃣ HARD ADMIN LOGIN (BACKUP / SAFE)
    if (
      email === 'shafiulalamsojib@gmail.com' &&
      password === '@Sojib210073@'
    ) {
      const adminUser: User = {
        id: 'admin-root',
        name: 'শফিউল আলম সজীব',
        email,
        role: 'Admin',
        approved: true,
        status: 'Approved',
        monthly_amount: 0,
        joining_date: new Date().toISOString(),
        token: 'local-admin-token',
        permissions: {
          viewFund: true,
          postActivities: true,
          postNotices: true,
          manageMembers: true,
        },
      };

      onLogin(adminUser);
      return;
    }

    // 🔵 1️⃣ SUPABASE AUTH LOGIN (MEMBER)
    const { data, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !data.user) {
      setError('ভুল ইমেইল বা পাসওয়ার্ড');
      return;
    }

    // 🔵 2️⃣ FETCH PROFILE
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      setError('প্রোফাইল পাওয়া যায়নি');
      return;
    }

    // 🔵 3️⃣ APPROVAL CHECK
    if (!profile.approved) {
      setError('আপনার একাউন্ট এখনো approve হয়নি');
      return;
    }

    // 🔵 4️⃣ BUILD USER
    const userData: User = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: 'Member',
      approved: true,
      status: 'Approved',
      monthly_amount: profile.monthly_amount || 0,
      joining_date: profile.created_at,
      token: data.session?.access_token || '',
      permissions: {},
    };

    onLogin(userData);
  } catch (err) {
    console.error(err);
    setError('লগইন ব্যর্থ হয়েছে');
  } finally {
    setLoading(false);
  }
};
