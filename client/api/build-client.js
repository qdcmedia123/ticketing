import axios from "axios";

// Then this is browerser
// Check the documentation you must run this command If you have the run before
// kubectl expose deployment ingress-nginx-controller --target-port=80 --type=NodePort -n kube-system
// Becacuse initally you will not fid ingress-nginx-controller in kube-system if you are using minikube
// You will have to expose then your url will work
// If you need more help then check doc folder, file name ingress-nginx-namespace-and-service-for-minikube.odt
export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on server
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.kube-system.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};
