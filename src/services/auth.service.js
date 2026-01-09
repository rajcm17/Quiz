import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const authService = {
  // Sign up with email and password
  signUp: async (email, password, role = 'user') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // create a user profile document with role
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email,
          role,
          createdAt: new Date()
        });
      } catch (err) {
        // non-fatal: warn but continue
        // eslint-disable-next-line no-console
        console.warn('Failed to create user profile:', err);
      }

      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check auth state
  onAuthStateChange: (callback) => {
    // Wrap the firebase auth state change and enrich with profile (role)
    return onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        callback(null);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot && userSnapshot.exists()) {
          const data = userSnapshot.data();
          callback({
            uid: fbUser.uid,
            email: fbUser.email,
            role: data.role || 'user'
          });
        } else {
          // No profile doc found, default to user
          callback({
            uid: fbUser.uid,
            email: fbUser.email,
            role: 'user'
          });
        }
      } catch (err) {
        // If fetching profile fails, fallback to basic user
        // eslint-disable-next-line no-console
        console.warn('Failed to load user profile:', err);
        callback({
          uid: fbUser.uid,
          email: fbUser.email,
          role: 'user'
        });
      }
    });
  }
};