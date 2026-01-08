import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export const quizService = {
  // Create a new quiz
  createQuiz: async (quizData, userId) => {
    try {
      const quiz = {
        ...quizData,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: quizData.status || 'draft' // default to draft
      };
      
      const docRef = await addDoc(collection(db, 'quizzes'), quiz);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all quizzes for a user
  getUserQuizzes: async (userId) => {
    try {
      const q = query(collection(db, 'quizzes'), where('createdBy', '==', userId));
      const querySnapshot = await getDocs(q);
      const quizzes = [];
      querySnapshot.forEach((doc) => {
        quizzes.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, quizzes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get a specific quiz by ID
  getQuizById: async (quizId) => {
    try {
      const docRef = doc(db, 'quizzes', quizId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, quiz: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Quiz not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update a quiz
  updateQuiz: async (quizId, quizData) => {
    try {
      const docRef = doc(db, 'quizzes', quizId);
      const updatedQuiz = {
        ...quizData,
        updatedAt: new Date()
      };
      
      await updateDoc(docRef, updatedQuiz);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete a quiz
  deleteQuiz: async (quizId) => {
    try {
      await deleteDoc(doc(db, 'quizzes', quizId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all published quizzes (for public access)
  getPublishedQuizzes: async () => {
    try {
      const q = query(collection(db, 'quizzes'), where('status', '==', 'published'));
      const querySnapshot = await getDocs(q);
      const quizzes = [];
      querySnapshot.forEach((doc) => {
        quizzes.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, quizzes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};