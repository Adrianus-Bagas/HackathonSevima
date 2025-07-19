import axios from "axios";

export const GetGrid = async () => {
  const result = await axios({
    method: "get",
    url: "/generate-grid",
    baseURL: process.env.API_BASE_URL
  });

  return result.data;
};

export const GetStops = async () => {
    const result = await axios({
      method: "get",
      url: "/all",
      baseURL: process.env.API_BASE_URL
    });
  
    return result.data;
  };

  export const GetRoute = async (grid: number[][], id_departure: number, id_arrival: number) => {
    const result = await axios({
      method: "post",
      url: "/api/rute",
      baseURL: process.env.API_BASE_URL,
      data: {
        grid,
        id_departure,
        id_arrival
      }
    });
  
    return result.data;
  };