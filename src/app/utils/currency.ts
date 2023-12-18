export const getExchangeData = async (currency: string) => {
  try {
    const baseurl = "/koreaxim/site/program/financial/exchangeJSON";
    const params = {
      authkey: process.env.NEXT_PUBLIC_KX_KEY ?? "",
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
    return result;
  } catch (error) {
    throw error;
    console.error(error);
  }
};
