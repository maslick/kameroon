import {useLocation} from "react-router-dom";
import qs from "qs";

export const useQueryState = (query) => {
  const location = useLocation();
  return [
    qs.parse(location.search, {ignoreQueryPrefix: true, decoder: (c) => c})[query],
  ];
}