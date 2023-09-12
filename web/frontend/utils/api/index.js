/**
 * The `generateUserforScript` function sends a POST request to create a new user with Shopify data,
 * while the `getUserDataById` function retrieves user data by shop ID and updates state variables
 * accordingly.
 * @param data - The `data` parameter is an object that contains the following properties:
 * @returns The function `generateUserforScript` returns the `data.data` object if the response status
 * is 201. If the response status is not 201, it does not return anything. If there is an error during
 * the fetch request, it does not return anything.
 */
export const generateUserforScript = async (data) => {
  console.log(data)
    const sendData = {
      "shop": data?.name,
      "shop_id":data?.id,
      "shop_name": data?.name,
      "email": data?.email,
      "domain": data?.myshopify_domain,
      "country": data?.country_name,
      "is_script_added": true
    };


    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendData),
    };

    try {
      const res = await fetch("https://apishopify.openinapp.com/api/v1/user/create-shopify-user", requestOptions)

      if (res.status === 201) {
        const data = await res.json();
        return data.data;
      } else {
        return null;
        // setToastProps({
        //   content: t("ProductsCard.errorWithUserDataToast"),
        //   error: true,
        // });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      return null;
    }



  };


/**
 * The function `getUserDataById` makes an API request to retrieve user data by shop ID, and then sets
 * the state variables `setNodataState` and `setAnalyticsData` based on the response.
 * @param shopID - The shopID parameter is the unique identifier for a specific shop in the Shopify
 * platform. It is used to retrieve the user data for that particular shop.
 * @param setNodataState - A function that sets the state of a variable indicating whether there is no
 * data available.
 * @param setAnalyticsData - `setAnalyticsData` is a function that is used to update the state with the
 * analytics data received from the API response.
 * @returns the data object if the response status is 200. If the response status is not 200, it is
 * returning the response status. If there is an error during the fetch request, it is returning the
 * error.
 */
  export const getUserDataById = async (shopID,setNodataState,setAnalyticsData) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },

    };
    try {
      const res = await fetch(`https://apishopify.openinapp.com/api/v1/user/get-shopify-user?id=${shopID}`, requestOptions)
     
      if (res.status === 200) {       
        const data = await res.json();
        setAnalyticsData(data.data.analytics);
        setNodataState(data?.data?.analytics?.totalInappBrowserVisits === 0 ? true : false)
        return data.data;
      } else {
        return res.status;
      }

    } catch (err) {
      return err;
    }
  }

