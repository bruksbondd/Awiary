import { shallowEqual, useSelector } from 'react-redux';
import {AppStateType} from "../store";

// export const useShallowEqualSelector = (selector) => {
//   return useSelector(selector, shallowEqual);
// }

export default <TReturn,>(selector: (state: AppStateType) => TReturn) =>
  useSelector<AppStateType, TReturn>(selector, shallowEqual);
