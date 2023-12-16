export const getExchangeData = async (currency: string) => {
  try {
    const baseurl = "/koreaxim/site/program/financial/exchangeJSON";
    const params = {
      authkey: process.env.NEXT_SERVER_KX_KEY ?? "",
      data: "AP01",
    };

    const queryString = new URLSearchParams(params).toString();
    const requrl = `${baseurl}?${queryString}`;

    const res = await fetch(requrl);
    const data = await res.json();
    if (!data) {
      throw new Error();
    }

    const result = data.find((d: any) => d?.cur_unit?.includes(currency));
    return {
      cur_unit: "JPY(100)",
      cur_nm: "",
      deal_bas_r: 913.06,
    };
  } catch (error) {
    throw error;
    console.error(error);
  }
};
