import { createContext } from "react";
import type { EscolaContextValue } from "./types";

export const EscolaContext = createContext<EscolaContextValue | null>(null);
