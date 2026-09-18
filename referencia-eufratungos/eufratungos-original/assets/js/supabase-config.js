/* ===========================================
   Eufratungos – Configuração Supabase
   =========================================== */
const SUPABASE_URL = 'https://nwhgfskwshvoujhaoevt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4kg0FN_r_C9umEzcRHxOHw__MIiaAsB';

const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── Helpers genéricos de dados (news, projects, ads) ── */
const EufraDB = {
  async list(tabela, orderCol = 'created_at') {
    const { data, error } = await sbClient.from(tabela).select('*').order(orderCol, { ascending: false });
    if (error) { console.error(error); return []; }
    return data || [];
  },
  async insert(tabela, obj) {
    const { data, error } = await sbClient.from(tabela).insert(obj).select().single();
    if (error) { console.error(error); throw error; }
    return data;
  },
  async update(tabela, id, obj) {
    const { data, error } = await sbClient.from(tabela).update(obj).eq('id', id).select().single();
    if (error) { console.error(error); throw error; }
    return data;
  },
  async remove(tabela, id) {
    const { error } = await sbClient.from(tabela).delete().eq('id', id);
    if (error) { console.error(error); throw error; }
  },
  /* Upload de imagem para o bucket 'imagens', devolve URL pública */
  async uploadImagem(file) {
    if (!file) return null;
    const ext = file.name.split('.').pop();
    const nome = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await sbClient.storage.from('imagens').upload(nome, file, { upsert: false });
    if (error) { console.error(error); throw error; }
    const { data } = sbClient.storage.from('imagens').getPublicUrl(nome);
    return data.publicUrl;
  }
};

/* ── Auth helpers (login de gestores) ── */
const EufraAuth = {
  async signIn(email, password) {
    return sbClient.auth.signInWithPassword({ email, password });
  },
  async signOut() {
    return sbClient.auth.signOut();
  },
  async getSession() {
    const { data } = await sbClient.auth.getSession();
    return data.session;
  },
  async updatePassword(newPassword) {
    return sbClient.auth.updateUser({ password: newPassword });
  },
  async updateEmail(newEmail) {
    return sbClient.auth.updateUser({ email: newEmail });
  },
  async sendPasswordReset(email, redirectTo) {
    return sbClient.auth.resetPasswordForEmail(email, { redirectTo });
  },
  onAuthStateChange(cb) {
    sbClient.auth.onAuthStateChange((event, session) => cb(event, session));
  }
};
