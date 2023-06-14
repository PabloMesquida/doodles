import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const defaultInit: RequestInit = {
    credentials: "include",
  };

  const response = await fetch(input, { ...defaultInit, ...init });

  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    if (response.status === 401) {
      throw new UnauthorizedError(errorMessage);
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage);
    } else {
      throw Error(`Request failed with status: ${response.status} message: ${errorMessage}`);
    }
  }
}

export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData(`${import.meta.env.VITE_SERVER_URL}/api/users`, {
    method: "GET",
  });

  return response.json();
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData(`${import.meta.env.VITE_SERVER_URL}/api/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetchData(`${import.meta.env.VITE_SERVER_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function logout() {
  await fetchData(`${import.meta.env.VITE_SERVER_URL}/api/users/logout`, {
    method: "POST",
  });
}

interface FetchNotesProps {
  page: number;
  limit: number;
}

export async function fetchNotes({ page, limit }: FetchNotesProps): Promise<Note[]> {
  console.log("page:", page, " - limit:", limit);
  const response = await fetchData(
    `${import.meta.env.VITE_SERVER_URL}/api/notes?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
  return response.json();
}

export async function fetchNoteUser(userId: string): Promise<User> {
  const response = await fetchData(`${import.meta.env.VITE_SERVER_URL}/api/users/${userId}`, {
    method: "GET",
  });
  return response.json();
}

export async function fetchUserNotes(userName: string): Promise<Note[]> {
  const response = await fetchData(
    `${import.meta.env.VITE_SERVER_URL}/api/notes/user/${userName}`,
    {
      method: "GET",
    }
  );
  return response.json();
}

export interface NoteInput {
  title: string;
  img: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
  const response = await fetchData(`${import.meta.env.VITE_SERVER_URL}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  return response.json();
}

export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
  const response = await fetchData(`${import.meta.env.VITE_SERVER_URL}/api/notes/${noteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  return response.json();
}

export async function deleteNote(noteId: string) {
  await fetchData(`${import.meta.env.VITE_SERVER_URL}/api/notes/${noteId}`, {
    method: "DELETE",
  });
}
