import {
  Capability,
  Log,
  PeprRequest,
  RegisterKind,
  a,
  fetch,
  fetchStatus,
  k8s,
} from "pepr";
import {WatchedPods, Gateway, GatewayAttributes } from "../lib/Gateway"
import {K8sAPI, createContainer} from "../lib/kubernetes-api"
/**
 *  The HelloPepr Capability is an example capability to demonstrate some general concepts of Pepr.
 *  To test this capability you run `pepr dev`and then run the following command:
 *  `kubectl apply -f capabilities/hello-pepr.samples.yaml`
 */
export const Controller = new Capability({
  name: "gateway-controller",
  description: "Controller for edge gateway.",
  namespaces: [],
});

// Use the 'When' function to create a new Capability Action
const { When } = Controller;
const k8sAPI = new K8sAPI()

let proxies: GatewayAttributes = {}
RegisterKind(Gateway, {
  group: "pepr.dev",
  version: "v1beta1",
  kind: "Gateway",
});

When(Gateway)
  .IsCreatedOrUpdated()
  .Then(async gw => {

    proxies[gw.Raw?.metadata?.name] = {
      server: gw.Raw?.spec?.server,
      jwtAuth: gw.Raw?.spec?.jwtAuth,
      rateLimit: gw.Raw?.spec?.rateLimit
    }

    // find & roll pods meeting said labels
    await k8sAPI.findAndDeletePods({"proxy":gw.Raw?.metadata?.name})

  })
  When(a.Pod)
  .IsCreatedOrUpdated()
  .Then(async pod => {
    if (pod.Raw?.metadata?.labels?.["proxy"] !== undefined) {
      pod.Raw?.spec?.containers.push(createContainer(proxies[pod.Raw?.metadata?.labels?.["proxy"]]))
    }

    await k8sAPI.createService(pod.Raw?.metadata?.name+"-proxy",pod.Raw?.metadata?.namespace,{"proxy":pod.Raw?.metadata?.labels?.["proxy"]},proxies[pod.Raw?.metadata?.labels?.["proxy"]].server.port)

  })

