import { Log } from "pepr";
import {
  AppsV1Api,
  CoreV1Api,
  KubeConfig,
  V1Secret,
  PatchUtils,
  V1Container
} from "@kubernetes/client-node";

import { fetchStatus } from "pepr";
import { GatewayBody } from "./Gateway";

export const createContainer =(gw: GatewayBody): V1Container => ({
    image: "cmwylie19/edge-proxy:0.0.1",
    name: "proxy",
    command: ["./edge-gateway","serve","-r",gw.server?.redirectPort,"-p",gw.server?.port,"rateLimit","--rate",gw.rateLimit?.rate,"jwt","-s",gw.jwtAuth.secretKey]
})
export class K8sAPI {
  k8sApi: CoreV1Api;
  k8sAppsV1Api: AppsV1Api;

  constructor() {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    this.k8sApi = kc.makeApiClient(CoreV1Api);
    this.k8sAppsV1Api = kc.makeApiClient(AppsV1Api);
  }
// Function to create a Kubernetes service
async createService(name, namespace, labels, port) {
    try {

      // Define the service object
      const serviceObject = {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
          name,
          namespace,
          labels,
        },
        spec: {
          selector: labels,
          ports: [
            {
              port: port,
              targetPort: port,
            },
          ],
          type: 'ClusterIP', // Change this to 'NodePort' or 'LoadBalancer' if needed
        },
      };
  
      // Create the service
      const response = await this.k8sApi.createNamespacedService(namespace, serviceObject);
  
      console.log(`Service "${response.body.metadata.name}" in namespace "${response.body.metadata.namespace}" created successfully.`);
    } catch (error) {
      console.error('Error creating service:', error);
    }
  }
  
  async findAndDeletePods(labels) {
  
    try {
      let options:any = {};
      if (labels) {
        options.labelSelector = Object.entries(labels)
          .map(([key, value]) => `${key}=${value}`)
          .join(',');
      }

  
      const response = await this.k8sApi.listPodForAllNamespaces(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, options);
       response.body.items.map(async po=>{
        await this.k8sApi.deleteNamespacedPod(po.metadata?.name, po.metadata?.namespace, undefined, undefined, undefined, undefined, undefined, {
            propagationPolicy: 'Foreground',
          });
      
       })
    } catch (err) {
      console.error('Error fetching pods:', err);
      return [];
    }
  }
  
}
