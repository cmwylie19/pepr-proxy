import {
  Capability,
  Log,
  PeprRequest,
  RegisterKind,
  a,
  fetch,
  fetchStatus,
} from "pepr";
import {WatchedPods, Gateway} from "../lib/gateway"
/**
 *  The HelloPepr Capability is an example capability to demonstrate some general concepts of Pepr.
 *  To test this capability you run `pepr dev`and then run the following command:
 *  `kubectl apply -f capabilities/hello-pepr.samples.yaml`
 */
export const HelloPepr = new Capability({
  name: "hello-pepr",
  description: "A simple example capability to show how things work.",
  namespaces: ["pepr-demo", "pepr-demo-2"],
});

// Use the 'When' function to create a new Capability Action
const { When } = HelloPepr;

let watchedPods: WatchedPods = {}
RegisterKind(Gateway, {
  group: "pepr.dev",
  version: "v1beta1",
  kind: "Gateway",
});

When(Gateway)
  .IsCreatedOrUpdated()
  .Then(gw => {
    const {port, redirectPort } = gw.Raw.spec.server;
    const { secretKey, insecureRoutes } = gw.Raw.jwtAuth;
    const { targetPods, namespaces } = gw.Raw;

    // find pods meeting said labels

    // roll pods using said labels
     


  })
  When(a.Pod)
  .IsCreatedOrUpdated()
  .Then(pod => {
    // add sidecar to pod

    // handle routing

  })

