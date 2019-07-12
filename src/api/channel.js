import request from "@/utils/request";

export const getchannels = () => {
  return request({
    method: "get",
    url: "/app/v1_0/user/channels"
  });
};
