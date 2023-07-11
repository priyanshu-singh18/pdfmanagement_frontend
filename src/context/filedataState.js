import { atom } from "recoil";

export const filedatastate = atom({
  key: "filedata",
  default: {
    file_id: "",
    file_data: "",
  },
  dangerouslyAllowMutability: true,
});
