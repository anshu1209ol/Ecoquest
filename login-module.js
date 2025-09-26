import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged 
} from './firebase/auth.js';
import { 
  doc, 
  setDoc, 
  getDoc 
} from './firebase/firestore.js';

function validateEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validateName(name){ return /^[A-Za-z][A-Za-z\s'.-]{1,48}$/.test(name); }
function validateSchool(s){ return /^[A-Za-z0-9][A-Za-z0-9\s'.&()-]{2,80}$/.test(s); }

async function getUserData(uid) {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
}

async function createUserProfile(uid, profile) {
  await setDoc(doc(db, 'users', uid), profile);
}

document.addEventListener('DOMContentLoaded', () => {
  const showLogin = document.getElementById('show-login');
  const showSignup = document.getElementById('show-signup');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');

  // Toggle between login and signup forms
  showLogin.addEventListener('click', () => {
    showLogin.classList.add('active');
    showSignup.classList.remove('active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    authTitle.textContent = 'Welcome to EcoQuest';
    authSubtitle.textContent = 'Sign in to continue your eco journey';
  });

  showSignup.addEventListener('click', () => {
    showSignup.classList.add('active');
    showLogin.classList.remove('active');
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
    authTitle.textContent = 'Join EcoQuest';
    authSubtitle.textContent = 'Create your account and start making a difference';
  });

  // Password toggle functionality
  document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
      } else {
        input.type = 'password';
        toggle.textContent = '👁️';
      }
    });
  });

  // Handle login form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userData = await getUserData(user.uid);
      if (!userData) {
        alert('User profile not found. Please contact support.');
        return;
      }
      const redirect = new URLSearchParams(location.search).get('redirect') || 'dashboard.html';
      window.location.href = redirect;
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  });

  // Handle signup form submission
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const name = document.getElementById('signup-name').value.trim();
    const school = document.getElementById('signup-school').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    const errors = [];
    if (!validateEmail(email)) errors.push('Enter a valid email.');
    if (!validateName(name)) errors.push('Enter a valid full name.');
    if (!validateSchool(school)) errors.push('Enter a valid school/college name.');
    if (password !== confirmPassword) errors.push('Passwords do not match.');

    if (errors.length) {
      alert(errors.join(' '));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const profile = {
        email,
        name,
        school,
        points: 0,
        badges: [],
        tasksCompleted: {},
        avatarDataUrl: Eco.initialsAvatar(name),
        lastLoginDate: '',
        quizHistory: []
      };
      await createUserProfile(user.uid, profile);
      const redirect = new URLSearchParams(location.search).get('redirect') || 'dashboard.html';
      window.location.href = redirect;
    } catch (error) {
      alert('Signup failed: ' + error.message);
    }
  });
});
