import {
    a
  } from "pepr";
  
export class Gateway extends a.GenericKind {
    spec: {
        // RL Info
        rateLimit: RateLimit;
        // JWT info
        jwtAuth:JWTAuth;
        // server info
        server: Server;
        // Pods to add sidecar
        targetPods: string[]; 
        // namedspaces
        namespaced: string[];
    };
  }

  type Server = {
    redirectPort?: string;
    port?: string;
  }
  type JWTAuth = {
    secretKey?: string;
    insecureRoutes?: string[];
  }
  type RateLimit = {
    rate?: number;
  };

  export interface WatchedPods {
    [key: string]: string;
  }
