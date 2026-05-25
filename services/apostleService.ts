import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  Timestamp,
  serverTimestamp,
  where
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { 
  ApostleTask, 
  ApostleLog, 
  ApostleReport, 
  ApostleUXIssue, 
  ApostleConfig 
} from "../types";

const TASKS_COLL = "apostle_tasks";
const LOGS_COLL = "apostle_logs";
const REPORTS_COLL = "apostle_reports";
const ISSUES_COLL = "apostle_ux_issues";
const CONFIG_DOC = "apostle_config/global";

export const apostleService = {
  async getConfig(): Promise<ApostleConfig | null> {
    try {
      const snap = await getDoc(doc(db, CONFIG_DOC));
      return snap.exists() ? (snap.data() as ApostleConfig) : null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, CONFIG_DOC);
      return null;
    }
  },

  async updateConfig(config: Partial<ApostleConfig>) {
    try {
      await setDoc(doc(db, CONFIG_DOC), { ...config }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, CONFIG_DOC);
    }
  },

  async createTask(task: Omit<ApostleTask, "id">) {
    try {
      const docRef = await addDoc(collection(db, TASKS_COLL), task);
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, TASKS_COLL);
      return null;
    }
  },

  async getLatestTasks(count = 10): Promise<ApostleTask[]> {
    try {
      const q = query(
        collection(db, TASKS_COLL), 
        orderBy("scheduledAt", "desc"), 
        limit(count)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ApostleTask));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, TASKS_COLL);
      return [];
    }
  },

  async logAction(log: Omit<ApostleLog, "id">) {
    try {
      await addDoc(collection(db, LOGS_COLL), {
        ...log,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, LOGS_COLL);
    }
  },

  async getLatestLogs(count = 20): Promise<ApostleLog[]> {
    try {
      const q = query(
        collection(db, LOGS_COLL), 
        orderBy("timestamp", "desc"), 
        limit(count)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ApostleLog));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, LOGS_COLL);
      return [];
    }
  },

  async getLatestReport(): Promise<ApostleReport | null> {
    try {
      const q = query(
        collection(db, REPORTS_COLL), 
        orderBy("timestamp", "desc"), 
        limit(1)
      );
      const snap = await getDocs(q);
      return snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as ApostleReport);
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, REPORTS_COLL);
      return null;
    }
  },

  async createReport(report: Omit<ApostleReport, "id">) {
    try {
      const docRef = await addDoc(collection(db, REPORTS_COLL), report);
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, REPORTS_COLL);
      return null;
    }
  },

  async reportUXIssue(issue: Omit<ApostleUXIssue, "id">) {
    try {
      const docRef = await addDoc(collection(db, ISSUES_COLL), issue);
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, ISSUES_COLL);
      return null;
    }
  },

  async getUXIssues(): Promise<ApostleUXIssue[]> {
    try {
      const q = query(
        collection(db, ISSUES_COLL), 
        orderBy("detectedAt", "desc")
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ApostleUXIssue));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, ISSUES_COLL);
      return [];
    }
  }
};
