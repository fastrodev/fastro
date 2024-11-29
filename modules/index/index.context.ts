// deno-lint-ignore-file
import { signal } from "@preact/signals";
import { createContext } from "preact";
import { DataType, RoomType } from "@app/modules/types/mod.ts";

export function createAppState() {
  const room = signal({
    name: "global",
    id: "01JAC4GM721KGRWZHG53SMXZP0",
  });
  const message = signal<any | null>();
  const rooms = signal<RoomType[] | null>();
  const messages = signal<DataType[] | null>();

  return { room, message, rooms, messages };
}

export const AppContext = createContext(createAppState());

export function createMainState() {
  const state = signal({
    name: "global",
    id: "01JAC4GM721KGRWZHG53SMXZP0",
  });

  return { state };
}

export const MainContext = createContext(createMainState());
