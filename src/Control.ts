import { Details } from "./Response";

export type Control = () => Promise<Details> | Details | undefined;
