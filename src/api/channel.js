import request from "@/utils/request";

export const getchannels = () => {
  return request({
    method: "get",
    url: "/app/v1_0/user/channels"
  });
};
// 获取所有频道列表
export const getAllChannels = () => {
  return request({
    method: "GET",
    url: "/app/v1_0/channels"
  });
};
export const updateUserChannel = channels => {
  return request({
    method: "PATCH",
    url: "/app/v1_0/user/channels",
    data: {
      channels
    }
  });
};
export const deleteUserChannel = channelId => {
  return request({
    method: "DELETE",
    url: `/app/v1_0/user/channels/${channelId}`
  });
};
