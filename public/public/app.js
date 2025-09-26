import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';

const RULES = {
  quizCorrect: 5,
  taskComplete: 50,
  dailyLogin: 2,
  silverThreshold: 100,
  goldThreshold: 250,
  platinumThreshold: 400,
  certificateThreshold: 500
};

async function getUserDocRef(uid) {
  return doc(db, 'users', uid);
}

async function getUserData(uid) {
  const userDoc = await getDoc(await getUserDocRef(uid));
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
}

async function createUserProfile(uid, profile) {
  await setDoc(await getUserDocRef(uid), profile);
}

async function updateUserData(uid, data) {
  await updateDoc(await getUserDocRef(uid), data);
}

function todayStr() { return new Date().toISOString().slice(0,10); }

async function grantDailyLoginIfEligible(uid) {
  const user = await getUserData(uid);
  if (!user) return false;
  const today = todayStr();
  if (user.lastLoginDate !== today) {
    const newPoints = (user.points || 0) + RULES.dailyLogin;
    await updateUserData(uid, { points: newPoints, lastLoginDate: today });
    return true;
  }
  return false;
}

async function recomputeBadges(uid) {
  const user = await getUserData(uid);
  if (!user) return;
  const badges = new Set(user.badges || []);
  if ((user.points || 0) >= RULES.silverThreshold) badges.add('Silver');
  if ((user.points || 0) >= RULES.goldThreshold) badges.add('Gold');
  if ((user.points || 0) >= RULES.platinumThreshold) badges.add('Platinum');
  await updateUserData(uid, { badges: Array.from(badges) });
}

async function awardPoints(uid, amount, reason) {
  const user = await getUserData(uid);
  if (!user) return;
  const newPoints = (user.points || 0) + amount;
  const newQuizHistory = user.quizHistory ? [...user.quizHistory] : [];
  if (reason) newQuizHistory.push({ reason, amount, at: new Date().toISOString() });
  await updateUserData(uid, { points: newPoints, quizHistory: newQuizHistory });
  await recomputeBadges(uid);
}

function initialsAvatar(name) {
  const initials = (name || 'Eco User').split(/\s+/).slice(0,2).map(s=>s[0]?.toUpperCase()||'E').join('');
  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const colors = ['#22c55e','#16a34a','#059669','#047857','#065f46'];
  const bg = colors[initials.charCodeAt(0)%colors.length];
  ctx.fillStyle = bg; ctx.fillRect(0,0,128,128);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px Inter, Arial';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(initials, 64, 72);
  return canvas.toDataURL('image/png');
}

async function updateNav() {
  const navUser = document.querySelector('#navUser');
  const authBtns = document.querySelector('#authButtons');
  const user = auth.currentUser ? await getUserData(auth.currentUser.uid) : null;
  if (navUser && authBtns) {
    if (user) {
      authBtns.style.display = 'none';
      navUser.style.display = 'flex';
      const img = navUser.querySelector('img');
      const nameEl = navUser.querySelector('span');
      if (img) img.src = user.avatarDataUrl || initialsAvatar(user.name);
      if (nameEl) nameEl.textContent = user.name || auth.currentUser.email;
    } else {
      navUser.style.display = 'none';
      authBtns.style.display = 'flex';
    }
  }
}

function navHandlers() {
  const logoutBtn = document.querySelector('#logoutBtn');
  if (logoutBtn) logoutBtn.onclick = async () => {
    await firebaseSignOut(auth);
    window.location.href = 'index.html';
  };
}

function lockGatedSections() {
  const user = auth.currentUser;
  document.querySelectorAll('[data-gated]')
    .forEach(el => { el.classList.toggle('locked', !user); });
}

function formatPoints(n) { return (n||0).toLocaleString(); }

function requireAuth() {
  if (!auth.currentUser) {
    window.location.href = 'login.html?redirect=' + encodeURIComponent(location.pathname.split('/').pop() || 'index.html');
    return null;
  }
  return auth.currentUser;
}

async function getAuthedUser() {
  if (!auth.currentUser) return null;
  return await getUserData(auth.currentUser.uid);
}

window.Eco = {
  RULES,
  awardPoints,
  recomputeBadges,
  grantDailyLoginIfEligible,
  initialsAvatar,
  updateNav,
  navHandlers,
  lockGatedSections,
  formatPoints,
  requireAuth,
  getAuthedUser
};

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await updateNav();
      lockGatedSections();
    } else {
      updateNav();
      lockGatedSections();
    }
  });
  navHandlers();
});
