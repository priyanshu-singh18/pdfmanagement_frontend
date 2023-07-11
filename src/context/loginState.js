import { atom } from "recoil";

export const loginStateAtom = atom({
  key: "loginState",
  default: {
    isLoggedIn: false,
    token:""
  },
  dangerouslyAllowMutability: true,
});
