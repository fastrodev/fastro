// Copyright 2020 the Fastro author. All rights reserved. MIT license.

export interface Cookie {
  name: string;
  value: string;
  expires?: string;
  secure?: boolean;
  path?: string;
  HttpOnly?: boolean;
  SameSite?: "Strict " | "Lax" | "None";
  domain?: string;
}
