import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  order?: number;
  createdAt?: unknown;
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
  level: number; // 1-100
}

export interface Experience {
  id?: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  order?: number;
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  message: string;
  read?: boolean;
  createdAt?: unknown;
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export async function getProjects(): Promise<Project[]> {
  const q = query(collection(db, "projects"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

export async function addProject(data: Omit<Project, "id">) {
  return addDoc(collection(db, "projects"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateProject(id: string, data: Partial<Project>) {
  return updateDoc(doc(db, "projects", id), data);
}

export async function deleteProject(id: string) {
  return deleteDoc(doc(db, "projects", id));
}

// ─── Skills ───────────────────────────────────────────────────────────────────
export async function getSkills(): Promise<Skill[]> {
  const snap = await getDocs(collection(db, "skills"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Skill));
}

export async function addSkill(data: Omit<Skill, "id">) {
  return addDoc(collection(db, "skills"), data);
}

export async function updateSkill(id: string, data: Partial<Skill>) {
  return updateDoc(doc(db, "skills", id), data);
}

export async function deleteSkill(id: string) {
  return deleteDoc(doc(db, "skills", id));
}

// ─── Experience ───────────────────────────────────────────────────────────────
export async function getExperiences(): Promise<Experience[]> {
  const q = query(collection(db, "experiences"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Experience));
}

export async function addExperience(data: Omit<Experience, "id">) {
  return addDoc(collection(db, "experiences"), data);
}

export async function updateExperience(id: string, data: Partial<Experience>) {
  return updateDoc(doc(db, "experiences", id), data);
}

export async function deleteExperience(id: string) {
  return deleteDoc(doc(db, "experiences", id));
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export async function getMessages(): Promise<Message[]> {
  const snap = await getDocs(collection(db, "messages"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message));
}

export async function addMessage(data: Omit<Message, "id">) {
  return addDoc(collection(db, "messages"), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export async function markMessageRead(id: string) {
  return updateDoc(doc(db, "messages", id), { read: true });
}

// ─── Storage ──────────────────────────────────────────────────────────────────
export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteImage(url: string) {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // ignore if not found
  }
}
